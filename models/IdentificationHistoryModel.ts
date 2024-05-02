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
        inputImage: {
            type: String,
        },
        createdAt: {
            type: Date,
        },
        createdBy: {
            type: String,
        },
        updatedAt: {
            type: Date,
        },
        updatedBy: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const IdentificationHistoryModel =
    models.IdentificationHistory ||
    model("IdentificationHistory", IdentificationHistorySchema);

export default IdentificationHistoryModel;
