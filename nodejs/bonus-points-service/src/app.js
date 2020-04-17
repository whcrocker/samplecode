/**
 * Main application.  It imports the express routers for SKU and bonus point processing. It
 * uses Mongoose for the MongoDB ORM. CORS is enabled in case the client and service are
 * installed on separate servers.
 *
 * author: Henry Crocker
 *
 */
const express = require("express");
const cors = require("cors");

require("./db/mongoose");
const skuRouter = require("./routers/sku");
const pointsRouter = require("./routers/points");

const app = express();

app.use(cors());
app.use(express.json());
app.use(skuRouter);
app.use(pointsRouter);

module.exports = app;
