import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const SALT_WORK_FACTOR = 10;

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
            validate: {
                validator: function (value: any) {
                    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                        value
                    );
                },
                message: "Password only contains allowed characters!",
            },
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    }
);

AccountSchema.pre("save", async function (next) {
    var user = this;

    // Only run this function if password was actually modified
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

AccountSchema.methods.comparePassword = function (
    candidatePassword: string,
    cb: any
) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        if (!isMatch) {
            return cb(null, false, {
                message:
                    "Confirm Password field does not match with Password field!",
            });
        }
        cb(null, true);
    });
};

AccountSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const AccountModel = models.Account || model("Account", AccountSchema);

export default AccountModel;
