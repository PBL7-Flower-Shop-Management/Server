import { Schema, model, models } from "mongoose";

const FavoriteCategorySchema = new Schema(
    {
        flowerId: {
            type: Schema.Types.ObjectId,
            required: [true, "A flower category must belong to a flower"],
            ref: "Flower", // Reference to the Flower model
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: [true, "A favorite flower must reference a category"],
            ref: "Category", // Reference to the Category model
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create a compound index on categoryId and flowerId
FavoriteCategorySchema.index({ categoryId: 1, flowerId: 1 }, { unique: true });

const FavoriteCategoryModel =
    models.FavoriteCategory ||
    model("FavoriteCategory", FavoriteCategorySchema);

module.exports = FavoriteCategoryModel;
