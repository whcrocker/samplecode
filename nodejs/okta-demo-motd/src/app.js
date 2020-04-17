const express = require("express");
const cors = require("cors");
const quote = require("./quote");
const authRequired = require("./auth");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/motd", authRequired, 
        (req, resp) => {
            quote((error, quoteData) => {
                if (error) {
                    resp.send({ error });
                } 
                else {
                    resp.send(quoteData);
                }
            });
        }
);

app.get("*", (req, resp) => {
    resp.status(404).send({
        message: "Invalid Request"
    });
});

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
});

module.exports = app;
