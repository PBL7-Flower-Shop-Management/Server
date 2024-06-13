import CommentModel from "@/models/CommentModel";
import HttpStatus from "http-status";
import { connectToDB } from "@/utils/database";
import ApiResponse from "@/utils/ApiResponse";
import mongoose from "mongoose";
import moment from "moment";
import { parseSortString } from "@/utils/helper";
import OrderModel from "@/models/OrderModel";
import OrderDetailModel from "@/models/OrderDetailModel";
import AccountModel from "@/models/AccountModel";
import { orderStatusMap } from "@/utils/constants";
import UserLikeCommentModel from "@/models/UserLikeCommentModel";

class FeedbackService {
    async GetRecentFeedback(limit?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const recentFeedbacks = await CommentModel.aggregate([
                    {
                        $sort: { commentDate: -1 },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "feedbackBy",
                        },
                    },
                    {
                        $unwind: "$feedbackBy",
                    },
                    {
                        $lookup: {
                            from: "orderdetails",
                            localField: "orderDetailId",
                            foreignField: "_id",
                            as: "od",
                        },
                    },
                    {
                        $unwind: "$od",
                    },
                    {
                        $lookup: {
                            from: "flowers",
                            localField: "od.flowerId",
                            foreignField: "_id",
                            as: "flower",
                        },
                    },
                    {
                        $unwind: "$flower",
                    },
                    {
                        $match: {
                            "flower.isDeleted": false,
                        },
                    },
                    ...(limit ? [{ $limit: limit }] : []),
                    {
                        $project: {
                            content: 1,
                            numberOfStars: 1,
                            feedbackBy: "$feedbackBy.name",
                            commentDate: "$commentDate",
                            flowerId: "$od.flowerId",
                        },
                    },
                    {
                        $sort: { commentDate: -1 },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: recentFeedbacks,
                    })
                );
            } catch (error) {
                return reject(error);
            }
        });
    }

    async GetAllFeedback(query: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                query.keyword = query.keyword ?? "";
                query.pageNumber = query.pageNumber ?? 1;
                query.pageSize = query.pageSize ?? 10;
                query.isExport = query.isExport ?? false;
                query.orderBy = query.orderBy ?? "numberOfStars:-1";

                const orderBy = parseSortString(query.orderBy);
                if (!orderBy)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Order by field don't follow valid format!",
                        })
                    );

                const feedbacks = await CommentModel.aggregate([
                    {
                        $lookup: {
                            from: "orderdetails",
                            localField: "orderDetailId",
                            foreignField: "_id",
                            as: "orderdetail",
                        },
                    },
                    {
                        $unwind: "$orderdetail",
                    },
                    {
                        $lookup: {
                            from: "flowers",
                            localField: "orderdetail.flowerId",
                            foreignField: "_id",
                            as: "flower",
                        },
                    },
                    {
                        $unwind: "$flower",
                    },
                    {
                        $match: {
                            "flower.isDeleted": false,
                        },
                    },
                    {
                        $lookup: {
                            from: "accounts",
                            localField: "userId",
                            foreignField: "userId",
                            as: "account",
                        },
                    },
                    {
                        $unwind: "$account",
                    },
                    {
                        $match: {
                            "account.isDeleted": false,
                        },
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    "account.username": {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    content: {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            flowerId: "$orderdetail.flowerId",
                            feedbackBy: "$account.username",
                            content: 1,
                            numberOfStars: 1,
                            numberOfLikes: 1,
                            commentDate: 1,
                            imageVideoFiles: 1,
                        },
                    },
                ])
                    .skip(
                        query.isExport
                            ? 0
                            : (query.pageNumber - 1) * query.pageSize
                    )
                    .limit(
                        query.isExport
                            ? Number.MAX_SAFE_INTEGER
                            : query.pageSize
                    )
                    .collation({ locale: "en", caseLevel: false, strength: 1 })
                    .sort(orderBy);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: feedbacks,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async CreateFeedback(feedback: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                //upload image cloudinary

                const orderdetail = await OrderDetailModel.findOne({
                    _id: feedback.orderDetailId,
                });
                if (!orderdetail)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Order don't exist!",
                        })
                    );

                const order = await OrderModel.findOne({
                    _id: orderdetail.orderId,
                    isDeleted: false,
                });
                if (!order)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Order don't exist!",
                        })
                    );

                if (order.status !== orderStatusMap.Delivered)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "You can't feedback for undelivered order!",
                        })
                    );

                const user = await AccountModel.findOne({
                    userId: order.orderUserId,
                    isDeleted: false,
                    isActived: true,
                });

                if (!user)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Order user don't exist or haven't been actived account!",
                        })
                    );

                if (user.username !== feedback.createdBy)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "You don't have access to create feedback for order of other user!",
                        })
                    );

                const currentDate = moment().toDate();

                const newFeedback = await CommentModel.create(
                    [
                        {
                            ...feedback,
                            userId: user.userId,
                            commentDate: currentDate,
                            numberOfLikes: 0,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.CREATED,
                        data: newFeedback,
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

    async UpdateFeedback(feedback: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const feedbackDb = await CommentModel.findOne({
                    _id: feedback._id,
                });
                if (!feedbackDb)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Feedback not found!",
                        })
                    );

                const orderdetail = await OrderDetailModel.findOne({
                    _id: feedbackDb.orderDetailId,
                });
                if (!orderdetail)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Order don't exist!",
                        })
                    );

                const order = await OrderModel.findOne({
                    _id: orderdetail.orderId,
                    isDeleted: false,
                });
                if (!order)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Order don't exist!",
                        })
                    );

                if (order.status !== orderStatusMap.Delivered)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "You can't feedback for undelivered order!",
                        })
                    );

                const user = await AccountModel.findOne({
                    userId: order.orderUserId,
                    isDeleted: false,
                    isActived: true,
                });

                if (!user)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Order user don't exist or haven't been actived account!",
                        })
                    );

                if (user.username !== feedback.updatedBy)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "You don't have access to update feedback for order of other user!",
                        })
                    );

                //update image cloudinary

                const updatedFeedback = await CommentModel.findOneAndUpdate(
                    { _id: feedback._id },
                    {
                        $set: {
                            ...feedback,
                            commentDate: moment().toDate(),
                        },
                    },
                    { session: session, new: true }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: updatedFeedback,
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

    async UpdateFeedbackLike(body: any, userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                body.isLike = body.isLike ?? false;
                const feedbackDb = await CommentModel.findOne({
                    _id: body._id,
                });
                if (!feedbackDb)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Feedback not found!",
                        })
                    );

                // const orderdetail = await OrderDetailModel.findOne({
                //     _id: feedbackDb.orderDetailId,
                // });
                // if (!orderdetail)
                //     return reject(
                //         new ApiResponse({
                //             status: HttpStatus.BAD_REQUEST,
                //             message: "Order of feedback don't exist!",
                //         })
                //     );

                // const order = await OrderModel.findOne({
                //     _id: orderdetail.orderId,
                //     isDeleted: false,
                // });
                // if (!order)
                //     return reject(
                //         new ApiResponse({
                //             status: HttpStatus.BAD_REQUEST,
                //             message: "Order of feedback don't exist!",
                //         })
                //     );

                // if (order.orderUserId.toString() === userId)
                //     return reject(
                //         new ApiResponse({
                //             status: HttpStatus.FORBIDDEN,
                //             message: "You can't like your feedback!",
                //         })
                //     );

                if (
                    body.isLike ===
                    Boolean(
                        await UserLikeCommentModel.exists({
                            userId: userId,
                            commentId: feedbackDb._id,
                        })
                    )
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "You had liked/disliked on this feedback before!",
                        })
                    );

                //update image cloudinary

                const updatedFeedback = await CommentModel.findOneAndUpdate(
                    { _id: body._id },
                    {
                        $set: {
                            numberOfLikes: body.isLike
                                ? feedbackDb.numberOfLikes + 1
                                : feedbackDb.numberOfLikes > 0
                                ? feedbackDb.numberOfLikes - 1
                                : 0,
                        },
                    },
                    { session: session, new: true }
                );

                if (body.isLike)
                    await UserLikeCommentModel.create(
                        [
                            {
                                userId: userId,
                                commentId: feedbackDb._id,
                            },
                        ],
                        { session: session }
                    );
                else
                    await UserLikeCommentModel.deleteOne({
                        userId: userId,
                        commentId: feedbackDb._id,
                    });

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: updatedFeedback,
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

const feedbackService = new FeedbackService();
export default feedbackService;
