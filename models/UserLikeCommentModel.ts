import { Schema, model, models } from "mongoose";

const UserLikeCommentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true],
            ref: "User", // Reference to the User model
        },
        commentId: {
            type: Schema.Types.ObjectId,
            required: [true],
            ref: "Comment", // Reference to the Comment model
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    }
);

const UserLikeCommentModel =
    models.UserLikeComment || model("UserLikeComment", UserLikeCommentSchema);

export default UserLikeCommentModel;
