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

    DeleteAccountsSchema: yup.object({
        body: yup
            .object({
                accountIds: yup
                    .array()
                    .required("AccountIds are required")
                    .test(
                        "accountIds-empty",
                        "AccountIds can't be empty array",
                        function (value) {
                            return value.length !== 0;
                        }
                    )
                    .test(
                        "accountIds-valid",
                        "Invalid account id format in list of account ids",
                        function (value) {
                            return (
                                value.filter(
                                    (v) =>
                                        typeof v !== "string" ||
                                        v.trim() === "" ||
                                        !mongoose.Types.ObjectId.isValid(v)
                                ).length === 0
                            );
                        }
                    )
                    .test(
                        "accountIds-distinct",
                        "There can't be two deleted accounts that overlap",
                        function (value) {
                            if (value) {
                                return new Set(value).size === value.length;
                            }
                            return true;
                        }
                    ),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),
};

export default schemas;
