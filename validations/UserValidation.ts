import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    GetCartByUserId: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid user id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
        }),
    }),
    GetOrderByUserId: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid user id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
        }),
    }),
    GetFavouriteFlowerByUserId: yup.object({
        params: yup.object({
            id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid user id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
        }),
    }),
};

export default schemas;
