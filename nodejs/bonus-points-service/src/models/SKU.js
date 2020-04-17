/**
 * Mongoose schema definition for the SKU object.
 *
 * Author: Henry Crocker
 *
 */
const mongoose = require("mongoose");

const SKUSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        skuName: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

// a SKU may have 0 or more bonus points assigned
SKUSchema.virtual("points", {
    ref: "Points",
    localField: "_id",
    foreignField: "sku"
});

const SKU = mongoose.model("SKU", SKUSchema);

module.exports = SKU;
