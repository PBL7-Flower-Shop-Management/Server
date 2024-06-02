import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import CartModel from "@/models/CartModel";
import mongoose from "mongoose";
import moment from "moment";
import FlowerModel from "@/models/FlowerModel";

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

    async CreateCart(cart: any, userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
            maxTimeMS: 5000, // Adjust the timeout as needed
        });
            try {
                if (
                    !(await FlowerModel.findOne({
                        _id: cart.flowerId,
                        isDeleted: false,
                    }))
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Flower not found!",
                        })
                    );
                }

                if (
                    await CartModel.findOne({
                        flowerId: cart.flowerId,
                        userId: userId,
                    })
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "This flower already exists in your cart!",
                        })
                    );
                }

                const newCart = await CartModel.create(
                    [
                        {
                            ...cart,
                            userId: userId,
                            selected: false,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.CREATED,
                        data: newCart,
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

    async UpdateCart(cart: any, userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
            maxTimeMS: 5000, // Adjust the timeout as needed
        });
            try {
                cart.selected = cart.selected ?? false;
                if (
                    !(await FlowerModel.findOne({
                        _id: cart.flowerId,
                        isDeleted: false,
                    }))
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Flower not found!",
                        })
                    );
                }

                if (
                    !(await CartModel.findOne({
                        flowerId: cart.flowerId,
                        userId: userId,
                    }))
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "This flower not found in your cart!",
                        })
                    );
                }

                const updatedCart = await CartModel.findOneAndUpdate(
                    { flowerId: cart.flowerId, userId: userId },
                    {
                        $set: {
                            ...cart,
                        },
                    },
                    { session: session, new: true }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: updatedCart,
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

    async DeleteCart(flowerId: string, userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
            maxTimeMS: 5000, // Adjust the timeout as needed
        });
            try {
                if (
                    !(await CartModel.findOne({
                        flowerId: flowerId,
                        userId: userId,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Cart not found!",
                        })
                    );

                await CartModel.deleteOne(
                    { flowerId: flowerId, userId: userId },
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

    async DeleteCarts(body: any, userId: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
            maxTimeMS: 5000, // Adjust the timeout as needed
        });
            try {
                //delete avatar dianary
                const objectIds = body.flowerIds.map(
                    (id: string) => new mongoose.Types.ObjectId(id)
                );

                await CartModel.deleteMany(
                    { flowerId: { $in: objectIds }, userId: userId },
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
}

const cartService = new CartService();
export default cartService;
