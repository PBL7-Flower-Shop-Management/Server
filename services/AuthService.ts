import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import bcrypt from "bcryptjs";
import AccountModel from "@/models/AccountModel";
import { sign, verify } from "@/utils/JwtHelper";
import moment from "moment";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";

class AuthService {
    async Register(user: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
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
                            createdBy: user.createdBy ?? "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);
                const authTokens = await this.generateAuthTokens(newUser);

                await AccountModel.create(
                    [
                        {
                            userId: newUser._id,
                            isActived: true,
                            username: user.username,
                            password: hashedPassword,
                            tokenExpireTime:
                                authTokens.accessTokenExpiresAt.toDate(),
                            refreshToken: authTokens.refreshToken,
                            refreshTokenExpireTime:
                                authTokens.refreshTokenExpireAt.toDate(),
                            createdAt: currentDate,
                            createdBy: user.createdBy ?? "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.CREATED,
                        data: { user: newUser, token: authTokens },
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

    async Login(username: string, password: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
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
                if (user.isDeleted || account.isDeleted)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account was deleted!",
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

    async HandleGoogleUser(googleUser: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                let user = await UserModel.findOne({
                    email: googleUser.email,
                });

                if (user) {
                    if (!user.providers || !user.providers.includes("google")) {
                        await UserModel.findByIdAndUpdate(user._id, {
                            $push: { providers: "google" },
                        });
                    }
                } else {
                    // const password = crypto.randomBytes(4).toString("hex");
                    // const hashedPassword = await bcrypt.hash(
                    //     password,
                    //     parseInt(process.env.BCRYPT_SALT!)
                    // );
                    console.log(googleUser);
                    user = await UserModel.create(
                        [
                            {
                                first_name: googleUser.given_name,
                                last_name: googleUser.family_name,
                                avatar: googleUser.picture,
                                email: googleUser.email,
                                isConfirmed: true,
                                isRestricted: false,
                                providers: ["google"],
                                username: googleUser.email,
                                // password: hashedPassword,
                            },
                        ],
                        { session: session }
                    );

                    // sendMail({
                    //     template: "newGoogleUserEmail",
                    //     templateVars: {
                    //         username: googleUser.email,
                    //         password: password,
                    //     },
                    //     to: googleUser.email,
                    //     subject: "New Account",
                    // });
                }

                const authTokens = await this.generateAuthTokens(user);

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
            session.startTransaction();
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

                if (acc.refreshToken !== body.refreshToken)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Invalid refresh token!",
                        })
                    );

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
