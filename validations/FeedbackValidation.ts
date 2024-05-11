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
};

export default schemas;
