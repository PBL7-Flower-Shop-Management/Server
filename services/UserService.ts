import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import CartModel from "@/models/CartModel";
import mongoose from "mongoose";
import OrderModel from "@/models/OrderModel";
import FavoriteFlowerModel from "@/models/FavoriteFlowerModel";
import UserModel from "@/models/UserModel";
import AccountModel from "@/models/AccountModel";
import moment from "moment";
import bcrypt from "bcryptjs";
import AuthService from "./AuthService";
import { sendMail } from "@/utils/sendMail";
import { verify } from "@/utils/JwtHelper";
import IdentificationHistoryModel from "@/models/IdentificationHistoryModel";
import { parseSortString } from "@/utils/helper";

class UserService {
    async GetOrderByUserId(userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const orders = await OrderModel.aggregate([
                    {
                        $match: {
                            orderUserId: new mongoose.Types.ObjectId(userId),
                            isDeleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: "orderdetails",
                            localField: "_id",
                            foreignField: "orderId",
                            as: "orderDetails",
                        },
                    },
                    {
                        $unwind: "$orderDetails",
                    },
                    {
                        $lookup: {
                            from: "flowers",
                            localField: "orderDetails.flowerId",
                            foreignField: "_id",
                            as: "flowerDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$flowerDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            orderDate: 1,
                            shipDate: 1,
                            shipAddress: 1,
                            shipPrice: 1,
                            discount: 1,
                            totalPrice: 1,
                            status: 1,
                            paymentMethod: 1,
                            note: 1,
                            orderDetails: {
                                _id: "$orderDetails._id",
                                name: "$flowerDetails.name",
                                unitPrice: "$orderDetails.unitPrice",
                                discount: "$orderDetails.discount",
                                numberOfFlowers:
                                    "$orderDetails.numberOfFlowers",
                                image: {
                                    $cond: [
                                        {
                                            $ne: [
                                                "$flowerDetails.imageVideoFiles",
                                                null,
                                            ],
                                        },
                                        {
                                            $arrayElemAt: [
                                                "$flowerDetails.imageVideoFiles",
                                                0,
                                            ],
                                        },
                                        null,
                                    ],
                                },
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            orderDate: { $first: "$orderDate" },
                            shipDate: { $first: "$shipDate" },
                            shipAddress: { $first: "$shipAddress" },
                            shipPrice: { $first: "$shipPrice" },
                            discount: { $first: "$discount" },
                            totalPrice: { $first: "$totalPrice" },
                            status: { $first: "$status" },
                            paymentMethod: { $first: "$paymentMethod" },
                            note: { $first: "$note" },
                            orderDetails: { $push: "$orderDetails" },
                        },
                    },
                ]);

                if (orders.length === 0)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Not found order",
                        })
                    );
                else
                    resolve(
                        new ApiResponse({
                            status: HttpStatus.OK,
                            data: orders,
                        })
                    );
            } catch (error) {
                return reject(error);
            }
        });
    }

    async GetCartByUserId(userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const cart = await CartModel.aggregate([
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId),
                        },
                    },
                    {
                        $group: {
                            _id: "$userId",
                            flowerId: { $push: "$flowerId" },
                            numberOfFlowers: { $push: "$numberOfFlowers" },
                            selected: { $push: "$selected" },
                        },
                    },
                    {
                        $lookup: {
                            from: "flowers",
                            let: { flowerIds: "$flowerId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $in: [
                                                        "$_id",
                                                        "$$flowerIds",
                                                    ],
                                                },
                                                { $eq: ["$isDeleted", false] },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "f",
                        },
                    },
                    {
                        $unwind: {
                            path: "$f",
                            includeArrayIndex: "arrayIndex",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            id: "$f._id",
                            name: "$f.name",
                            numberOfFlowers: {
                                $arrayElemAt: [
                                    "$numberOfFlowers",
                                    "$arrayIndex",
                                ],
                            },
                            unitPrice: "$f.unitPrice",
                            discount: "$f.discount",
                            image: {
                                $cond: [
                                    {
                                        $ne: ["$f.imageVideoFiles", null],
                                    },
                                    {
                                        $arrayElemAt: ["$f.imageVideoFiles", 0],
                                    },
                                    null,
                                ],
                            },
                            remainAmount: {
                                $subtract: ["$f.quantity", "$f.soldQuantity"],
                            },
                            selected: {
                                $arrayElemAt: ["$selected", "$arrayIndex"],
                            },
                        },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: cart,
                    })
                );
            } catch (error) {
                return reject(error);
            }
        });
    }

    async GetFavouriteFlowerByUserId(userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const favouriteFlowers = await FavoriteFlowerModel.aggregate([
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId),
                        },
                    },
                    {
                        $group: {
                            _id: "$userId",
                            flowerId: { $push: "$flowerId" },
                        },
                    },
                    {
                        $lookup: {
                            from: "flowers",
                            let: { flowerIds: "$flowerId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $in: [
                                                        "$_id",
                                                        "$$flowerIds",
                                                    ],
                                                },
                                                { $eq: ["$isDeleted", false] },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "f",
                        },
                    },
                    {
                        $unwind: "$f",
                    },
                    {
                        $project: {
                            _id: 0,
                            flowerId: "$f._id",
                            name: "$f.name",
                            stars: "$f.starsTotal",
                            unitPrice: "$f.unitPrice",
                            status: "$f.status",
                            discount: "$f.discount",
                            image: {
                                $cond: [
                                    {
                                        $ne: ["$f.imageVideoFiles", null],
                                    },
                                    {
                                        $arrayElemAt: ["$f.imageVideoFiles", 0],
                                    },
                                    null,
                                ],
                            },
                        },
                    },
                ]);

                if (favouriteFlowers.length === 0)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message:
                                "Not found favourite flowers of this user!",
                        })
                    );
                else
                    resolve(
                        new ApiResponse({
                            status: HttpStatus.OK,
                            data: favouriteFlowers,
                        })
                    );
            } catch (error) {
                return reject(error);
            }
        });
    }

    async ChangePassword(body: any, _id: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();

            try {
                const account = await AccountModel.findOne({
                    userId: _id,
                    isDeleted: false,
                });
                if (
                    !(await UserModel.findOne({
                        _id: _id,
                        isDeleted: false,
                    })) ||
                    !account
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                let passwordMatches = await bcrypt.compare(
                    body.password,
                    account.password
                );
                if (!passwordMatches) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Old password is not correct!",
                        })
                    );
                }

                const hashedPassword = await bcrypt.hash(
                    body.newPassword,
                    parseInt(process.env.BCRYPT_SALT!)
                );

                await AccountModel.updateOne(
                    { userId: _id },
                    {
                        $set: {
                            password: hashedPassword,
                            updatedAt: moment().toDate(),
                            updatedBy: body.updatedBy ?? "System",
                        },
                    }
                );

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

    async ForgotPassword(body: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();

            try {
                const user = await UserModel.findOne({
                    email: body.email,
                    isDeleted: false,
                });
                if (
                    !user ||
                    !(await AccountModel.findOne({
                        userId: user._id,
                        isDeleted: false,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                const resetToken = (
                    await AuthService.GenerateResetPasswordToken(body.email)
                ).data;

                // Encode the token
                const encodedToken =
                    Buffer.from(resetToken).toString("base64url");

                let passwordResetUrl = "";
                // Create the email content
                let mailText = "";

                if (body.resetPasswordPageUrl) {
                    // Construct the password reset URL
                    const endpointUri = new URL(body.resetPasswordPageUrl);
                    endpointUri.searchParams.append("token", encodedToken);

                    passwordResetUrl = endpointUri.toString();
                    mailText = `Kích vào link sau để thiết lập lại mật khẩu của bạn:<br/>${passwordResetUrl}`;
                } else {
                    passwordResetUrl = encodedToken;
                    mailText = `Token để thiết lập lại mật khẩu của bạn là (Hãy dán vào form thiết lập mật khẩu trên app):<br/>${passwordResetUrl}`;
                }

                await sendMail({
                    to: user.email,
                    subject: "Thiết lập lại mật khẩu",
                    html: mailText,
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

    async ResetPassword(body: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();

            try {
                // Decode the token, assuming it's Base64 encoded
                const decodedToken = Buffer.from(body.token, "base64").toString(
                    "utf-8"
                );
                const verifyToken = await verify(
                    decodedToken,
                    process.env.JWT_SECRET
                );
                if (!verifyToken)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Token is invalid!",
                        })
                    );

                const { email } = verifyToken;

                if (email !== body.email)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Requested email is invalid for your token!",
                        })
                    );

                const user = await UserModel.findOne({
                    email: email,
                    isDeleted: false,
                });
                if (
                    !user ||
                    !(await AccountModel.findOne({
                        userId: user._id,
                        isDeleted: false,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Account not found!",
                        })
                    );

                const hashedPassword = await bcrypt.hash(
                    body.password,
                    parseInt(process.env.BCRYPT_SALT!)
                );

                await AccountModel.updateOne(
                    { userId: user._id },
                    {
                        $set: {
                            password: hashedPassword,
                            updatedAt: moment().toDate(),
                            updatedBy: body.updatedBy ?? "System",
                        },
                    }
                );

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

    async GetProfile(id: string): Promise<ApiResponse> {
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
                            avatar: "$avatar",
                            name: "$name",
                            citizenId: "$citizenId",
                            email: "$email",
                            phoneNumber: "$phoneNumber",
                            role: "$role",
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

    async EditProfile(user: any, _id: string): Promise<ApiResponse> {
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
                    !(await UserModel.findOne({
                        _id: _id,
                        isDeleted: false,
                    })) ||
                    !(await AccountModel.findOne({
                        userId: _id,
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
                    await UserModel.findOne({
                        _id: { $ne: _id },
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

                //update image cloudinary

                const updatedUser = await UserModel.findOneAndUpdate(
                    { _id: _id },
                    {
                        $set: {
                            ...user,
                            updatedAt: moment().toDate(),
                            updatedBy: user.updatedBy ?? "System",
                        },
                    },
                    { session: session, new: true }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: updatedUser,
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

    async GetIdentificationHistory(userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const orderBy = parseSortString("date:-1");
                const histories = await IdentificationHistoryModel.aggregate([
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId),
                            isDeleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: "identificationresults",
                            localField: "_id",
                            foreignField: "identificationHistoryId",
                            as: "iResults",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$date",
                            inputImageUrl: "$inputImageUrl",
                            results: {
                                $map: {
                                    input: "$iResults",
                                    in: {
                                        english_label:
                                            "$$this.flowerEnglishName",
                                        vietnamese_label:
                                            "$$this.flowerVietnameseName",
                                        accuracy: "$$this.accuracy",
                                        imageUrl: "$$this.imageUrl",
                                    },
                                },
                            },
                        },
                    },
                    {
                        $sort: orderBy,
                    },
                ]);

                if (histories.length === 0)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Not found history",
                        })
                    );
                else
                    resolve(
                        new ApiResponse({
                            status: HttpStatus.OK,
                            data: histories,
                        })
                    );
            } catch (error) {
                return reject(error);
            }
        });
    }
}

const userService = new UserService();
export default userService;
