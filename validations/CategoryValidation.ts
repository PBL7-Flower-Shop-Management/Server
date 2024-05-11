import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    GetCategoryWithFlowers: yup.object({
        query: yup.object({
            limit: yup
                .number()
                .integer()
                .nullable()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .min(1),
        }),
    }),
    GetCategoryByIdWithFlowers: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test(
                    "is-objectid",
                    "Invalid category id format",
                    (value) =>
                        value === "0" || mongoose.Types.ObjectId.isValid(value)
                ),
        }),
        query: yup.object({
            limit: yup
                .number()
                .integer()
                .nullable()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .min(1),
        }),
    }),
};

export default schemas;
