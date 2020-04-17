/**
 * Main application.  Services the index.html page from the public directory.
 *
 * Author: Henry Crocker
 *
 */
const path = require("path");
const express = require("express");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(publicPath));

app.get("*", (req, resp) => {
    resp.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
    console.log(`Bonus Points server is listening on port ${port}...`);
});
