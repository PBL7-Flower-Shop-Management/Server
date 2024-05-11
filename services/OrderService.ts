import { connectToDB } from "@/utils/database";
import ApiResponse from "@/utils/ApiResponse";
import mongoose from "mongoose";
import OrderModel from "@/models/OrderModel";

class OrderService {
    async GetOrderDetail(orderId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const orders = await OrderModel.aggregate([
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(orderId),
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
                    resolve(
                        new ApiResponse({
                            status: 404,
                            message: "Not found order",
                        })
                    );
                else
                    resolve(
                        new ApiResponse({
                            status: 200,
                            data: orders[0],
                        })
                    );
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new OrderService();
