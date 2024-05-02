import { Schema, model, models } from "mongoose";

const FavoriteFlowerSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "A favorite flower must belong to a user"],
            ref: "User", // Reference to the User model
        },
        flowerId: {
            type: Schema.Types.ObjectId,
            required: [true, "A favorite flower must reference a Flower"],
            ref: "Flower", // Reference to the Flower model
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Create a compound index on userId and flowerId
FavoriteFlowerSchema.index({ userId: 1, flowerId: 1 }, { unique: true });

const FavoriteFlowerModel =
    models.FavoriteFlower || model("FavoriteFlower", FavoriteFlowerSchema);

export default FavoriteFlowerModel;
