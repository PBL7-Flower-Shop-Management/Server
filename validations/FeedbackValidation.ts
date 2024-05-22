import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    GetRecentFeedbackSchema: yup.object({
        query: yup.object({
            limit: yup
                .number()
                .integer()
                .nullable()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .min(1),
        }),
    }),

    GetAllFeedbackSchema: yup.object({
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

    CreateFeedbackSchema: yup.object({
        body: yup
            .object({
                orderDetailId: yup
                    .string()
                    .trim()
                    .required()
                    .test(
                        "is-objectid",
                        "Invalid orderdetail id format",
                        (value) => mongoose.Types.ObjectId.isValid(value)
                    ),
                content: yup
                    .string()
                    .trim()
                    .required("Content field is required"),
                numberOfStars: yup
                    .number()
                    .integer()
                    .required("Field numberOfStars is required")
                    .min(1)
                    .max(5)
                    .default(1),
                imageVideoFiles: yup.array().nullable(),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    UpdateFeedbackSchema: yup.object({
        body: yup
            .object({
                _id: yup
                    .string()
                    .trim()
                    .required()
                    .test(
                        "is-objectid",
                        "Invalid feedback id format",
                        (value) => mongoose.Types.ObjectId.isValid(value)
                    ),
                feedbackName: yup
                    .string()
                    .trim()
                    .required("Feedback name field is required")
                    .matches(
                        /^[\p{L}\d\s\/\-]+$/u,
                        "Feedback name only contains characters, number, space, slash and dash!"
                    ),
                image: yup.string().trim().required("Image field is required"),
                description: yup.string().trim().nullable(),
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
                    .test(
                        "is-objectid",
                        "Invalid feedback id format",
                        (value) => mongoose.Types.ObjectId.isValid(value)
                    ),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    DeleteFeedbackSchema: yup.object({
        params: yup
            .object({
                id: yup
                    .string()
                    .trim()
                    .required()
                    .test(
                        "is-objectid",
                        "Invalid feedback id format",
                        (value) => mongoose.Types.ObjectId.isValid(value)
                    ),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),
};

export default schemas;
