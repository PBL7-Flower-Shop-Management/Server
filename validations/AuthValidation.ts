import * as yup from "yup";

const schemas = {
    LoginSchema: yup.object({
        body: yup.object({
            username: yup.string().trim().required(),
            password: yup.string().trim().required(),
        }),
    }),
};

export default schemas;
