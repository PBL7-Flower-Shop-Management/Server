import jwt from "jsonwebtoken";

const sign = async (payload: any, secret: any, options?: any) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (error: any, token: any) => {
            if (error) {
                return reject(error);
            } else {
                resolve(token);
            }
        });
    });
};

const verify = async (
    token: any,
    secret: any,
    saveError?: any
): Promise<any | null> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error: any, payload: any) => {
            if (error) {
                console.log("Verify token get error:\n", error.message);
                console.log(error.name);
                if (saveError) saveError.data = error;
                resolve(null);
            } else {
                resolve(payload);
            }
        });
    });
};

export { sign, verify };
