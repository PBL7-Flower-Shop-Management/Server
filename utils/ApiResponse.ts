import { NextResponse } from "next/server";

class ApiResponse extends NextResponse {
    constructor({
        status,
        message,
        data,
    }: {
        status: number;
        message?: string | null;
        data?: any | null;
    }) {
        const isSuccess = `${status}`.startsWith("2");
        const requestStatus = isSuccess
            ? "success"
            : `${status}`.startsWith("4")
            ? "fail"
            : "error";
        const body = JSON.stringify(
            {
                status: requestStatus,
                message: message,
                total: data ? data.length ?? 1 : undefined,
                data: data,
            },
            null,
            2
        );
        super(body, { status: status });
    }
}

export default ApiResponse;
