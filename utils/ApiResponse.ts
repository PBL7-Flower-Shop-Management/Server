import { NextResponse } from "next/server";

class ApiResponse extends NextResponse {
    data: any;
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
        const body =
            status === 204
                ? null
                : JSON.stringify(
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
        this.data = data;
    }
}

export default ApiResponse;
