/**
 * Express router for the skus endpoint.  Routes are defined to get a single sku, get all skus,
 * get a specific sku by id, and get a specific sku by name.
 *
 * Author: Henry Crocker
 */
const express = require("express");
const SKU = require("../models/SKU");

const router = new express.Router();

/**
 * Allows for the creation of a new SKU object.
 *
 * Response Codes:
 *    201: successful object creation
 *    500: server error saving object
 *
 */
router.post("/skus", async (req, resp) => {
    console.log("req.body: ", req.body);
    let sku = new SKU({
        ...req.body
    });

    try {
        await sku.save();
        resp.status(201).send(sku);
    } catch (e) {
        console.log(e);
        resp.status(500).send();
    }
});

/**
 * Gets all SKU objects.  Returned fields are restricted to _id, startDate, endDate, points, and notes.
 *
 * Response Codes:
 *    200: successful
 *    500: server error retrieving objects
 *
 */
router.get("/skus", async (req, resp) => {
    try {
        const skuList = await SKU.find().populate(
            "points",
            "_id startDate endDate points notes"
        );
        resp.send(skuList);
    } catch (e) {
        console.log(e);
        resp.status(500).send();
    }
});

/**
 * Gets a SKU object with a specific ID value.  The ID value is specified as a path param.
 * Returned fields are restricted to _id, startDate, endDate, points, and notes.
 *
 * Response Codes:
 *    200: successful
 *    404: no SKU object found with the specified ID
 *    500: server error retrieving objects
 *
 */
router.get("/skus/:id", async (req, resp) => {
    try {
        let sku = await SKU.findOne({ _id: req.params.id }).populate(
            "points",
            "_id startDate endDate points notes"
        );

        if (sku) {
            resp.send(sku);
        } else {
            resp.status(404).send();
        }
    } catch (e) {
        resp.status(500).send();
    }
});

/**
 * Gets a SKU object with a specific name value.  The name value is specified as a path param.
 *
 * Response Codes:
 *    200: successful
 *    404: no SKU object found with the specified ID
 *    500: server error retrieving objects
 *
 */
router.get("/skus/sku/:sku", async (req, resp) => {
    try {
        let sku = await SKU.findOne({ sku: req.params.sku });

        if (sku) {
            resp.send(sku);
        } else {
            resp.status(404).send();
        }
    } catch (e) {
        resp.status(500).send();
    }
});

module.exports = router;
