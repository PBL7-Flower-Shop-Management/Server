import { refreshToken } from "./auth";

export const FetchApi = async (
    endpoint: string,
    httpType: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    doNeedToken: boolean = true,
    body?: any
) => {
    let token = "";
    if (doNeedToken) {
        const newestToken = await refreshToken();
        if (!newestToken.isSuccessfully)
            return {
                canRefreshToken: false,
                message: newestToken.data,
            };

        token = `Bearer ${newestToken.data}`;
    }

    return await fetch(process.env.NEXT_PUBLIC_HOST_URL + endpoint, {
        method: httpType,
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify(body),
    })
        .then(async (res) => {
            let response: any = {};
            if (res.status !== 204) {
                response = await res.json();
            }
            response.succeeded = res.ok;
            return response;
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return { succeeded: false, message: error.message ?? error };
        });
};
