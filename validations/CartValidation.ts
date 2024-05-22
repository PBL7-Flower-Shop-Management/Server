import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    CreateCartSchema: yup.object({
        body: yup
            .object({
                flowerId: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid flower id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
                numberOfFlowers: yup.number().integer().min(1).default(1),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    UpdateCartSchema: yup.object({
        body: yup
            .object({
                flowerId: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid flower id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
                numberOfFlowers: yup.number().integer().min(1).default(1),
                selected: yup.boolean().nullable().default(false),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    DeleteCartSchema: yup.object({
        params: yup
            .object({
                id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid flower id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    DeleteCartsSchema: yup.object({
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
