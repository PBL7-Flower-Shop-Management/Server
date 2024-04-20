import { Schema, model, models } from "mongoose";

const FavoriteCropSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "A favorite crop must belong to a user"],
            ref: "User", // Reference to the User model
        },
        cropId: {
            type: Schema.Types.ObjectId,
            required: [true, "A favorite crop must reference a crop"],
            ref: "Crop", // Reference to the Crop model
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create a compound index on userId and cropId
FavoriteCropSchema.index({ userId: 1, cropId: 1 }, { unique: true });

const FavoriteCropModel =
    models.FavoriteCrop || model("FavoriteCrop", FavoriteCropSchema);

module.exports = FavoriteCropModel;
