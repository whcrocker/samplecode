import https from "https";
import http from "http";
//import btoa from "btoa";
//import querystring from "querystring";
//import motdConfig from "../config/motdConfig";
//import config from "../config/config";
//import NodeCache from "node-cache";

//const tokenCache = new NodeCache();
//const TOKEN_KEY = "apiToken";

/**
 * Makes an HTTPS/HTTP call using the options object as input.
 */
const executeRequest = options => {
    const protocolObj =
        options.protocol && options.protocol === "https:" ? https : http;

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

const getQuoteData = async token => {
    //const auth = await getApiAuth(); // TODO - the call to this function fails

    let error = null;
    let data = null;
    let statusCode = null;

    const options = {
        protocol: "http:",
        hostname: "localhost",
        port: 3000,
        path: "/motd",
        method: "GET",
        headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`
        }
    };

    const quoteData = await executeRequest(options);

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

    return error
        ? {
              statusCode,
              error
          }
        : {
              statusCode,
              data
          };
};

/*
function getIssuerHostname() {
    const noProtocol = config.issuer.split("https://")[1];
    const hasNoSuffix = noProtocol.split("com/")[0];
    return hasNoSuffix + "com";
}

function getIssuerTokenPath() {
    const noProtocol = config.issuer.split("https://")[1];
    const pathNoLeading = noProtocol.split("com/")[1];
    return "/" + pathNoLeading + "/v1/token";
}
*/

/*
const getApiAuth = async () => {
    let data = tokenCache.get(TOKEN_KEY);

    if (data === undefined) {
        const token = btoa(`${motdConfig.clientId}:${motdConfig.clientSecret}`);

        const payload = querystring.stringify({
            grant_type: "client_credentials",
            scope: motdConfig.scope
        });

        const options = {
            protocol: "https:",
            hostname: getIssuerHostname(),
            path: getIssuerTokenPath(),
            method: "POST",
            headers: {
                Authorization: `Basic ${token}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": payload.length
            },
            body: payload,
            agent: null
        };

        // TODO - THIS CALL BREAKS - complains about "origin" as a header
        const auth = await executeRequest(https, options);

        //console.log("**** AUTH: ", auth);

        if (auth) {
            if (auth.error) {
                console.log("The token request returned error: " + auth.error);
            } else {
                if (auth.statusCode === 200) {
                    data = JSON.parse(auth.body);
                    tokenCache.set(TOKEN_KEY, data, data.expires_in);
                } else {
                    console.log(
                        "The token request failed with status: " +
                            auth.statusCode
                    );
                }
            }
        } else {
            console.log("Token request returned no data.");
        }
    }

    return data;
};
*/

export { executeRequest, getQuoteData /*, getApiAuth*/ };
