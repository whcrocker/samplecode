/**
 * Configuration file for Mongoose ORM.  The following environment variables are
 * expected.  If applicable, defaults are specified.
 *
 * MONGO_HOST: IP Address or host name of the MongoDB server (default: 127.0.0.1)
 * MONGO_DB: Name of MongoDB database (default: pointsdb)
 * MONGO_USER: Username required for connection
 * MONGO_PW: Password required for connection
 *
 * Author: Henry Crocker
 *
 */
const mongoose = require("mongoose");

const mongoHost = process.env.MONGO_HOST || "127.0.0.1";
const mongoDB = process.env.MONGO_DB || "pointsdb";
const connectionURL = `mongodb://${mongoHost}:27017/${mongoDB}`;
const connectionOptions = {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PW,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(connectionURL, connectionOptions);

mongoose.connection.on("connected", function() {
    console.log("Mongoose default connection is open to ", connectionURL);
});

mongoose.connection.on("error", function(err) {
    console.log("Mongoose default connection has occured " + err + " error");
});

mongoose.connection.on("disconnected", function() {
    console.log("Mongoose default connection is disconnected");
});
