import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    GetAllCategorySchema: yup.object({
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

    CreateCategorySchema: yup.object({
        body: yup
            .object({
                categoryName: yup
                    .string()
                    .trim()
                    .required("Category name field is required")
                    .matches(
                        /^[\p{L}\d\s\/\-]+$/u,
                        "Category name only contains characters, number, space, slash and dash!"
                    ),
                image: yup.string().trim().required("Image field is required"),
                description: yup.string().trim().nullable(),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    UpdateCategorySchema: yup.object({
        body: yup
            .object({
                categoryName: yup
                    .string()
                    .trim()
                    .required("Category name field is required")
                    .matches(
                        /^[\p{L}\d\s\/\-]+$/u,
                        "Category name only contains characters, number, space, slash and dash!"
                    ),
                image: yup.string().trim().required("Image field is required"),
                description: yup.string().trim().nullable(),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

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
