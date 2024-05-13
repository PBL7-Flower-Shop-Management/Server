import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: [true, "Category name is required!"],
            trim: true,
            validate: {
                validator: function (value: any) {
                    return /^[\w\d\s\/\-]+$/.test(value);
                },
                message:
                    "Category name only contains characters, number, space, slash and dash!",
            },
        },
        image: {
            type: String,
        },
        description: {
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

const CategoryModel = models.Category || model("Category", CategorySchema);

export default CategoryModel;
