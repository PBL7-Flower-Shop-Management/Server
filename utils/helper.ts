export const isNumberic = (value: any) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isIntegerNumber = (value: any) => {
    return !isNaN(value) && Number.isInteger(Number(value));
};
