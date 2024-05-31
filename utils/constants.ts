export const zIndexLevel = {
    one: 10,
    two: 15,
    three: 20,
    four: 25,
    five: 30,
    six: 35,
    seven: 40,
    eight: 45,
    nine: 50,
    ten: 100,
};

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

export const allowedImageExtensions: string[] = ["jpg", "jpeg", "png", "gif"];
export const allowedVideoExtensions: string[] = ["mp4", "mpeg", "mp3"];
export const allowedImageMimeTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
];
export const allowedVideoMimeTypes: string[] = [
    "video/mp4",
    "video/mpeg",
    "audio/mpeg",
];

export const mimeTypeMap: any = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    mp4: "video/mp4",
    mpeg: "video/mpeg",
    unknown: "unknown",
};

export const MAX_SIZE_IMAGE = 1 * 1024 * 1024;
export const MAX_SIZE_VIDEO = 5 * 1024 * 1024;
