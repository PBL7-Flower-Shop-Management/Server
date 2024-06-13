import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import bcrypt from "bcryptjs";
import AccountModel from "@/models/AccountModel";
import { sign, verify } from "@/utils/JwtHelper";
import moment from "moment";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";
import { generateRandomPassword, unicodeToAscii } from "@/utils/helper";
import { sendMail } from "@/utils/sendMail";
import { roleMap } from "@/utils/constants";

class AuthService {
    async Register(user: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                if (
                    await UserModel.findOne({ email: user.email.toLowerCase() })
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Email already exists!",
                        })
                    );
                }
                if (
                    await AccountModel.findOne({
                        username: user.username.toLowerCase(),
                    })
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Username already exists!",
                        })
                    );
                }

                const hashedPassword = await bcrypt.hash(
                    user.password,
                    parseInt(process.env.BCRYPT_SALT!)
                );

                const currentDate = moment().toDate();

                const newUser = await UserModel.create(
                    [
                        {
                            ...user,
                            createdAt: currentDate,
                            createdBy: user.username ?? "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);

                await AccountModel.create(
                    [
                        {
                            userId: newUser._id,
                            isActived: true,
                            username: user.username,
                            password: hashedPassword,
                            createdAt: currentDate,
                            createdBy: user.username ?? "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.CREATED,
                    })
                );
            } catch (error: any) {
                await session.abortTransaction();
                return reject(error);
            } finally {
                if (session.inTransaction()) {
                    await session.abortTransaction();
                }
                session.endSession();
            }
        });
    }

    async Login(
        username: string,
        password: string,
        isMobile: boolean
    ): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const account = await AccountModel.findOne({
                    username: username,
                });
                if (!account) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Username or password is wrong!",
                        })
                    );
                }

                let passwordMatches = await bcrypt.compare(
                    password,
                    account.password
                );
                if (!passwordMatches) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Username or password is wrong!",
                        })
                    );
                }

                if (!account.isActived)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account isn't actived!",
                        })
                    );

                const user = await UserModel.findOne({
                    _id: account.userId,
                });

                if (!user || user.isDeleted || account.isDeleted)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account was deleted!",
                        })
                    );

                if (!isMobile) {
                    if (user.role === roleMap.Customer)
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.FORBIDDEN,
                                message:
                                    "This website is for employee or admin only!",
                            })
                        );
                } else if (user.role !== roleMap.Customer)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message: "This mobile app is for customer only!",
                        })
                    );

                const authTokens = await this.generateAuthTokens(user);

                await AccountModel.updateOne(
                    { userId: user._id },
                    {
                        $set: {
                            tokenExpireTime:
                                authTokens.accessTokenExpiresAt.toDate(),
                            refreshToken: authTokens.refreshToken,
                            refreshTokenExpireTime:
                                authTokens.refreshTokenExpireAt.toDate(),
                        },
                    },
                    { session: session }
                );

                await session.commitTransaction();
                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: { user: user, token: authTokens },
                    })
                );
            } catch (error: any) {
                await session.abortTransaction();
                return reject(error);
            } finally {
                if (session.inTransaction()) {
                    await session.abortTransaction();
                }
                session.endSession();
            }
        });
    }

    async GenerateResetPasswordToken(email: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await sign({ email }, process.env.JWT_SECRET, {
                    expiresIn: "5m",
                });

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: token,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    private async generateAuthTokens(user: any) {
        const loginTime = moment();
        let accessTokenExpiresAt = loginTime
            .clone()
            .add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, "minutes");
        const accessToken = await this.generateToken(
            user,
            loginTime,
            accessTokenExpiresAt,
            "access"
        );

        let refreshTokenExpireAt = loginTime
            .clone()
            .add(process.env.REFRESH_TOKEN_EXPIRATION_DAYS, "days");

        const refreshToken = await this.generateToken(
            user._id,
            loginTime,
            refreshTokenExpireAt,
            "refresh"
        );

        return {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpireAt,
        };
    }

    private async generateToken(
        user: any,
        login_time: any,
        exp: any,
        type: string
    ) {
        const payload = {
            user: user,
            login_time: new Date(login_time.valueOf()).toISOString(),
            exp: exp.unix(),
            type,
        };
        let token = await sign(payload, process.env.JWT_SECRET);
        return token;
    }

    async HandleGoogleUser(
        googleUser: any,
        isMobile: boolean
    ): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });

            try {
                let user = await UserModel.findOne({
                    email: googleUser.email,
                });

                if (user) {
                    if (user.isDeleted)
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.NOT_FOUND,
                                message: "Account was deleted!",
                            })
                        );

                    let account = await AccountModel.findOne({
                        userId: user._id,
                    });

                    if (account.isDeleted)
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.NOT_FOUND,
                                message: "Account was deleted!",
                            })
                        );

                    if (!account.isActived)
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.NOT_FOUND,
                                message: "Account isn't actived!",
                            })
                        );

                    if (!isMobile) {
                        if (user.role === roleMap.Customer)
                            return reject(
                                new ApiResponse({
                                    status: HttpStatus.FORBIDDEN,
                                    message:
                                        "This website is for employee or admin only!",
                                })
                            );
                    } else if (user.role !== roleMap.Customer)
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.FORBIDDEN,
                                message:
                                    "This mobile app is for customer only!",
                            })
                        );

                    if (!user.providers || !user.providers.includes("google")) {
                        await UserModel.findByIdAndUpdate(
                            user._id,
                            { $push: { providers: "google" } },
                            { session: session }
                        );
                    }
                } else {
                    if (!isMobile)
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.BAD_REQUEST,
                                message:
                                    "Your email does not match any accounts",
                            })
                        );

                    const name =
                        googleUser.family_name + " " + googleUser.given_name;
                    const wordsInName = unicodeToAscii(name)
                        .split(" ")
                        .filter((c) => c !== "");

                    if (wordsInName.length > 0) {
                        const firstName = wordsInName.pop();
                        if (firstName) {
                            const start =
                                firstName[0].toUpperCase() +
                                firstName.slice(1).toLowerCase();

                            const end = wordsInName
                                .map((w: string) => w[0].toUpperCase())
                                .join("");

                            const username = start + end;
                            googleUser.username = username;
                            let count = 2;
                            while (true) {
                                if (
                                    await AccountModel.findOne({
                                        username: googleUser.username,
                                        isDeleted: false,
                                    })
                                ) {
                                    googleUser.username = username + count;
                                    count++;
                                } else break;
                            }
                        }
                    }

                    const randomPassword = generateRandomPassword();
                    const hashedPassword = await bcrypt.hash(
                        randomPassword,
                        parseInt(process.env.BCRYPT_SALT!)
                    );

                    user = await UserModel.create(
                        [
                            {
                                name: name,
                                avatarUrl: googleUser.picture,
                                email: googleUser.email,
                                providers: ["google"],
                                createdAt: moment().toDate(),
                                createdBy: googleUser.username,
                                isDeleted: false,
                            },
                        ],
                        { session: session }
                    ).then((res) => res[0]);

                    await AccountModel.create(
                        [
                            {
                                userId: user._id,
                                isActived: true,
                                username: googleUser.username,
                                password: hashedPassword,
                                createdAt: moment().toDate(),
                                createdBy: googleUser.username,
                                isDeleted: false,
                            },
                        ],
                        { session: session }
                    );

                    sendMail({
                        to: googleUser.email,
                        subject: "Tài khoản mới",
                        html: `Tài khoản của bạn đã được tạo trên website của chúng tôi, sau đây là thông tin đăng nhập cho bạn:<br>
                        Tên tài khoản: ${googleUser.username}<br>
                        Mật khẩu: ${randomPassword}<br>
                        Hãy đăng nhập vào hệ thống ${
                            process.env.NEXT_PUBLIC_HOST_URL + "/login"
                        } và đổi mật khẩu ngay để tránh bị lộ thông tin cá nhân.<br>
                        Liên hệ với người quản trị nếu bạn gặp bất kì vấn đề gì khi đăng nhập vào hệ thống!<br>`,
                    });
                }

                const authTokens = await this.generateAuthTokens(user);

                await AccountModel.updateOne(
                    { userId: user._id },
                    {
                        $set: {
                            tokenExpireTime:
                                authTokens.accessTokenExpiresAt.toDate(),
                            refreshToken: authTokens.refreshToken,
                            refreshTokenExpireTime:
                                authTokens.refreshTokenExpireAt.toDate(),
                        },
                    },
                    { session: session }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: { user: user, token: authTokens },
                    })
                );
            } catch (error: any) {
                await session.abortTransaction();
                return reject(error);
            } finally {
                if (session.inTransaction()) {
                    await session.abortTransaction();
                }
                session.endSession();
            }
        });
    }

    async RefreshToken(body: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                let error = {};
                const checkToken = await verify(
                    body.token,
                    process.env.JWT_SECRET,
                    error
                );
                if (!checkToken)
                    if ((error as any).data.name === "JsonWebTokenError")
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.BAD_REQUEST,
                                message: "Invalid token!",
                            })
                        );

                const userToken = await verify(
                    body.refreshToken,
                    process.env.JWT_SECRET
                );

                if (!userToken)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Invalid refresh token!",
                        })
                    );

                const user = await UserModel.findOne({
                    _id: userToken.user,
                    isDeleted: false,
                });

                const acc = await AccountModel.findOne({
                    userId: userToken.user,
                    isDeleted: false,
                });

                // if (acc.refreshToken !== body.refreshToken)
                //     return reject(
                //         new ApiResponse({
                //             status: HttpStatus.BAD_REQUEST,
                //             message: "Invalid refresh token!",
                //         })
                //     );

                if (!user || !acc)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Not found account!",
                        })
                    );

                if (!acc.isActived)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account isn't actived!",
                        })
                    );

                const authTokens = await this.generateAuthTokens(user);

                await AccountModel.updateOne(
                    { userId: user._id },
                    {
                        $set: {
                            tokenExpireTime:
                                authTokens.accessTokenExpiresAt.toDate(),
                            refreshToken: authTokens.refreshToken,
                            refreshTokenExpireTime:
                                authTokens.refreshTokenExpireAt.toDate(),
                        },
                    },
                    { session: session }
                );

                await session.commitTransaction();
                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: { user: user, token: authTokens },
                    })
                );
            } catch (error: any) {
                await session.abortTransaction();
                return reject(error);
            } finally {
                if (session.inTransaction()) {
                    await session.abortTransaction();
                }
                session.endSession();
            }
        });
    }
}

const authService = new AuthService();
export default authService;
