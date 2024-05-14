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
        return url.startsWith("/");
    }
};
