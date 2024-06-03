import { Schema, model, models } from "mongoose";

const IdentificationHistorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "A identification history must belong to a user"],
            ref: "User", // Reference to the User model
        },
        date: {
            type: Date,
        },
        inputImageUrl: {
            type: String,
        },
        inputImageId: {
            type: String,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        updatedAt: {
            type: Date,
        },
        updatedBy: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    }
);

const IdentificationHistoryModel =
    models.IdentificationHistory ||
    model("IdentificationHistory", IdentificationHistorySchema);

export default IdentificationHistoryModel;
