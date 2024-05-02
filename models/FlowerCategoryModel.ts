import { Schema, model, models } from "mongoose";

const FlowerCategorySchema = new Schema(
    {
        flowerId: {
            type: Schema.Types.ObjectId,
            required: [true, "A flower category must reference a flower"],
            ref: "Flower", // Reference to the Flower model
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: [true, "A flower category must reference a category"],
            ref: "Category", // Reference to the Category model
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create a compound index on categoryId and flowerId
FlowerCategorySchema.index({ categoryId: 1, flowerId: 1 }, { unique: true });

const FlowerCategoryModel =
    models.FlowerCategory || model("FlowerCategory", FlowerCategorySchema);

export default FlowerCategoryModel;
