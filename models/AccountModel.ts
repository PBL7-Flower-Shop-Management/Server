import { Schema, model, models } from "mongoose";

const AccountSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, "A account must belong to a user"],
            ref: "User", // Reference to the User model
        },
        isActived: {
            type: Boolean,
            default: false,
        },
        username: {
            type: String,
            maxLength: 100,
            required: [true, "Username field is required!"],
            trim: true,
            unique: true,
            validate: {
                validator: function (value: any) {
                    return /^[a-zA-Z0-9_]+$/.test(value);
                },
                message:
                    "Username only contains a-z characters, numbers and underscore!",
            },
        },
        password: {
            type: String,
            minLength: 8,
            required: [true, "Password field is required!"],
            trim: true,
        },
        token: {
            type: String,
        },
        tokenExpireTime: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
        refreshTokenExpireTime: {
            type: Date,
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

const AccountModel = models.Account || model("Account", AccountSchema);

export default AccountModel;
