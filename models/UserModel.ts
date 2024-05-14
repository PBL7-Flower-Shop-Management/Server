import { Schema, model, models } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            maxLength: 200,
            trim: true,
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
            validate: {
                validator: function (value: any) {
                    return /^[0-9]+$/u.test(value);
                },
                message: "CitizenId field only contains numbers!",
            },
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            trim: true,
            unique: true,
            validate: [validator.isEmail, "Please provide a valid email!"],
        },
        phoneNumber: {
            type: String,
            maxLength: 20,
            trim: true,
            validate: {
                validator: function (value: any) {
                    return /^[0-9]+$/u.test(value);
                },
                message: "Phone number field only contains numbers!",
            },
        },
        role: {
            type: String,
            enum: ["Admin", "Employee", "Customer"],
            default: "Customer",
        },
        avatar: {
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

UserSchema.virtual("Account", {
    ref: "Account",
    foreignField: "User",
    localField: "_id",
    justOne: true,
});

const UserModel = models.User || model("User", UserSchema);

export default UserModel;