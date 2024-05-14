import { ChipPropsColorOverrides } from "@mui/material";

export const productStatus: { [key: string]: string } = {
    Available: "Có sẵn",
    "Out of stock": "Hết hàng",
};

export const productStatusColor: {
    [key: string]:
        | "default"
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning"
        | undefined;
} = {
    "Out of stock": "error",
    Available: "success",
};
