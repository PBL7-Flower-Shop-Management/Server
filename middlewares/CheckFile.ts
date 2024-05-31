import ApiResponse from "@/utils/ApiResponse";
import {
    allowedImageExtensions,
    allowedImageMimeTypes,
    allowedVideoExtensions,
    allowedVideoMimeTypes,
    MAX_SIZE_IMAGE,
    MAX_SIZE_VIDEO,
} from "@/utils/constants";
import httpStatus from "http-status";

export const checkFiles = async (file: [File]) => {
    for (const f of file) console.log(f);
    for (const f of file) await checkFile(f, f.type.startsWith("image"));
};

export const checkFile = async (file: File, isImage: boolean) => {
    if (!file) {
        throw new ApiResponse({
            status: httpStatus.BAD_REQUEST,
            message: "No file uploaded!",
        });
    }

    const allowedExtensions = isImage
        ? allowedImageExtensions
        : allowedVideoExtensions;
    const allowedMimeTypes = isImage
        ? allowedImageMimeTypes
        : allowedVideoMimeTypes;

    const typeValidationResult = await validateFileType(
        file,
        allowedExtensions,
        allowedMimeTypes,
        isImage
    );

    if (typeValidationResult) {
        throw new ApiResponse({
            status: httpStatus.BAD_REQUEST,
            message: typeValidationResult,
        });
    }

    const sizeValidationResult = await validateFileSize(file, isImage);
    if (sizeValidationResult) {
        throw new ApiResponse({
            status: httpStatus.BAD_REQUEST,
            message: sizeValidationResult,
        });
    }
    return true;
};

const validateFileType = async (
    file: File,
    allowedExtensions: any,
    allowedMimeTypes: any,
    isImage: boolean
) => {
    const fileExtension = file.name.split(".").pop();
    const mimeType = file.type.toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        return `File ${file.name} không phải là ${
            isImage ? "ảnh" : "video"
        } hợp lệ! (Chỉ chấp nhận: ${allowedExtensions.join(", ")})`;
    }

    if (!allowedMimeTypes.includes(mimeType)) {
        return `Kiểu ${isImage ? "ảnh" : "video"} file ${
            file.name
        } không hợp lệ`;
    }

    const fileBytes = await file.arrayBuffer();
    if (isImage && !isImageFile(fileBytes)) {
        return `File ${file.name} không phải là ảnh hợp lệ!`;
    }

    if (!isImage && !isVideoFile(fileBytes)) {
        return `File ${file.name} không phải là video hợp lệ!`;
    }

    return "";
};

const validateFileSize = async (file: File, isImage: boolean) => {
    if (isImage) {
        if (file.size > MAX_SIZE_IMAGE) {
            return `Ảnh ${file.name} vượt quá kích thước tối đa cho phép (${
                MAX_SIZE_IMAGE / (1024 * 1024)
            } MB)`;
        }
        return "";
    } else {
        if (file.size > MAX_SIZE_VIDEO) {
            return `Video ${file.name} vượt quá kích thước tối đa cho phép (${
                MAX_SIZE_VIDEO / (1024 * 1024)
            } MB)`;
        }
        return "";
    }
};

const isImageFile = (fileBytes: ArrayBuffer) => {
    return isJpeg(fileBytes) || isPng(fileBytes) || isGif(fileBytes);
};

const isVideoFile = (fileBytes: ArrayBuffer) => {
    return isMp4(fileBytes) || isMpeg(fileBytes);
};

const isJpeg = (fileBytes: ArrayBuffer) => {
    const byteArray = new Uint8Array(fileBytes);
    return (
        byteArray.length >= 2 && byteArray[0] === 0xff && byteArray[1] === 0xd8
    );
};

const isPng = (fileBytes: ArrayBuffer) => {
    const byteArray = new Uint8Array(fileBytes);
    return (
        byteArray.length >= 8 &&
        byteArray[0] === 0x89 &&
        byteArray[1] === 0x50 &&
        byteArray[2] === 0x4e &&
        byteArray[3] === 0x47 &&
        byteArray[4] === 0x0d &&
        byteArray[5] === 0x0a &&
        byteArray[6] === 0x1a &&
        byteArray[7] === 0x0a
    );
};

const isGif = (fileBytes: ArrayBuffer) => {
    const byteArray = new Uint8Array(fileBytes);
    return (
        byteArray.length >= 6 &&
        byteArray[0] === 0x47 &&
        byteArray[1] === 0x49 &&
        byteArray[2] === 0x46 &&
        byteArray[3] === 0x38 &&
        (byteArray[4] === 0x37 || byteArray[4] === 0x39) &&
        byteArray[5] === 0x61
    );
};

const isMp4 = (fileBytes: ArrayBuffer) => {
    const byteArray = new Uint8Array(fileBytes);
    return (
        byteArray.length >= 8 &&
        byteArray[4] === 0x66 &&
        byteArray[5] === 0x74 &&
        byteArray[6] === 0x79 &&
        byteArray[7] === 0x70
    );
};

const isMpeg = (fileBytes: ArrayBuffer) => {
    const byteArray = new Uint8Array(fileBytes);
    return (
        byteArray.length >= 3 &&
        byteArray[0] === 0x00 &&
        byteArray[1] === 0x00 &&
        (byteArray[2] === 0x01 || byteArray[2] === 0xba)
    );
};
