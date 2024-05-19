import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import CartModel from "@/models/CartModel";
import mongoose from "mongoose";
import OrderModel from "@/models/OrderModel";
import FavoriteFlowerModel from "@/models/FavoriteFlowerModel";

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
                    reject(
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
                reject(error);
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
                            flowerId: "$f._id",
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
                reject(error);
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
                    reject(
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
                reject(error);
            }
        });
    }
}

export default new UserService();
