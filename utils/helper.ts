import unidecode from "unidecode";
import { mimeTypeMap } from "./constants";

export const isNumberic = (value: any) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isIntegerNumber = (value: any) => {
    return !isNaN(value) && Number.isInteger(Number(value));
};

export const ShortenString = (str = "", numberOfCharacters = 10) => {
    if (str.length > numberOfCharacters)
        return str.substring(0, numberOfCharacters) + "...";
    else return str.substring(0, numberOfCharacters);
};

export const isValidUrl = (url: string | undefined) => {
    if (!url) return false;
    try {
        new URL(url);
        return true; // It's an absolute URL
    } catch (_) {
        // It's not an absolute URL, so let's check if it's a valid relative path
        return typeof url === "string" && url.startsWith("/");
    }
};

export const unicodeToAscii = (str: string) => {
    return unidecode(str);
};

export const generateRandomPassword = (opts?: any) => {
    // Default options if not provided
    if (!opts) {
        opts = {
            requiredLength: 8,
            // requiredUniqueChars: 4,
            requireUppercase: true,
            requireLowercase: true,
            requireDigit: true,
            requireNonAlphanumeric: true,
        };
    }

    // Define character sets
    const randomChars = [
        "ABCDEFGHJKLMNOPQRSTUVWXYZ", // uppercase
        "abcdefghijkmnopqrstuvwxyz", // lowercase
        "0123456789", // digits
        "!@$?_-", // non-alphanumeric
    ];

    // Function to generate a random integer within a range
    const getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Function to generate a random character from a given character set
    const getRandomCharacter = (charSet: string) => {
        return charSet.charAt(getRandomInt(0, charSet.length - 1));
    };

    let chars = [];

    // Add required characters
    if (opts.requireUppercase) chars.push(getRandomCharacter(randomChars[0]));
    if (opts.requireLowercase) chars.push(getRandomCharacter(randomChars[1]));
    if (opts.requireDigit) chars.push(getRandomCharacter(randomChars[2]));
    if (opts.requireNonAlphanumeric)
        chars.push(getRandomCharacter(randomChars[3]));

    // Add remaining characters
    while (
        chars.length < opts.requiredLength ||
        (opts.requiredUniqueChars &&
            new Set(chars).size < opts.requiredUniqueChars)
    ) {
        const randomCharSet =
            randomChars[getRandomInt(0, randomChars.length - 1)];
        chars.push(getRandomCharacter(randomCharSet));
    }

    // Shuffle the characters
    chars = chars.sort(() => Math.random() - 0.5);

    return chars.join("");
};

export const parseSortString = (sortString: string) => {
    try {
        const sortParams: any = {};
        sortString.split(",").forEach((part: any) => {
            const [field, order] = part.split(":");
            sortParams[field.trim()] = parseInt(order.trim(), 10);
        });
        return sortParams;
    } catch (error) {
        return null;
    }
};

export const appendJsonToFormData = (formData: FormData, json: any) => {
    // Object.keys(json).forEach((key) => {
    //     if (json[key] instanceof File) {
    //         formData.append(key, json[key]);
    //     } else {
    //         formData.append(key, JSON.stringify(json[key]));
    //     }
    // });
    formData.append("body", JSON.stringify(json));

    return formData;
};

export const getMimeType = (url: string) => {
    const arr = url.split(".");
    const ext = arr && arr.length > 0 ? arr[arr.length - 1] : "unknown";
    return mimeTypeMap[ext];
};

export const Base64ImageToFile = (base64: string, filename: string): File => {
    // Decode the base64 string
    const byteString = atob(base64);

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const ui8a = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        ui8a[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ui8a], { type: "image/png" });

    // Create a File object from the Blob
    return new File([blob], filename, { type: "image/png" });
};

export const isMobileDevice = (userAgent: string): boolean => {
    const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
};

export const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
