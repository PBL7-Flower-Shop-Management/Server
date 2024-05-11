import { NextApiRequest } from "next";

const validate =
    (schema: any) =>
    async (
        req?: NextApiRequest | null,
        params?: object | null,
        query?: URLSearchParams | null,
        body?: any
    ) => {
        try {
            await schema.validate({
                body: body,
                query: query?.entries()
                    ? Object.fromEntries(query?.entries())
                    : undefined,
                params: params,
            });
        } catch (error: any) {
            throw error;
        }
    };

export default validate;
