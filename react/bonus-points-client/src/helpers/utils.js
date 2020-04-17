/**
 * Contains utility functions used throughout the client.
 *
 * Author: Henry Crocker
 *
 */
const https = require("https");
const http = require("http");

const HOST_NAME =
    "bonus-points-service-app-cmmps.apps.us-east-1.starter.openshift-online.com";

/**
 * Makes an HTTPS/HTTP call using the options object as input.  The options object should not
 * be null or undefined.  Used this to limit dependencies, i.e. use the native HTTP library.
 * This helps when working with simple AWS Lambdas.
 */
const executeRequest = options => {
    const protocolObj = options.protocol === "https:" ? https : http;

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

// compute the number of days between two dates
const computeDays = (earlierDate, laterDate) => {
    return Math.round(
        earlierDate && laterDate
            ? (new Date(laterDate) - new Date(earlierDate)) / 86400000 + 1
            : 0
    );
};

// get SKU data for a given sku name.
const getSkuData = async sku => {
    const skuData = await executeRequest({
        protocol: "https:",
        hostname: HOST_NAME,
        path: `/skus/sku/${sku}`,
        method: "GET"
    });

    let error = null;
    let data = null;
    let statusCode = null;

    if (skuData) {
        statusCode = skuData.statusCode;

        if (skuData.error) {
            error = "The SKU query returned error: " + skuData.error;
        } else {
            if (statusCode === 200) {
                data = JSON.parse(skuData.body);
            } else {
                error = "The SKU query failed with status: " + statusCode;
            }
        }
    } else {
        statusCode = 500;
        error = "SKU query returned no data.";
    }

    return error ? { statusCode, error } : { statusCode, data };
};

// Call a service to save bonus points information from the live data table.
const savePointsData = async newData => {
    const pointsData = await executeRequest({
        protocol: "https:",
        hostname: HOST_NAME,
        path: "/points",
        method: "POST",
        body: newData,
        headers: {
            "Content-Type": "application/json",
            "Content-Length": newData.length
        }
    });

    let error = null;
    let data = null;
    let statusCode = null;

    if (pointsData) {
        statusCode = pointsData.statusCode;

        if (pointsData.error) {
            error = "The Points save returned error: " + pointsData.error;
        } else {
            if (statusCode === 201) {
                data = JSON.parse(pointsData.body);
            } else {
                error = "Save failed with status code: " + statusCode;
            }
        }
    } else {
        statusCode = 500;
        error = "Points save returned no data.";
    }

    return error ? { statusCode, error } : { statusCode, data };
};

// Calls a service to delete a bonus point object from the database.
const deletePointsData = async pointsId => {
    const pointsData = await executeRequest({
        protocol: "https:",
        hostname: HOST_NAME,
        path: `/points/${pointsId}`,
        method: "DELETE"
    });

    let error = null;
    let data = null;
    let statusCode = null;

    if (pointsData) {
        statusCode = pointsData.statusCode;

        if (pointsData.error) {
            error = "The Points delete returned error: " + pointsData.error;
        } else {
            if (statusCode === 200) {
                data = JSON.parse(pointsData.body);
            } else {
                error = "Delete failed with status code: " + statusCode;
            }
        }
    } else {
        statusCode = 500;
        error = "Points delete returned no data.";
    }

    return error ? { statusCode, error } : { statusCode, data };
};

// Call a service to update existing bonus points information from the live data table.
const updatePointsData = async (pointsId, newData) => {
    const pointsData = await executeRequest({
        protocol: "https:",
        hostname: HOST_NAME,
        path: `/points/${pointsId}`,
        body: newData,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": newData.length
        }
    });

    let error = null;
    let data = null;
    let statusCode = null;

    if (pointsData) {
        statusCode = pointsData.statusCode;

        if (pointsData.error) {
            error = "The Points update returned error: " + pointsData.error;
        } else {
            if (statusCode === 200) {
                data = JSON.parse(pointsData.body);
            } else {
                error = "Update failed with status code: " + statusCode;
            }
        }
    } else {
        statusCode = 500;
        error = "Points update returned no data.";
    }

    return error ? { statusCode, error } : { statusCode, data };
};

// Generate a random integer between two values.  Expects both values to be non-negative and
// the max value is greater than or equal to the min value.
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Call a service to load all bonus points from the database.
const loadPointsData = async () => {
    const pointsData = await executeRequest({
        protocol: "https:",
        hostname: HOST_NAME,
        path: `/points`,
        method: "GET"
    });

    let data = null;
    let statusCode = null;

    if (pointsData) {
        statusCode = pointsData.statusCode;

        if (pointsData.body) {
            if (statusCode === 200) {
                body = JSON.parse(pointsData.body);

                data = body.map(item => {
                    return {
                        id: item._id,
                        skuId: item.sku._id,
                        sku: item.sku.sku,
                        skuName: item.sku.skuName,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        points: item.points,
                        notes: item.notes
                    };
                });
            }
        }
    }

    return data;
};

module.exports = {
    executeRequest,
    computeDays,
    getSkuData,
    savePointsData,
    deletePointsData,
    updatePointsData,
    getRandomNumber,
    loadPointsData
};
