import { isIntegerNumber } from "@/utils/helper";
import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    GetAllOrderSchema: yup.object({
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

    CreateOrderSchema: yup.object({
        body: yup
            .object({
                orderUserId: yup
                    .string()
                    .trim()
                    .required()
                    .test(
                        "is-objectid",
                        "Invalid order user id format",
                        (value) => mongoose.Types.ObjectId.isValid(value)
                    ),
                // orderDate: yup.date()
                // .transform((value, originalValue) => {
                //   // Transform string to Date if it's not already a Date object
                //   return originalValue ? new Date(originalValue) : null;
                // })
                // .nullable(),
                // shipDate: yup.date().nullable(),
                orderDate: yup.string().trim().nullable(),
                shipDate: yup.string().trim().nullable(),
                shipAddress: yup
                    .string()
                    .trim()
                    .nullable()
                    .max(200)
                    .matches(
                        /^[\p{L}\d\s\/\-]+$/u,
                        "Ship address only contains characters, number, space, slash and dash!"
                    ),
                discount: yup.number().min(0).max(100).default(0),
                shipPrice: yup.number().min(0).default(0),
                totalPrice: yup.number().min(0).default(0),
                paymentMethod: yup.string().trim().nullable(),
                status: yup
                    .string()
                    .trim()
                    .nullable()
                    .oneOf(
                        [
                            "Pending payment processing",
                            "Processing",
                            "Shipped",
                            "Delivered",
                            "Cancelled",
                        ],
                        "Invalid order status"
                    )
                    .default("Processing"),
                note: yup.string().trim().nullable(),
                orderDetails: yup
                    .array()
                    .nullable()
                    .test(
                        "flowerid-valid",
                        "Invalid flower id format in list of products",
                        function (value) {
                            if (value) {
                                return !value.find(
                                    (v) =>
                                        typeof v.flowerId !== "string" ||
                                        !mongoose.Types.ObjectId.isValid(
                                            v.flowerId
                                        )
                                );
                            }
                            return true;
                        }
                    )
                    .test(
                        "numberOfFlowers-valid",
                        "Invalid number of flowers's number format",
                        function (value) {
                            if (value) {
                                return !value.find(
                                    (v) =>
                                        typeof v.numberOfFlowers !== "number" ||
                                        !isIntegerNumber(v.numberOfFlowers)
                                );
                            }
                            return true;
                        }
                    )
                    .test(
                        "numberOfFlowers-value valid",
                        "Number of flowers must be greater than 0",
                        function (value) {
                            if (value) {
                                return !value.find(
                                    (v) => Number(v.numberOfFlowers) <= 0
                                );
                            }
                            return true;
                        }
                    ),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    UpdateOrderSchema: yup.object({
        body: yup
            .object({
                _id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid order id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
                // orderDate: yup.date()
                // .transform((value, originalValue) => {
                //   // Transform string to Date if it's not already a Date object
                //   return originalValue ? new Date(originalValue) : null;
                // })
                // .nullable(),
                // shipDate: yup.date().nullable(),
                orderDate: yup.string().trim().nullable(),
                shipDate: yup.string().trim().nullable(),
                shipAddress: yup
                    .string()
                    .trim()
                    .nullable()
                    .max(200)
                    .matches(
                        /^[\p{L}\d\s\/\-]+$/u,
                        "Ship address only contains characters, number, space, slash and dash!"
                    ),
                discount: yup.number().min(0).max(100).default(0),
                shipPrice: yup.number().min(0).default(0),
                totalPrice: yup.number().min(0).default(0),
                paymentMethod: yup.string().trim().nullable(),
                status: yup
                    .string()
                    .trim()
                    .nullable()
                    .oneOf(
                        [
                            "Pending payment processing",
                            "Processing",
                            "Shipped",
                            "Delivered",
                            "Cancelled",
                        ],
                        "Invalid order status"
                    )
                    .default("Processing"),
                note: yup.string().trim().nullable(),
                orderDetails: yup
                    .array()
                    .nullable()
                    .test(
                        "flowerid-valid",
                        "Invalid flower id format in list of products",
                        function (value) {
                            if (value) {
                                return !value.find(
                                    (v) =>
                                        typeof v.flowerId !== "string" ||
                                        !mongoose.Types.ObjectId.isValid(
                                            v.flowerId
                                        )
                                );
                            }
                            return true;
                        }
                    )
                    .test(
                        "numberOfFlowers-valid",
                        "Invalid number of flowers's number format",
                        function (value) {
                            if (value) {
                                return !value.find(
                                    (v) =>
                                        typeof v.numberOfFlowers !== "number" ||
                                        !isIntegerNumber(v.numberOfFlowers)
                                );
                            }
                            return true;
                        }
                    )
                    .test(
                        "numberOfFlowers-value valid",
                        "Number of flowers must be greater than 0",
                        function (value) {
                            if (value) {
                                return !value.find(
                                    (v) => Number(v.numberOfFlowers) <= 0
                                );
                            }
                            return true;
                        }
                    ),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    GetOrderDetail: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid order id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
        }),
    }),
};

export default schemas;
