import { Schema, model, models } from "mongoose";

const OrderDetailSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            required: [true, "A order detail must belong to a order"],
            ref: "Order", // Reference to the Order model
        },
        cropId: {
            type: Schema.Types.ObjectId,
            required: [true, "A order detail must have a crop"],
            ref: "Crop", // Reference to the Crop model
        },
        unitPrice: {
            type: Number,
            min: [0, "Unit price cannot be negative!"],
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

// Create a compound index on orderId and cropId
OrderDetailSchema.index({ orderId: 1, cropId: 1 }, { unique: true });

const OrderDetailModel =
    models.OrderDetail || model("OrderDetail", OrderDetailSchema);

module.exports = OrderDetailModel;
