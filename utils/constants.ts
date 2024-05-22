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

export const orderStatus: { [key: string]: string } = {
    "Pending payment processing": "Chờ thanh toán",
    Processing: "Đang xử lý",
    Shipped: "Đã vận chuyển",
    Delivered: "Đã giao",
    Cancelled: "Huỷ",
};

export const orderStatusColor: {
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
    "Pending payment processing": "info",
    Processing: "primary",
    Shipped: "warning",
    Delivered: "success",
    Cancelled: "error",
};

export const isActive = Object.freeze({
    false: "Chưa kích hoạt",
    true: "Đã kích hoạt",
});

export const role = Object.freeze({
    Admin: "Admin",
    Employee: "Nhân viên",
    Customer: "Khách hàng",
});

//server

export const roleMap = {
    Admin: "Admin",
    Employee: "Employee",
    Customer: "Customer",
};

export const orderStatusMap = {
    "Pending payment processing": "Pending payment processing",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
};

//value: label
