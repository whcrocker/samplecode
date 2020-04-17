const https = require("https");
const http = require("http");

/**
 * Makes an HTTPS/HTTP call using the options object as input.
 */
const executeRequest = (options) => {
    const protocolObj = (options.protocol === "https:" ? https :  http);

    return new Promise((resolve, reject) => {
        const req = protocolObj.request(options, resp => {
            let data = "";
            const statusCode = resp.statusCode;

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                resolve({
                    statusCode,
                    body: data
                });
            });
        });

        req.on("error", err => {
            resolve({
                statusCode: 400,
                error: err.message
            });
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
};

const getQuoteData = async () => {
    const quoteData = await executeRequest({
        protocol: "https:",
        hostname: "programming-quotes-api.herokuapp.com",
        path: "/quotes/random",
        method: "GET"
    });

    let error = null;
    let data = null;
    let statusCode = null;

    if (quoteData) {
        statusCode = quoteData.statusCode;

        if (quoteData.error) {
            error = "The quote query returned error: " + quoteData.error;
        } else {
            if (statusCode === 200) {
                data = JSON.parse(quoteData.body);
            } else {
                error = "The quote query failed with status: " + statusCode;
            }
        }
    } else {
        statusCode = 500;
        error = "Quote query returned no data.";
    }

    return error ? { statusCode, error } : { statusCode, data };
};

module.exports = {
    executeRequest,
    getQuoteData
};
