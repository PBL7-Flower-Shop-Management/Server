import { connectToDB } from "@/utils/database";
import bcrypt from "bcryptjs";
import AccountModel from "@/models/AccountModel";
import moment from "moment";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";
import { generateRandomPassword, unicodeToAscii } from "@/utils/helper";
import { sendMail } from "@/utils/sendMail";

class AccountService {
    async CreateAccount(user: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                if (
                    await UserModel.findOne({ email: user.email.toLowerCase() })
                ) {
                    reject(
                        new ApiResponse({
                            status: 400,
                            message: "Email already exists!",
                        })
                    );
                }

                const wordsInName = unicodeToAscii(user.name)
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
                        user.username = username;
                        let count = 2;
                        while (true) {
                            if (
                                await AccountModel.findOne({
                                    username: user.username,
                                })
                            ) {
                                user.username = username + count;
                                count++;
                            } else break;
                        }
                    }
                }

                const newUser = await UserModel.create(
                    [
                        {
                            ...user,
                            createdAt: moment(),
                            createdBy: "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);

                const randomPassword = generateRandomPassword();
                const hashedPassword = await bcrypt.hash(
                    randomPassword,
                    parseInt(process.env.BCRYPT_SALT!)
                );

                await AccountModel.create(
                    [
                        {
                            userId: newUser._id,
                            isActived: user.isActived,
                            username: user.username,
                            password: hashedPassword,
                        },
                    ],
                    { session: session }
                );

                await sendMail({
                    to: user.email,
                    subject: "New Account",
                    html: `Tài khoản của bạn đã được tạo trên hệ thống:<br>
                        Tên đăng nhập: ${user.username}<br>
                        Mật khẩu: ${randomPassword}<br>
                        Hãy đăng nhập vào hệ thống ${process.env.LOGIN_PAGE_URL} và đổi mật khẩu ngay để tránh bị lộ thông tin cá nhân.<br>
                        Liên hệ với người quản trị nếu bạn gặp bất kì vấn đề gì khi đăng nhập vào hệ thống!<br>`,
                });

                await session.commitTransaction();
                session.endSession();

                resolve(
                    new ApiResponse({
                        status: 201,
                        data: newUser,
                    })
                );
            } catch (error: any) {
                await session.abortTransaction();
                session.endSession();
                reject(error);
            }
        });
    }
}

export default new AccountService();
