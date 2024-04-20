import { Schema, model, models } from "mongoose";

const CartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "A cart must belong to a user"],
            ref: "User", // Reference to the User model
        },
        cropId: {
            type: Schema.Types.ObjectId,
            required: [true, "A cart must have a crop"],
            ref: "Crop", // Reference to the Crop model
        },
        numberOfCrops: {
            type: Number,
            min: [1, "Number of crops must be positive!"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create a compound index on userId and cropId
CartSchema.index({ userId: 1, cropId: 1 }, { unique: true });

const CartModel = models.Cart || model("Cart", CartSchema);

module.exports = CartModel;
