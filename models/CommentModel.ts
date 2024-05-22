import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
    {
        content: {
            type: String,
            required: [true, "Comment content field is required!"],
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "A comment must belong to a user"],
            ref: "User", // Reference to the User model
        },
        orderDetailId: {
            type: Schema.Types.ObjectId,
            required: [true, "A comment must belong to a orderdetail"],
            ref: "OrderDetail", // Reference to the OrderDetail model
        },
        numberOfStars: {
            type: Number,
            min: [0, "Number of stars cannot be negative!"],
            max: [5, "Number of stars cannot greater than 5!"],
            default: 0,
        },
        numberOfLikes: {
            type: Number,
            min: [0, "Number of likes cannot be negative!"],
            default: 0,
        },
        commentDate: {
            type: Date,
        },
        imageVideoFiles: {
            type: [String],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    }
);

const CommentModel = models.Comment || model("Comment", CommentSchema);

export default CommentModel;
