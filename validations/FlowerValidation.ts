import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    GetAllFlowerSchema: yup.object({
        query: yup
            .object({
                keyword: yup
                    .string()
                    .trim()
                    .nullable()
                    .transform((curr, orig) => (orig === "" ? null : curr)),
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
                _: yup.mixed().nullable(),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    CreateFlowerSchema: yup.object({
        body: yup
            .object({
                name: yup
                    .string()
                    .trim()
                    .required("Flower name field is required")
                    .matches(
                        /^[\p{L} _-]+$/u,
                        "Flower name only contains characters, number, space, slash and dash!"
                    ),
                habitat: yup.string().trim().nullable(),
                growthTime: yup.string().trim().nullable(),
                care: yup.string().trim().nullable(),
                unitPrice: yup.number().min(0).default(0),
                discount: yup.number().min(0).max(100).default(0),
                quantity: yup
                    .number()
                    .integer()
                    .min(0)
                    .default(0)
                    .test(
                        "quantity-valid",
                        "quantity field can't be less than sold quantiy field",
                        function (value) {
                            if (
                                value === undefined ||
                                this.parent.soldQuantity === undefined
                            ) {
                                if (!value && this.parent.soldQuantity > 0)
                                    return false;
                                return true;
                            }
                            return value >= this.parent.soldQuantity;
                        }
                    ),
                soldQuantity: yup.number().integer().min(0).default(0),
                description: yup.string().trim().nullable(),
                category: yup
                    .array()
                    .nullable()
                    .test(
                        "categoryIds-valid",
                        "Invalid category id format in list of category ids",
                        function (value) {
                            if (value) {
                                return (
                                    value.filter(
                                        (v) =>
                                            typeof v !== "string" ||
                                            v.trim() === "" ||
                                            !mongoose.Types.ObjectId.isValid(v)
                                    ).length === 0
                                );
                            }
                            return true;
                        }
                    )
                    .test(
                        "categoryIds-distinct",
                        "There can't be two categories that overlap",
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

    UpdateFlowerSchema: yup.object({
        body: yup
            .object({
                _id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid flower id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
                name: yup
                    .string()
                    .trim()
                    .required("Flower name field is required")
                    .matches(
                        /^[\p{L} _-]+$/u,
                        "Flower name only contains characters, number, space, slash and dash!"
                    ),
                habitat: yup.string().trim().nullable(),
                growthTime: yup.string().trim().nullable(),
                care: yup.string().trim().nullable(),
                unitPrice: yup.number().min(0).default(0),
                discount: yup.number().min(0).max(100).default(0),
                quantity: yup
                    .number()
                    .integer()
                    .min(0)
                    .default(0)
                    .test(
                        "quantity-valid",
                        "quantity field can't be less than sold quantiy field",
                        function (value) {
                            if (
                                value === undefined ||
                                this.parent.soldQuantity === undefined
                            ) {
                                if (!value && this.parent.soldQuantity > 0)
                                    return false;
                                return true;
                            }
                            return value >= this.parent.soldQuantity;
                        }
                    ),
                soldQuantity: yup.number().integer().min(0).default(0),
                imageVideoFiles: yup.array().nullable(),
                description: yup.string().trim().nullable(),
                category: yup
                    .array()
                    .nullable()
                    .test(
                        "categoryIds-valid",
                        "Invalid category id format in list of category ids",
                        function (value) {
                            if (value) {
                                return (
                                    value.filter(
                                        (v) =>
                                            typeof v !== "string" ||
                                            v.trim() === "" ||
                                            !mongoose.Types.ObjectId.isValid(v)
                                    ).length === 0
                                );
                            }
                            return true;
                        }
                    )
                    .test(
                        "categoryIds-distinct",
                        "There can't be two categories that overlap",
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

    GetBestSellerFlowerSchema: yup.object({
        query: yup.object({
            limit: yup
                .number()
                .integer()
                .nullable()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .min(1),
        }),
    }),

    GetDecorativeFlowerSchema: yup.object({
        query: yup.object({
            limit: yup
                .number()
                .integer()
                .nullable()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .min(1),
        }),
    }),

    GetFlowerAsGiftSchema: yup.object({
        query: yup.object({
            limit: yup
                .number()
                .integer()
                .nullable()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .min(1),
        }),
    }),

    GetSuggestedFlowerSchema: yup.object({
        query: yup.object({
            limit: yup
                .number()
                .integer()
                .nullable()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .min(1),
        }),
    }),

    GetFlowerDetailSchema: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid flower id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
        }),
    }),

    GetFeedbackOfFlowerSchema: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid flower id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
        }),
    }),

    DeleteFlowerSchema: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid flower id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
        }),
    }),

    DeleteFlowersSchema: yup.object({
        body: yup
            .object({
                flowerIds: yup
                    .array()
                    .required("FlowerIds are required")
                    .test(
                        "flowerIds-empty",
                        "FlowerIds can't be empty array",
                        function (value) {
                            return value.length !== 0;
                        }
                    )
                    .test(
                        "flowerIds-valid",
                        "Invalid flower id format in list of flower ids",
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
                        "flowerIds-distinct",
                        "There can't be two deleted flowers that overlap",
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
