import { Schema, model, models } from "mongoose";

const CartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "A cart must belong to a user"],
            ref: "User", // Reference to the User model
        },
        flowerId: {
            type: Schema.Types.ObjectId,
            required: [true, "A cart must have a flower"],
            ref: "Flower", // Reference to the Flower model
        },
        numberOfFlowers: {
            type: Number,
            min: [1, "Number of flowers must be positive!"],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create a compound index on userId and flowerId
CartSchema.index({ userId: 1, flowerId: 1 }, { unique: true });

const CartModel = models.Cart || model("Cart", CartSchema);

export default CartModel;
