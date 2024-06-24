import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import mongoose from "mongoose";
import OrderModel from "@/models/OrderModel";
import moment from "moment";
import {
    calculateTotalPrice,
    isNumberic,
    parseSortString,
} from "@/utils/helper";
import UserModel from "@/models/UserModel";
import AccountModel from "@/models/AccountModel";
import FlowerModel from "@/models/FlowerModel";
import OrderDetailModel from "@/models/OrderDetailModel";
import { orderStatusMap, roleMap } from "@/utils/constants";

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

                const results = await OrderModel.aggregate([
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
                        $addFields: {
                            usernameFromAccount: {
                                $arrayElemAt: ["$acc.username", 0],
                            },
                        },
                    },
                    {
                        $addFields: {
                            username: {
                                $cond: {
                                    if: {
                                        $gt: [
                                            { $type: "$orderUserId" },
                                            "missing",
                                        ],
                                    },
                                    then: "$usernameFromAccount",
                                    else: "$username",
                                },
                            },
                        },
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    username: {
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
                            ],
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            username: 1,
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

    async CreateOrder(order: any, user: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                if (user.role === roleMap.Customer) {
                    if (order.orderUserId || order.username)
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.BAD_REQUEST,
                                message:
                                    "orderUserId or username field is unknown!",
                            })
                        );
                    else order.orderUserId = user._id;
                } else {
                    if (
                        (order.orderUserId === null ||
                            order.orderUserId === undefined ||
                            `${order.orderUserId}`.trim() === "") &&
                        (order.username === null ||
                            order.username === undefined ||
                            `${order.username}`.trim() === "")
                    )
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.BAD_REQUEST,
                                message: "Order user is required!",
                            })
                        );
                }

                if (order.orderUserId) {
                    const userDb = await AccountModel.findOne({
                        userId: order.orderUserId,
                        isDeleted: false,
                        isActived: true,
                    });

                    if (
                        !(await UserModel.findOne({
                            _id: order.orderUserId,
                            isDeleted: false,
                        })) ||
                        !userDb
                    ) {
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.BAD_REQUEST,
                                message:
                                    "Order user don't exist or haven't been actived account!",
                            })
                        );
                    }
                }

                order.totalPrice = calculateTotalPrice(
                    order.shipPrice,
                    order.discount,
                    order.orderDetails
                );

                const isCancelled = order.status === orderStatusMap.Cancelled;

                if (order.orderDetails) {
                    //check flower id exists
                    for (let orderDetail of order.orderDetails) {
                        const flower = await FlowerModel.findOne({
                            _id: orderDetail._id,
                            isDeleted: false,
                        }).session(session);

                        if (!flower)
                            return reject(
                                new ApiResponse({
                                    status: HttpStatus.BAD_REQUEST,
                                    message: `Flower id ${orderDetail._id} don't exists!`,
                                })
                            );

                        if (
                            orderDetail.numberOfFlowers >
                            flower.quantity - flower.soldQuantity
                        )
                            return reject(
                                new ApiResponse({
                                    status: HttpStatus.BAD_REQUEST,
                                    message: `The remain quantity of flower "${flower.name}" not enough for this order!`,
                                })
                            );

                        if (!isCancelled) {
                            flower.soldQuantity += orderDetail.numberOfFlowers;
                            flower.save();
                        }

                        orderDetail.unitPrice = flower.unitPrice;
                        orderDetail.discount = flower.discount;
                    }
                }

                const currentDate = moment().toDate();

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
                                orderDetail._id as string
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

    async UpdateOrder(order: any, user: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const orderDb = await OrderModel.findOne({
                    _id: order._id,
                    isDeleted: false,
                }).session(session);

                if (!orderDb)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Order not found!",
                        })
                    );

                if (orderDb.status === orderStatusMap.Delivered)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "Order can't be updated because it had been delivered!",
                        })
                    );

                order.totalPrice = calculateTotalPrice(
                    order.shipPrice,
                    order.discount,
                    order.orderDetails
                );

                if (order.orderDetails) {
                    //check flower id exists
                    for (let orderDetail of order.orderDetails) {
                        const flower = await FlowerModel.findOne({
                            _id: orderDetail._id,
                            isDeleted: false,
                        }).session(session);
                        if (!flower)
                            return reject(
                                new ApiResponse({
                                    status: HttpStatus.BAD_REQUEST,
                                    message: `Flower id ${orderDetail._id} don't exists!`,
                                })
                            );

                        orderDetail.unitPrice = flower.unitPrice;
                        orderDetail.discount = flower.discount;
                        orderDetail.remain =
                            flower.quantity - flower.soldQuantity;
                        orderDetail.flowerName = flower.name;
                    }
                }

                //update image cloudinary

                const updatedOrder = await OrderModel.findOneAndUpdate(
                    { _id: order._id },
                    {
                        $set: {
                            ...order,
                            updatedAt: moment().toDate(),
                            updatedBy: order.updatedBy ?? "System",
                        },
                    },
                    { session: session, new: true }
                );

                // Find existing order details for the orderId
                const existingOrderDetails = await OrderDetailModel.find({
                    orderId: updatedOrder._id,
                }).session(session);

                const isFirstCancelled =
                    order.status === orderStatusMap.Cancelled &&
                    orderDb.status !== orderStatusMap.Cancelled;

                const isUndoCancel =
                    order.status !== orderStatusMap.Cancelled &&
                    orderDb.status === orderStatusMap.Cancelled;

                if (isFirstCancelled) {
                    for (let orderDetailDb of existingOrderDetails) {
                        const flower = await FlowerModel.findOne({
                            _id: orderDetailDb.flowerId,
                            //isDeleted: false,
                        }).session(session);

                        if (flower) {
                            flower.soldQuantity -=
                                orderDetailDb.numberOfFlowers;
                            flower.save({ session });
                        }
                    }
                }

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
                            newDetail._id
                        );

                        if (existingDetail) {
                            //check oversales
                            if (isUndoCancel) {
                                if (
                                    newDetail.numberOfFlowers > newDetail.remain
                                )
                                    return reject(
                                        new ApiResponse({
                                            status: HttpStatus.BAD_REQUEST,
                                            message: `The remain quantity of flower "${newDetail.flowerName}" not enough for this order!`,
                                        })
                                    );
                            } else if (
                                newDetail.numberOfFlowers >
                                newDetail.remain +
                                    existingDetail.numberOfFlowers
                            )
                                return reject(
                                    new ApiResponse({
                                        status: HttpStatus.BAD_REQUEST,
                                        message: `The remain quantity of flower "${newDetail.flowerName}" not enough for this order!`,
                                    })
                                );

                            // Update existing order detail
                            existingDetail.numberOfFlowers =
                                newDetail.numberOfFlowers;
                            await existingDetail.save({ session });

                            // Remove the processed detail from the map
                            existingOrderDetailsMap.delete(newDetail._id);
                        } else {
                            //check oversales
                            if (newDetail.numberOfFlowers > newDetail.remain)
                                return reject(
                                    new ApiResponse({
                                        status: HttpStatus.BAD_REQUEST,
                                        message: `The quantity of flower "${newDetail.flowerName}" not enough for this order!`,
                                    })
                                );

                            // Create new order detail
                            await OrderDetailModel.create(
                                [
                                    {
                                        orderId: updatedOrder._id,
                                        flowerId: newDetail._id,
                                        unitPrice: newDetail.unitPrice,
                                        discount: newDetail.discount,
                                        numberOfFlowers:
                                            newDetail.numberOfFlowers,
                                    },
                                ],
                                { session: session }
                            );
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
                }).session(session);

                let updatedObj = updatedOrder.toObject();
                updatedObj.orderDetails = order.orderDetails;

                updatedObj.username = "";
                if (orderDb.orderUserId) {
                    const acc = await AccountModel.findOne({
                        userId: orderDb.orderUserId,
                    });
                    if (acc) updatedObj.username = acc.username;
                } else
                    updatedObj.username = orderDb.username
                        ? orderDb.username
                        : "";

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

    async GetOrderDetail(orderId: string, user: any): Promise<ApiResponse> {
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
                            orderUserId: 1,
                            username: {
                                $ifNull: ["$orderUserId", "$username"],
                            },
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

                if (orders[0].orderUserId) {
                    const userDb = await AccountModel.findOne({
                        userId: orders[0].orderUserId,
                    });

                    if (!userDb) orders[0].username = "";
                    else {
                        if (user.role === roleMap.Customer) {
                            if (user.username !== userDb.username)
                                return reject(
                                    new ApiResponse({
                                        status: HttpStatus.FORBIDDEN,
                                        message:
                                            "You don't have access to view order detail of other user",
                                    })
                                );
                        } else orders[0].username = userDb.username;
                    }

                    orders[0].orderUserId = undefined;
                }

                const isCancelled =
                    orders[0].status === orderStatusMap.Cancelled;

                for (let i = 0; i < orders[0].orderDetails.length; i++) {
                    let orderDetail = orders[0].orderDetails[i];
                    const flowerDetail = await FlowerModel.findOne({
                        _id: orderDetail.flowerId,
                    });
                    if (flowerDetail) {
                        if (isCancelled)
                            orders[0].orderDetails[i] = {
                                ...orderDetail,
                                ...flowerDetail._doc,
                            };
                        else
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

    async DeleteOrder(id: string, username: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const orderDb = await OrderModel.findOne({
                    _id: id,
                    isDeleted: false,
                });

                if (!orderDb)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Order not found!",
                        })
                    );

                if (
                    orderDb.status !== orderStatusMap.Delivered &&
                    orderDb.status !== orderStatusMap.Cancelled
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.FORBIDDEN,
                            message:
                                "Order can only be deleted once it has been delivered or cancelled!",
                        })
                    );

                await OrderModel.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            isDeleted: true,
                            updatedAt: moment().toDate(),
                            updatedBy: username ?? "system",
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

    async DeleteOrders(body: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const objectIds = body.orderIds.map(
                    (id: string) => new mongoose.Types.ObjectId(id)
                );

                const currentDate = moment().toDate();

                const res = await OrderModel.updateMany(
                    {
                        _id: { $in: objectIds },
                        status: {
                            $in: [
                                orderStatusMap.Delivered,
                                orderStatusMap.Cancelled,
                            ],
                        },
                    },
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

                if (res.modifiedCount === 0)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Order can only be deleted once it has been delivered or cancelled!",
                        })
                    );

                if (res.modifiedCount < objectIds.length)
                    return resolve(
                        new ApiResponse({
                            status: HttpStatus.OK,
                            message:
                                "There are one or several orders that cannot be deleted because they are not in delivered status or have been canceled!",
                        })
                    );

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
}

const orderService = new OrderService();
export default orderService;
