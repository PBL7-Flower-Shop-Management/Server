import jwt from "jsonwebtoken";

const sign = async (payload: any, secret: any, options?: any) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (error: any, token: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
    });
};

const verify = async (token: any, secret: any): Promise<any | null> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error: any, payload: any) => {
            if (error) {
                console.log(error);
                resolve(null);
            } else {
                resolve(payload);
            }
        });
    });
};

export { sign, verify };
