import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
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
};

export default schemas;
