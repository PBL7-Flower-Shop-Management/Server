import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import mongoose from "mongoose";
import OrderModel from "@/models/OrderModel";
import moment from "moment";
import { parseSortString } from "@/utils/helper";
import UserModel from "@/models/UserModel";
import AccountModel from "@/models/AccountModel";
import FlowerModel from "@/models/FlowerModel";
import OrderDetailModel from "@/models/OrderDetailModel";

class OrderService {
    async GetAllOrder(query: any): Promise<ApiResponse> {
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

                const orders = await OrderModel.aggregate([
                    {
                        $match: {
                            isDeleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: "accounts",
                            let: { userId: "$orderUserId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: [
                                                        "$userId",
                                                        "$$userId",
                                                    ],
                                                },
                                                // { $eq: ["$isDeleted", false] },
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
                                    "acc.username": {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    shipAddress: {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    paymentMethod: {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    status: {
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
                            orderDate: 1,
                            shipDate: 1,
                            shipAddress: 1,
                            paymentMethod: 1,
                            totalPrice: 1,
                            status: 1,
                            note: 1,
                            createdAt: 1,
                            createdBy: 1,
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
                        data: orders,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async CreateOrder(order: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                if (
                    !(await UserModel.findOne({
                        _id: order.orderUserId,
                        isDeleted: false,
                    })) ||
                    !(await AccountModel.findOne({
                        userId: order.orderUserId,
                        isDeleted: false,
                    }))
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Order user don't exist!",
                        })
                    );
                }

                //check flower id exists
                if (order.orderDetails) {
                    for (let orderDetail of order.orderDetails) {
                        const flower = await FlowerModel.findOne({
                            _id: orderDetail.flowerId,
                            isDeleted: false,
                        });
                        if (!flower)
                            return reject(
                                new ApiResponse({
                                    status: HttpStatus.BAD_REQUEST,
                                    message: `Flower id ${orderDetail.flowerId} don't exists!`,
                                })
                            );

                        orderDetail.unitPrice = flower.unitPrice;
                        orderDetail.discount = flower.discount;
                    }
                }

                const currentDate = moment();
                console.log(order);
                const newOrder = await OrderModel.create(
                    [
                        {
                            ...order,
                            createdAt: currentDate,
                            createdBy: order.createdBy ?? "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);

                if (order.orderDetails) {
                    const orderDetails = order.orderDetails.map(
                        (orderDetail: any) => ({
                            orderId: new mongoose.Types.ObjectId(
                                newOrder._id as string
                            ),
                            flowerId: new mongoose.Types.ObjectId(
                                orderDetail.flowerId as string
                            ),
                            unitPrice: orderDetail.unitPrice,
                            discount: orderDetail.discount,
                            numberOfFlowers: orderDetail.numberOfFlowers,
                        })
                    );

                    await OrderDetailModel.insertMany(orderDetails, {
                        session: session,
                    });
                }

                let newObj = newOrder.toObject();
                newObj.orderDetails = order.orderDetails;

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

    async UpdateOrder(order: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                if (
                    !(await OrderModel.findOne({
                        _id: order._id,
                        isDeleted: false,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Order not found!",
                        })
                    );

                //check flower id exists
                if (order.orderDetails) {
                    for (let orderDetail of order.orderDetails) {
                        const flower = await FlowerModel.findOne({
                            _id: orderDetail.flowerId,
                            isDeleted: false,
                        });
                        if (!flower)
                            return reject(
                                new ApiResponse({
                                    status: HttpStatus.BAD_REQUEST,
                                    message: `Flower id ${orderDetail.flowerId} don't exists!`,
                                })
                            );

                        orderDetail.unitPrice = flower.unitPrice;
                        orderDetail.discount = flower.discount;
                    }
                }

                //update image cloudinary

                const updatedOrder = await OrderModel.findOneAndUpdate(
                    { _id: order._id },
                    {
                        $set: {
                            ...order,
                            updatedAt: moment(),
                            updatedBy: order.updatedBy ?? "System",
                        },
                    },
                    { session: session, new: true }
                );

                // Find existing order details for the orderId
                const existingOrderDetails = await OrderDetailModel.find({
                    orderId: updatedOrder._id,
                });

                // Create a map of existing order details by flowerId for easy lookup
                const existingOrderDetailsMap = new Map(
                    existingOrderDetails.map((detail) => [
                        detail.flowerId.toString(),
                        detail,
                    ])
                );

                if (order.orderDetails) {
                    // Loop through the new order details
                    for (const newDetail of order.orderDetails) {
                        const existingDetail = existingOrderDetailsMap.get(
                            newDetail.flowerId
                        );

                        if (existingDetail) {
                            // Update existing order detail
                            existingDetail.numberOfFlowers =
                                newDetail.numberOfFlowers;
                            await existingDetail.save();

                            // Remove the processed detail from the map
                            existingOrderDetailsMap.delete(newDetail.flowerId);
                        } else {
                            // Create new order detail
                            await OrderDetailModel.create({
                                orderId: updatedOrder._id,
                                flowerId: newDetail.flowerId,
                                unitPrice: newDetail.unitPrice,
                                discount: newDetail.discount,
                                numberOfFlowers: newDetail.numberOfFlowers,
                            });
                        }
                    }
                }

                // Delete remaining order details that were not in request
                const remainingDetailIds = Array.from(
                    existingOrderDetailsMap.keys()
                );
                await OrderDetailModel.deleteMany({
                    orderId: updatedOrder._id,
                    flowerId: { $in: remainingDetailIds },
                });

                let updatedObj = updatedOrder.toObject();
                updatedObj.orderDetails = order.orderDetails;

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

    async GetOrderDetail(orderId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                let orders = await OrderModel.aggregate([
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
                            orderDetails: "$orderDetails",
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

                for (let i = 0; i < orders[0].orderDetails.length; i++) {
                    let orderDetail = orders[0].orderDetails[i];
                    const flowerDetail = await FlowerModel.findOne({
                        _id: orderDetail.flowerId,
                    });
                    if (flowerDetail) {
                        orders[0].orderDetails[i] = {
                            ...orderDetail,
                            ...flowerDetail._doc,
                        };
                    }
                }

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: orders[0],
                    })
                );
            } catch (error) {
                return reject(error);
            }
        });
    }
}

export default new OrderService();
