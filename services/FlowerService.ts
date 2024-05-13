import FlowerModel from "@/models/FlowerModel";
import OrderDetailModel from "@/models/OrderDetailModel";
import OrderModel from "@/models/OrderModel";
import CategoryModel from "@/models/CategoryModel";
import FlowerCategoryModel from "@/models/FlowerCategoryModel";
import { connectToDB } from "@/utils/database";
import ApiResponse from "@/utils/ApiResponse";
import mongoose from "mongoose";

class FlowerService {
    async GetBestSellerFlower(limit?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const validOrderIds = (
                    await OrderModel.find({
                        status: {
                            $in: [
                                "Shipped",
                                "Delivered",
                                "Pending payment processing",
                            ],
                        },
                        isDeleted: false,
                    })
                ).map((o) => o._id);

                const flowerIds = await OrderDetailModel.aggregate([
                    { $match: { orderId: { $in: validOrderIds } } },
                    {
                        $group: {
                            _id: "$flowerId",
                            totalSold: { $sum: "$numberOfFlowers" },
                        },
                    },
                    {
                        $sort: { totalSold: -1 },
                    },
                    ...(limit ? [{ $limit: limit }] : []),
                    {
                        $project: {
                            _id: 1,
                        },
                    },
                ]);

                const flowers = await FlowerModel.find(
                    {
                        _id: { $in: flowerIds },
                        isDeleted: false,
                    },
                    {
                        name: 1,
                        stars: "$starsTotal",
                        unitPrice: 1,
                        status: 1,
                        discount: 1,
                        image: {
                            $cond: [
                                {
                                    $ne: ["$imageVideoFiles", null],
                                },
                                {
                                    $arrayElemAt: ["$imageVideoFiles", 0],
                                },
                                null,
                            ],
                        },
                    }
                );
                resolve(
                    new ApiResponse({
                        status: 200,
                        data: flowers,
                    })
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetDecorationFlower(limit?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const decorativeCategories = (
                    await CategoryModel.find({
                        categoryName: "Hoa trưng bày",
                        isDeleted: false,
                    })
                ).map((c) => c._id);

                const decorativeFlowerIds = (
                    await FlowerCategoryModel.find({
                        categoryId: { $in: decorativeCategories },
                    })
                ).map((c) => c.flowerId);

                let flowers = await FlowerModel.find(
                    {
                        _id: { $in: decorativeFlowerIds },
                        isDeleted: false,
                    },
                    {
                        name: 1,
                        stars: "$starsTotal",
                        unitPrice: 1,
                        status: 1,
                        discount: 1,
                        image: {
                            $cond: [
                                {
                                    $ne: ["$imageVideoFiles", null],
                                },
                                {
                                    $arrayElemAt: ["$imageVideoFiles", 0],
                                },
                                null,
                            ],
                        },
                    }
                );

                if (limit) {
                    flowers = flowers.slice(0, Math.min(limit, flowers.length));
                }

                resolve(
                    new ApiResponse({
                        status: 200,
                        data: flowers,
                    })
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetFlowerAsGift(limit?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const asGiftCategories = (
                    await CategoryModel.find({
                        categoryName: {
                            $in: [
                                "Hoa sinh nhật",
                                "Hoa tốt nghiệp",
                                "Hoa chúc mừng",
                            ],
                        },
                        isDeleted: false,
                    })
                ).map((c) => c._id);

                const asGiftFlowerIds = (
                    await FlowerCategoryModel.find({
                        categoryId: { $in: asGiftCategories },
                    })
                ).map((c) => c.flowerId);

                let flowers = await FlowerModel.find(
                    {
                        _id: { $in: asGiftFlowerIds },
                        isDeleted: false,
                    },
                    {
                        name: 1,
                        stars: "$starsTotal",
                        unitPrice: 1,
                        status: 1,
                        discount: 1,
                        image: {
                            $cond: [
                                {
                                    $ne: ["$imageVideoFiles", null],
                                },
                                {
                                    $arrayElemAt: ["$imageVideoFiles", 0],
                                },
                                null,
                            ],
                        },
                    }
                );

                if (limit) {
                    flowers = flowers.slice(0, Math.min(limit, flowers.length));
                }

                resolve(
                    new ApiResponse({
                        status: 200,
                        data: flowers,
                    })
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetSuggestedFlower(limit?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();
                const flowers = await FlowerModel.aggregate([
                    { $match: { isDeleted: false } },
                    {
                        $sample: {
                            size:
                                limit ??
                                (await FlowerModel.countDocuments({
                                    isDeleted: false,
                                })),
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            stars: "$starsTotal",
                            unitPrice: 1,
                            status: 1,
                            discount: 1,
                            soldQuantity: 1,
                            image: {
                                $cond: [
                                    {
                                        $ne: ["$imageVideoFiles", null],
                                    },
                                    {
                                        $arrayElemAt: ["$imageVideoFiles", 0],
                                    },
                                    null,
                                ],
                            },
                        },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: 200,
                        data: flowers,
                    })
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetFlowerDetail(id: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();
                const flower = await FlowerModel.find({ _id: id });
                if (flower.length === 0)
                    reject(
                        new ApiResponse({
                            status: 404,
                            message: "Not found flower",
                        })
                    );
                else
                    resolve(
                        new ApiResponse({
                            status: 200,
                            data: flower[0],
                        })
                    );
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetFeedbackOfFlower(id: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();
                const feedbacks = await OrderDetailModel.aggregate([
                    {
                        $match: {
                            flowerId: new mongoose.Types.ObjectId(id),
                        },
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "orderId",
                            foreignField: "orderId",
                            as: "comments",
                        },
                    },
                    {
                        $unwind: "$comments",
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$comments.userId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ["$_id", "$$userId"],
                                                },
                                                { $eq: ["$isDeleted", false] },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "user",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            content: "$comments.content",
                            numberOfStars: "$comments.numberOfStars",
                            numberOfLikes: "$comments.numberOfLikes",
                            feedbackBy: {
                                $cond: {
                                    if: { $eq: [{ $size: "$user" }, 0] },
                                    then: "$comments.userId",
                                    else: { $arrayElemAt: ["$user.name", 0] },
                                },
                            },
                            commentDate: "$comments.commentDate",
                            imageVideoFiles: "$comments.imageVideoFiles",
                        },
                    },
                ]);
                if (feedbacks.length === 0)
                    reject(
                        new ApiResponse({
                            status: 404,
                            message: "Not found feedback of this flower",
                        })
                    );
                else
                    resolve(
                        new ApiResponse({
                            status: 200,
                            data: feedbacks,
                        })
                    );
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new FlowerService();
