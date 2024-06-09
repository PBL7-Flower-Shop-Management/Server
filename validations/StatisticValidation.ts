import * as yup from "yup";

const schemas = {
    GetEvolutionOfRevenueSchema: yup.object({
        query: yup
            .object({
                year: yup
                    .number()
                    .typeError("Year must be a number")
                    .integer()
                    .min(0)
                    .default(2024),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),

    GetRevenueByCategorySchema: yup.object({
        query: yup
            .object({
                year: yup
                    .number()
                    .typeError("Year must be a number")
                    .integer()
                    .min(0)
                    .default(2024),
            })
            .noUnknown(true, "Unknown field in request params: ${unknown}")
            .strict(),
    }),
};

export default schemas;
