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
