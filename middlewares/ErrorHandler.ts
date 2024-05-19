import ApiResponse from "@/utils/ApiResponse";
import HttpStatus from "http-status";
import { ValidationError } from "yup";

export const ErrorHandler = (err: any) => {
    let convertedError = err;
    if (err instanceof ValidationError) {
        let errors;
        if (err.errors) {
            errors = err.errors.map((error) => {
                let s = error
                    .substring(error.indexOf(".") + 1)
                    .replace("_id", "id")
                    .replace("_", " ");

                if (s === "") s = error;
                return s.charAt(0).toUpperCase() + s.slice(1);
            });
        }
        const message = errors?.join(", ") || "Validations have failed";

        convertedError = new ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            message: message,
        });
    } else if (!(err instanceof ApiResponse)) {
        convertedError = new ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: err.message ?? err,
        });
    }
    return convertedError;
};
