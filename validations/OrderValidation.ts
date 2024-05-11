import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
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
