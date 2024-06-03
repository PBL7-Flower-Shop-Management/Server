import { Schema, model, models } from "mongoose";

const IdentificationResultSchema = new Schema(
    {
        identificationHistoryId: {
            type: Schema.Types.ObjectId,
            required: [
                true,
                "A identification result must belong to a identification history",
            ],
            ref: "IdentificationHistory", // Reference to the IdentificationHistory model
        },
        flowerEnglishName: {
            type: String,
        },
        flowerVietnameseName: {
            type: String,
        },
        accuracy: {
            type: Number,
        },
        imageUrl: {
            type: String,
        },
        imageId: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    }
);

const IdentificationResultModel =
    models.IdentificationResult ||
    model("IdentificationResult", IdentificationResultSchema);

export default IdentificationResultModel;
