import { Schema, model, models } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            maxLength: 200,
            trim: true,
            required: [true, "Name is required!"],
            validate: {
                validator: function (value: any) {
                    return /^[ \p{L}]+$/u.test(value);
                },
                message:
                    "Name field only contains unicode characters or spaces!",
            },
        },
        citizenId: {
            type: String,
            maxLength: 20,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            maxLength: 20,
            trim: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Employee", "Customer"],
            default: "Customer",
        },
        avatarUrl: {
            type: String,
        },
        avatarId: {
            type: String,
        },
        providers: { type: [String], default: [] },
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

UserSchema.virtual("Account", {
    ref: "Account",
    foreignField: "User",
    localField: "_id",
    justOne: true,
});

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
