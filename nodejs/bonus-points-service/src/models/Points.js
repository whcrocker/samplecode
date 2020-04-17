/**
 * Mongoose schema definition for the bonus points object.
 *
 * Author: Henry Crocker
 *
 */
const mongoose = require("mongoose");

const PointsSchema = new mongoose.Schema(
    {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        points: {
            type: Number,
            required: true,
            default: 0
        },
        notes: {
            type: String,
            required: false
        },
        // reference to SKU object to which these points are assigned
        sku: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "SKU"
        }
    },
    {
        timestamps: true
    }
);

/**
 * Verify that:
 *    - the endDate occurs after the startDate
 *    - the points value is non-negative
 */
PointsSchema.pre("validate", next => {
    if (this.startDate > this.endDate) {
        this.invalidate(
            "startDate",
            "Start Date must be less than End Date.",
            this.startDate
        );
    }

    if (this.points < 0) {
        this.invalidate(
            "points",
            "Points must be a positive number.",
            this.points
        );
    }

    next();
});

const Points = mongoose.model("Points", PointsSchema);

module.exports = Points;
