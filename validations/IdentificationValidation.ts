import mongoose from "mongoose";
import * as yup from "yup";

const schemas = {
    GetIdentificationHistoryByUserId: yup.object({
        params: yup.object({
            userId: yup
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
