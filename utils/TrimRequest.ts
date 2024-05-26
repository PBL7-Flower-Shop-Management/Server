import { NextRequest } from "next/server";

// Trim all string properties of an object
function trimStringProperties(obj: any) {
    if (obj !== null && typeof obj === "object") {
        for (const prop in obj) {
            // If the property is an object trim it too
            if (typeof obj[prop] === "object") {
                trimStringProperties(obj[prop]);
            }
            // If it's a string, remove beginning and ending whitespaces
            if (typeof obj[prop] === "string") {
                obj[prop] = obj[prop].trim();
            }
        }
    }
}

const trimURLSearchParams = (searchParams: URLSearchParams) => {
    const obj: any = {};
    for (const [key, value] of searchParams) {
        // Trim the value before converting
        const trimmedValue = value.trim();

        // Convert value to the appropriate type
        let convertedValue;
        if (trimmedValue !== "" && !isNaN(Number(trimmedValue))) {
            convertedValue = Number(trimmedValue);
        } else if (
            trimmedValue.toLowerCase() === "true" ||
            trimmedValue.toLowerCase() === "false"
        ) {
            convertedValue = trimmedValue.toLowerCase() === "true";
        } else {
            convertedValue = trimmedValue;
        }

        if (!obj[key]) {
            obj[key] = convertedValue;
        } else if (Array.isArray(obj[key])) {
            obj[key].push(convertedValue);
        } else {
            obj[key] = [obj[key], convertedValue];
        }
    }
    return obj;
};

// const trimURLSearchParams = (params: URLSearchParams) => {
//     const trimmedParams = new URLSearchParams();
//     for (const [key, value] of params) {
//         trimmedParams.append(key, value.trim());
//     }
//     return trimmedParams;
// };

// trimRequest middleware: trim all request object: body, params, query
const all = (req: NextRequest, params?: URLSearchParams | null, body?: any) => {
    let query = undefined;
    if (body) {
        trimStringProperties(body);
    }
    if (req.url) {
        query = trimURLSearchParams(new URL(req.url).searchParams);
    }
    if (params) {
        trimStringProperties(params);
    }
    return { req, params, query, body };
};

const body = (body: any) => {
    if (body) {
        trimStringProperties(body);
    }
    return body;
};

const query = (req: NextRequest) => {
    if (req.url) {
        trimURLSearchParams(new URL(req.url).searchParams);
    }
    return req;
};

const param = (params: any) => {
    trimStringProperties(params);

    return params;
};

export default {
    all,
    body,
    query,
    param,
};
