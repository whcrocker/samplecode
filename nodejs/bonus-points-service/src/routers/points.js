/**
 * Express router for the points endpoint.  Routes are defined to get a single point,
 * get all points, get a specific point, patch a given point, and delete a specific point.
 *
 * Author: Henry Crocker
 */
const express = require("express");
const Points = require("../models/Points");

const router = new express.Router();

/**
 * Allows for the creation of a new bonus points object.
 *
 * Response Codes:
 *    201: successful object creation
 *    500: server error saving object
 *
 */
router.post("/points", async (req, resp) => {
    // create a new Points model from data in the request body
    let points = new Points({
        ...req.body
    });

    try {
        await points.save();
        resp.status(201).send(points);
    } catch (e) {
        resp.status(500).send();
    }
});

/**
 * Gets all bonus point objects.  Returned fields are restricted to _id, sku, and skuName.
 *
 * Response Codes:
 *    200: successful
 *    500: server error retrieving objects
 *
 */
router.get("/points", async (req, resp) => {
    try {
        const pointsList = await Points.find().populate(
            "sku",
            "_id sku skuName"
        );
        resp.send(pointsList);
    } catch (e) {
        console.log(e);
        resp.status(500).send();
    }
});

/**
 * Gets a bonus point object with a specific ID value.  The ID value is specified as a path param.
 * Returned fields are restricted to _id, sku, and skuName.
 *
 * Response Codes:
 *    200: successful
 *    404: no bonus points object found with the specified ID
 *    500: server error retrieving objects
 *
 */
router.get("/points/:id", async (req, resp) => {
    try {
        let points = await Points.findOne({ _id: req.params.id }).populate(
            "sku",
            "_id sku skuName"
        );

        if (points) {
            resp.send(points);
        } else {
            resp.status(404).send();
        }
    } catch (e) {
        resp.status(500).send();
    }
});

/**
 * Update values of a bonus point object for a specific ID value.  The ID value is specified as a path param.
 * Updatable fields are restricted to startDate, endDate, points, and notes.
 *
 * Response Codes:
 *    200: successful update
 *    400: invalid field (non-updatable) included in the patch object
 *    404: points object with specified ID does not exist
 *    500: server error
 *
 */
router.patch("/points/:id", async (req, resp) => {
    let updates = Object.keys(req.body);
    let allowedUpdates = ["startDate", "endDate", "points", "notes"];
    let isValidOperation = updates.every(update =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        resp.status(400).send(
            '{error: "An attempt was made to update a nonexistent property or one that does not allow updates."}'
        );
    } else {
        try {
            let points = await Points.findOne({ _id: req.params.id });

            if (points) {
                updates.forEach(update => (points[update] = req.body[update]));
                await points.save();
                resp.send(points);
            } else {
                resp.status(404).send();
            }
        } catch (e) {
            resp.status(500).send(e);
        }
    }
});

/**
 * Deletes a bonus point object for a specific ID value.  The ID value is specified as a path param.
 * Returns the object deleted.
 *
 * Response Codes:
 *    200: successful delete
 *    404: points object with specified ID does not exist
 *    500: server error
 *
 */
router.delete("/points/:id", async (req, resp) => {
    try {
        let points = await Points.findOneAndDelete({ _id: req.params.id });

        if (points) {
            resp.send(points);
        } else {
            resp.status(404).send();
        }
    } catch (e) {
        resp.status(500).send();
    }
});

module.exports = router;
