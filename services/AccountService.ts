import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import bcrypt from "bcryptjs";
import AccountModel from "@/models/AccountModel";
import moment from "moment";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/UserModel";
import mongoose from "mongoose";
import {
    generateRandomPassword,
    parseSortString,
    unicodeToAscii,
} from "@/utils/helper";
import { sendMail } from "@/utils/sendMail";
import { roleMap } from "@/utils/constants";
import CloudinaryService from "./CloudinaryService";

class AccountService {
    async GetAllAccount(query: any, user: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                query.keyword = query.keyword ?? "";
                query.pageNumber = query.pageNumber ?? 1;
                query.pageSize = query.pageSize ?? 10;
                query.isExport = query.isExport ?? false;
                query.orderBy = query.orderBy ?? "username:1";

                const orderBy = parseSortString(query.orderBy);
                if (!orderBy)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Order by field don't follow valid format!",
                        })
                    );

                const results = await UserModel.aggregate([
                    {
                        $match: {
                            _id: {
                                $ne: new mongoose.Types.ObjectId(
                                    String(user._id)
                                ),
                            },
                            isDeleted: false,
                            ...((user.role === roleMap.Employee ||
                                query.getCustomer) && {
                                role: roleMap.Customer,
                            }),
                        },
                    },
                    {
                        $lookup: {
                            from: "accounts",
                            let: { id: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ["$userId", "$$id"],
                                                },
                                                { $eq: ["$isDeleted", false] },
                                                // {
                                                //     $or: [
                                                //         {
                                                //             $regexMatch: {
                                                //                 input: "$username",
                                                //                 regex: query.keyword,
                                                //                 options: "i",
                                                //             },
                                                //         },
                                                //     ],
                                                // },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "acc",
                        },
                    },
                    {
                        $unwind: "$acc",
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    role: {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    name: {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    email: {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    "acc.username": {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            username: "$acc.username",
                            avatarUrl: "$avatarUrl",
                            avatarId: "$avatarId",
                            name: "$name",
                            // citizenId: "$citizenId",
                            email: "$email",
                            // phoneNumber: "$phoneNumber",
                            role: "$role",
                            isActived: "$acc.isActived",
                            createdAt: "$createdAt",
                            createdBy: "$createdBy",
                        },
                    },
                    {
                        $sort: orderBy,
                    },
                    {
                        $facet: {
                            // Paginated results
                            paginatedResults: [
                                {
                                    $skip: query.isExport
                                        ? 0
                                        : (query.pageNumber - 1) *
                                          query.pageSize,
                                },
                                {
                                    $limit: query.isExport
                                        ? Number.MAX_SAFE_INTEGER
                                        : query.pageSize,
                                },
                            ],
                            // Count of all documents that match the criteria
                            totalCount: [{ $count: "totalCount" }],
                        },
                    },
                ]).collation({ locale: "en", caseLevel: false, strength: 1 });

                const total =
                    results.length > 0
                        ? results[0].totalCount.length > 0
                            ? results[0].totalCount[0].totalCount
                            : 0
                        : 0;
                const paginatedResults =
                    results.length > 0 ? results[0].paginatedResults : [];

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        total: total,
                        data: paginatedResults,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async CreateAccount(user: any, userRole: string): Promise<ApiResponse> {
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
                    userRole === roleMap.Employee &&
                    user.role !== roleMap.Customer
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "You only have access to create account for customer!",
                        })
                    );

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
                                    isDeleted: false,
                                })
                            ) {
                                user.username = username + count;
                                count++;
                            } else break;
                        }
                    }
                }

                //upload image cloudinary
                if (!user.avatarUrl && user.avatar) {
                    // upload image and retrieve photo_url
                    const response = await CloudinaryService.Upload(
                        user.avatar
                    );

                    user.avatarUrl = response.url;
                    user.avatarId = response.public_id;
                } else if (!user.avatarUrl) {
                    user.avatarUrl = null;
                    user.avatarId = null;
                }

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
                    {
                        session: session,
                    }
                ).then((res) => res[0]);

                const randomPassword = generateRandomPassword();
                const hashedPassword = await bcrypt.hash(
                    randomPassword,
                    parseInt(process.env.BCRYPT_SALT!)
                );

                const newAcc = await AccountModel.create(
                    [
                        {
                            userId: newUser._id,
                            isActived: user.isActived,
                            username: user.username,
                            password: hashedPassword,
                            createdAt: currentDate,
                            createdBy: user.createdBy ?? "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);

                await sendMail({
                    to: user.email,
                    subject: "New Account",
                    html: `Tài khoản của bạn đã được tạo trên hệ thống:<br>
                        Tên đăng nhập: ${user.username}<br>
                        Mật khẩu: ${randomPassword}<br>
                        Hãy đăng nhập vào hệ thống ${
                            process.env.NEXT_PUBLIC_HOST_URL + "/login"
                        } và đổi mật khẩu ngay để tránh bị lộ thông tin cá nhân.<br>
                        Liên hệ với người quản trị nếu bạn gặp bất kì vấn đề gì khi đăng nhập vào hệ thống!<br>`,
                });

                let newObj: any = {};
                newObj._id = newUser._id;
                newObj.avatarUrl = newUser.avatarUrl;
                newObj.name = newUser.name;
                newObj.citizenId = newUser.citizenId;
                newObj.email = newUser.email;
                newObj.phoneNumber = newUser.phoneNumber;
                newObj.role = newUser.role;
                newObj.username = newAcc.username;
                newObj.isActived = newAcc.isActived;

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.CREATED,
                        data: newObj,
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

    async UpdateAccount(user: any, userRole: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const userDb = await UserModel.findOne({
                    _id: user._id,
                    isDeleted: false,
                });

                const acc = await AccountModel.findOne({
                    userId: user._id,
                    isDeleted: false,
                });

                if (!userDb || !acc)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                if (
                    userRole === roleMap.Employee &&
                    userDb.role !== roleMap.Customer
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "You only have access to edit customer information!",
                        })
                    );

                if (
                    await UserModel.findOne({
                        _id: { $ne: user._id },
                        email: user.email.toLowerCase(),
                    })
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Email already exists!",
                        })
                    );
                }
                //update cloudinary
                if (!user.avatarUrl && user.avatar) {
                    // upload image and retrieve photo_url
                    const response = await CloudinaryService.Upload(
                        user.avatar
                    );
                    if (userDb.avatarId) {
                        // delete old image async
                        await CloudinaryService.DeleteByPublicId(
                            userDb.avatarId
                        );
                    }

                    user.avatarUrl = response.url;
                    user.avatarId = response.public_id;
                } else if (!user.avatarUrl) {
                    user.avatarUrl = null;
                    user.avatarId = null;
                    if (userDb.avatarId) {
                        // delete old image async
                        await CloudinaryService.DeleteByPublicId(
                            userDb.avatarId
                        );
                    }
                }

                const updatedUser = await UserModel.findOneAndUpdate(
                    { _id: user._id },
                    {
                        $set: {
                            ...user,
                            updatedAt: moment().toDate(),
                            updatedBy: user.updatedBy ?? "System",
                        },
                    },
                    {
                        session: session,
                        new: true,
                        select: "_id avatarUrl avatarId name citizenId email phoneNumber role",
                    }
                );

                let updatedObj = updatedUser.toObject();
                updatedObj.username = acc.username;
                updatedObj.isActived = acc.isActived;

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: updatedObj,
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

    async LockUnLockAccount(user: any, userRole: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const userDb = await UserModel.findOne({
                    _id: user._id,
                    isDeleted: false,
                });
                const acc = await AccountModel.findOne({
                    userId: user._id,
                    isDeleted: false,
                });

                if (!userDb || !acc)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                if (
                    userRole === roleMap.Employee &&
                    userDb.role !== roleMap.Customer
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "You only have access to lock/unlock customer account!",
                        })
                    );

                const updatedUser = await AccountModel.findOneAndUpdate(
                    { userId: user._id },
                    {
                        $set: {
                            isActived: user.isActived ?? false,
                            updatedAt: moment().toDate(),
                            updatedBy: user.updatedBy ?? "System",
                        },
                    },
                    {
                        session: session,
                        new: true,
                    }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: updatedUser.isActived,
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

    async GetAccountById(id: string, userRole: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            try {
                const userDb = await UserModel.findOne({
                    _id: id,
                    isDeleted: false,
                });

                if (
                    !userDb ||
                    !(await AccountModel.findOne({
                        userId: id,
                        isDeleted: false,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                if (
                    userRole === roleMap.Employee &&
                    userDb.role !== roleMap.Customer
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "You only have access to get customer information!",
                        })
                    );

                const account = await UserModel.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(id),
                            isDeleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: "accounts",
                            localField: "_id",
                            foreignField: "userId",
                            as: "acc",
                        },
                    },
                    {
                        $unwind: "$acc",
                    },
                    {
                        $project: {
                            _id: 1,
                            username: "$acc.username",
                            avatarUrl: "$avatarUrl",
                            avatarId: "$avatarId",
                            name: "$name",
                            citizenId: "$citizenId",
                            email: "$email",
                            phoneNumber: "$phoneNumber",
                            role: "$role",
                            isActived: "$acc.isActived",
                        },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: account[0],
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async DeleteAccount(id: string, user: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const userDb = await UserModel.findOne({
                    _id: id,
                    isDeleted: false,
                });

                if (
                    !userDb ||
                    !(await AccountModel.findOne({
                        userId: id,
                        isDeleted: false,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                if (
                    user.role === roleMap.Employee &&
                    userDb.role !== roleMap.Customer
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message: "You only have access to delete customer!",
                        })
                    );

                //delete avatar dianary

                await UserModel.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            isDeleted: true,
                            updatedAt: moment().toDate(),
                            updatedBy: user.username ?? "System",
                        },
                    },
                    { session: session, new: true }
                );

                await AccountModel.findOneAndUpdate(
                    { userId: id },
                    {
                        $set: {
                            isDeleted: true,
                            updatedAt: moment().toDate(),
                            updatedBy: user.username ?? "System",
                        },
                    },
                    { session: session, new: true }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.NO_CONTENT,
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

    async DeleteAccounts(body: any, userRole: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                if (userRole === roleMap.Employee) {
                    for (const id of body.accountIds) {
                        const userDb = await UserModel.findOne({
                            _id: id,
                            isDeleted: false,
                        });

                        if (userDb && userDb.role !== roleMap.Customer)
                            return reject(
                                new ApiResponse({
                                    status: HttpStatus.FORBIDDEN,
                                    message:
                                        "You only have access to delete customer account!",
                                })
                            );
                    }
                }

                //delete avatar dianary
                const objectIds = body.accountIds.map(
                    (id: string) => new mongoose.Types.ObjectId(id)
                );

                const currentDate = moment().toDate();

                await AccountModel.updateMany(
                    { userId: { $in: objectIds } },
                    {
                        $set: {
                            isDeleted: true,
                            updatedAt: currentDate,
                            updatedBy: body.updatedBy ?? "System",
                        },
                    },
                    { session: session }
                );

                await UserModel.updateMany(
                    { _id: { $in: objectIds } },
                    {
                        $set: {
                            isDeleted: true,
                            updatedAt: currentDate,
                            updatedBy: body.updatedBy ?? "System",
                        },
                    },
                    { session: session }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.NO_CONTENT,
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

    async AdminResetPassword(id: string, username: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();

            try {
                if (
                    !(await UserModel.findOne({
                        _id: id,
                        isDeleted: false,
                    })) ||
                    !(await AccountModel.findOne({
                        userId: id,
                        isDeleted: false,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                const randomPassword = generateRandomPassword();
                const hashedPassword = await bcrypt.hash(
                    randomPassword,
                    parseInt(process.env.BCRYPT_SALT!)
                );

                const user = await UserModel.findById(id);

                await AccountModel.updateOne(
                    { userId: id },
                    {
                        $set: {
                            password: hashedPassword,
                            updatedAt: moment().toDate(),
                            updatedBy: username ?? "System",
                        },
                    }
                );

                await sendMail({
                    to: user.email,
                    subject: "Thiết lập lại mật khẩu",
                    html: `Mật khẩu cho tài khoản của bạn đã được quản trị viên thiết lập lại:<br>
                        Mật khẩu mới: ${randomPassword}<br>
                        Hãy đăng nhập vào hệ thống ${
                            process.env.NEXT_PUBLIC_HOST_URL + "/login"
                        } và đổi mật khẩu ngay để tránh bị lộ thông tin cá nhân.<br>
                        Liên hệ với người quản trị nếu bạn gặp bất kì vấn đề gì khi đăng nhập vào hệ thống!<br>`,
                });

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }
}

const accountService = new AccountService();
export default accountService;
