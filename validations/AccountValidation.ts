import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    CreateAccountSchema: yup.object({
        body: yup
            .object({
                name: yup
                    .string()
                    .trim()
                    .required("Name is required")
                    .matches(
                        /^[ \p{L}]+$/u,
                        "Name field only contains unicode characters or spaces!"
                    ),
                citizenId: yup
                    .string()
                    .trim()
                    .matches(
                        /^[0-9]+$/u,
                        "CitizenId field only contains numbers!"
                    ),
                email: yup
                    .string()
                    .trim()
                    .required("Email is required")
                    .email("Please provide a valid email!"),
                phoneNumber: yup
                    .string()
                    .trim()
                    .matches(
                        /^[0-9]+$/u,
                        "Phone number field only contains numbers!"
                    ),
                avatar: yup.string().trim(),
                isActived: yup.boolean().nullable().default(false),
                role: yup
                    .string()
                    .trim()
                    .nullable()
                    .oneOf(["Admin", "Employee", "Customer"], "Invalid role")
                    .default("Customer"),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    UpdateAccountSchema: yup.object({
        body: yup
            .object({
                _id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid account id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
                name: yup
                    .string()
                    .trim()
                    .required("Name is required")
                    .matches(
                        /^[ \p{L}]+$/u,
                        "Name field only contains unicode characters or spaces!"
                    ),
                citizenId: yup
                    .string()
                    .trim()
                    .matches(
                        /^[0-9]+$/u,
                        "CitizenId field only contains numbers!"
                    ),
                email: yup
                    .string()
                    .trim()
                    .required("Email is required")
                    .email("Please provide a valid email!"),
                phoneNumber: yup
                    .string()
                    .trim()
                    .matches(
                        /^[0-9]+$/u,
                        "Phone number field only contains numbers!"
                    ),
                avatar: yup.string().trim(),
                // isActived: yup.boolean().nullable().default(false),
                role: yup
                    .string()
                    .trim()
                    .nullable()
                    .oneOf(["Admin", "Employee", "Customer"], "Invalid role")
                    .default("Customer"),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    LockUnLockAccountSchema: yup.object({
        body: yup
            .object({
                _id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid account id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
                isActived: yup.boolean().default(false),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    GetByIdSchema: yup.object({
        params: yup
            .object({
                id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid account id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    DeleteAccountSchema: yup.object({
        params: yup
            .object({
                id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid account id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    GetAllAccountSchema: yup.object({
        query: yup
            .object({
                keyword: yup.string().trim().nullable(),
                pageNumber: yup
                    .number()
                    .integer()
                    .nullable()
                    .transform((curr, orig) => (orig === "" ? null : curr))
                    .min(1)
                    .default(1),
                pageSize: yup
                    .number()
                    .integer()
                    .nullable()
                    .transform((curr, orig) => (orig === "" ? null : curr))
                    .min(1)
                    .default(10),
                isExport: yup.boolean().nullable().default(false),
                orderBy: yup.string().trim().nullable(),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    AdminResetPasswordSchema: yup.object({
        body: yup
            .object({
                _id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid account id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    ForgotPasswordSchema: yup.object({
        body: yup
            .object({
                email: yup
                    .string()
                    .trim()
                    .required("Email is required")
                    .email("Please provide a valid email!"),
                resetPasswordPageUrl: yup
                    .string()
                    .trim()
                    .required("Reset Password Page URL is required")
                    // .url("Please provide a valid URL!")
                    .matches(
                        /^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?::\d{1,5})?\/reset-password(?:\/|\?|$)|^http:\/\/localhost:\d{1,5}\/reset-password(?:\/|\?|$)/,
                        "URL must be a valid reset password page URL"
                    ),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    ResetPasswordSchema: yup.object({
        body: yup
            .object({
                email: yup
                    .string()
                    .trim()
                    .required("Email is required")
                    .email("Please provide a valid email!"),
                password: yup
                    .string()
                    .trim()
                    .required("Password field is required!")
                    .min(8, "Password length must be greater than 8!")
                    .test(
                        "has-lower",
                        "Password must contain at least one lowercase letter.",
                        (value) => /[a-z]/.test(value)
                    )
                    .test(
                        "has-upper",
                        "Password must contain at least one uppercase letter.",
                        (value) => /[A-Z]/.test(value)
                    )
                    .test(
                        "has-number",
                        "Password must contain at least one number.",
                        (value) => /\d/.test(value)
                    )
                    .test(
                        "has-special",
                        "Password must contain at least one special character (@$!%*?&).",
                        (value) => /[\@\$\!\%\*\?\&]/.test(value)
                    )
                    .matches(
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        "Password only contains allowed characters!"
                    ),
                confirmPassword: yup
                    .string()
                    .trim()
                    .required("Confirm password is required")
                    .test(
                        "passwords-match",
                        "Confirm password field must match with password field",
                        function (value) {
                            // Check if confirmPassword is not null or undefined
                            if (!value) return false;

                            // Access the 'password' field value via 'this.parent.password'
                            return value === this.parent.password;
                        }
                    ),
                token: yup.string().trim().required("Token is required"),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),
};

export default schemas;
