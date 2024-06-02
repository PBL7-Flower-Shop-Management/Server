import * as yup from "yup";

const schemas = {
    LoginSchema: yup.object({
        body: yup.object({
            username: yup
                .string()
                .trim()
                .required("Username field is required!"),
            password: yup
                .string()
                .trim()
                .required("Password field is required!"),
        }),
    }),
    GoogleLoginSchema: yup.object({
        body: yup.object({
            accessToken: yup
                .string()
                .trim()
                .required("AccessToken field is required!"),
        }),
    }),
    RegisterSchema: yup.object({
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
                username: yup
                    .string()
                    .trim()
                    .required("Username field is required!")
                    .matches(
                        /^[a-zA-Z0-9_]+$/,
                        "Username only contains a-z characters, numbers and underscore!"
                    ),
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
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    RefreshTokenSchema: yup.object({
        body: yup.object({
            token: yup.string().trim().required("Token field is required!"),
            refreshToken: yup
                .string()
                .trim()
                .required("Refresh token field is required!"),
        }),
    }),
};

export default schemas;
