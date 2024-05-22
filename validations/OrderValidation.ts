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
                                return (
                                    value.filter(
                                        (v) =>
                                            typeof v.flowerId !== "string" ||
                                            v.flowerId.trim() === "" ||
                                            !mongoose.Types.ObjectId.isValid(
                                                v.flowerId
                                            )
                                    ).length === 0
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
                                return (
                                    value.filter(
                                        (v) =>
                                            typeof v.numberOfFlowers !==
                                                "number" ||
                                            !isIntegerNumber(v.numberOfFlowers)
                                    ).length === 0
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
                                return (
                                    value.filter(
                                        (v) => Number(v.numberOfFlowers) <= 0
                                    ).length === 0
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
                                return (
                                    value.filter(
                                        (v) =>
                                            typeof v.flowerId !== "string" ||
                                            v.flowerId.trim() === "" ||
                                            !mongoose.Types.ObjectId.isValid(
                                                v.flowerId
                                            )
                                    ).length === 0
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
                                return (
                                    value.filter(
                                        (v) =>
                                            typeof v.numberOfFlowers !==
                                                "number" ||
                                            !isIntegerNumber(v.numberOfFlowers)
                                    ).length === 0
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
                                return (
                                    value.filter(
                                        (v) => Number(v.numberOfFlowers) <= 0
                                    ).length === 0
                                );
                            }
                            return true;
                        }
                    ),
            })
            .noUnknown(true, "Unknown field in request body: ${unknown}")
            .strict(),
    }),

    GetOrderDetailSchema: yup.object({
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

    DeleteOrderSchema: yup.object({
        params: yup
            .object({
                id: yup
                    .string()
                    .trim()
                    .required()
                    .test("is-objectid", "Invalid order id format", (value) =>
                        mongoose.Types.ObjectId.isValid(value)
                    ),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    DeleteOrdersSchema: yup.object({
        body: yup
            .object({
                orderIds: yup
                    .array()
                    .required("OrderIds are required")
                    .test(
                        "orderIds-empty",
                        "OrderIds can't be empty array",
                        function (value) {
                            return value.length !== 0;
                        }
                    )
                    .test(
                        "orderIds-valid",
                        "Invalid order id format in list of order ids",
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
                        "orderIds-distinct",
                        "There can't be two deleted orders that overlap",
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
