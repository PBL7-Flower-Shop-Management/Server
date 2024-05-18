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
                    .required("Please provide your email")
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
};

export default schemas;
