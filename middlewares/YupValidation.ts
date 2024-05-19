const validate =
    (schema: any) =>
    async (params?: object | null, query?: object | null, body?: any) => {
        try {
            await schema.validate({
                body: body,
                query: query,
                params: params,
            });
        } catch (error: any) {
            throw error;
        }
    };

export default validate;
