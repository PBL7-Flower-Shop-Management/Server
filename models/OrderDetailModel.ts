import { Schema, model, models } from "mongoose";

const OrderDetailSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            required: [true, "A order detail must belong to a order"],
            ref: "Order", // Reference to the Order model
        },
        flowerId: {
            type: Schema.Types.ObjectId,
            required: [true, "A order detail must have a flower"],
            ref: "Flower", // Reference to the Flower model
        },
        unitPrice: {
            type: Number,
            min: [0, "Unit price cannot be negative!"],
        },
        discount: {
            type: Number,
            min: [0, "Discount cannot be negative!"],
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

// Create a compound index on orderId and flowerId
OrderDetailSchema.index({ orderId: 1, flowerId: 1 }, { unique: true });

const OrderDetailModel =
    models.OrderDetail || model("OrderDetail", OrderDetailSchema);

export default OrderDetailModel;
