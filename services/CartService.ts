import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import CartModel from "@/models/CartModel";
import mongoose from "mongoose";

class CartService {
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
                return reject(error);
            }
        });
    }
}

export default new CartService();
