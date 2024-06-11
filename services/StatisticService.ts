import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/UserModel";
import FlowerModel from "@/models/FlowerModel";
import OrderModel from "@/models/OrderModel";
import { orderStatusMap } from "@/utils/constants";
import FlowerCategoryModel from "@/models/FlowerCategoryModel";

class StatisticService {
    async GetOverviewStatistic(): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const totalAccounts = (
                    await UserModel.aggregate([
                        { $match: { isDeleted: false } },
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
                                                        $eq: [
                                                            "$userId",
                                                            "$$id",
                                                        ],
                                                    },
                                                    {
                                                        $eq: [
                                                            "$isDeleted",
                                                            false,
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: "acc",
                            },
                        },
                    ])
                ).length;

                const productInfor = await FlowerModel.aggregate([
                    { $match: { isDeleted: false } },
                    {
                        $project: {
                            quantity: 1,
                            soldQuantity: 1,
                        },
                    },
                ]);

                const totalSales = await OrderModel.aggregate([
                    { $match: { status: orderStatusMap.Delivered } },
                    {
                        $project: {
                            totalPrice: 1,
                        },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: {
                            totalAccounts,
                            totalProducts: productInfor.reduce(
                                (acc, val) => acc + val.quantity,
                                0
                            ),
                            remainProducts: productInfor.reduce(
                                (acc, val) =>
                                    acc + (val.quantity - val.soldQuantity),
                                0
                            ),
                            totalSales: totalSales.reduce(
                                (acc, val) => acc + val.totalPrice,
                                0
                            ),
                        },
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async GetEvolutionOfRevenueStatistic(year?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const evolutionOfRevenue = await OrderModel.aggregate([
                    {
                        $match: {
                            status: orderStatusMap.Delivered,
                            ...(year !== null &&
                                year !== undefined && {
                                    $expr: {
                                        $eq: [{ $year: "$shipDate" }, year],
                                    },
                                }),
                        },
                    },
                    {
                        $group: {
                            _id: { $month: "$shipDate" },
                            totalSalesByMonth: { $sum: "$totalPrice" },
                            orderId: { $push: "$_id" },
                        },
                    },
                    {
                        $lookup: {
                            from: "orderdetails",
                            localField: "orderId",
                            foreignField: "orderId",
                            as: "od",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            totalSalesByMonth: 1,
                            totalSoldQuantity: { $sum: "$od.numberOfFlowers" },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: evolutionOfRevenue,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async GetRevenueByCategoryStatistic(year?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const revenueByCategory = await FlowerCategoryModel.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            let: { categoryId: "$categoryId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: [
                                                        "$_id",
                                                        "$$categoryId",
                                                    ],
                                                },
                                                {
                                                    $eq: ["$isDeleted", false],
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "category",
                        },
                    },
                    {
                        $unwind: {
                            path: "$category",
                            // preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "flowers",
                            let: { flowerId: "$flowerId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ["$_id", "$$flowerId"],
                                                },
                                                {
                                                    $eq: ["$isDeleted", false],
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "flower",
                        },
                    },
                    {
                        $unwind: {
                            path: "$flower",
                            // preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "orderdetails",
                            localField: "flowerId",
                            foreignField: "flowerId",
                            as: "orderDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$orderDetails",
                            // preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "orders",
                            let: { orderId: "$orderDetails.orderId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ["$_id", "$$orderId"],
                                                },
                                                {
                                                    $eq: [
                                                        "$status",
                                                        orderStatusMap.Delivered,
                                                    ],
                                                },
                                                {
                                                    ...(year !== null &&
                                                        year !== undefined && {
                                                            $eq: [
                                                                {
                                                                    $year: "$shipDate",
                                                                },
                                                                year,
                                                            ],
                                                        }),
                                                },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "order",
                        },
                    },
                    {
                        $unwind: {
                            path: "$order",
                            // preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $group: {
                            _id: "$categoryId",
                            categoryName: { $first: "$category.categoryName" },
                            avatarUrl: { $first: "$category.avatarUrl" },
                            totalSoldQuantity: {
                                $sum: "$orderDetails.numberOfFlowers",
                            },
                            totalSales: {
                                $sum: {
                                    $multiply: [
                                        "$orderDetails.numberOfFlowers",
                                        {
                                            $subtract: [
                                                "$orderDetails.unitPrice",
                                                {
                                                    $multiply: [
                                                        "$orderDetails.unitPrice",
                                                        {
                                                            $divide: [
                                                                "$orderDetails.discount",
                                                                100,
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: revenueByCategory,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async GetFlowerProductStructureStatistic(): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                let flowerProductStructure =
                    await FlowerCategoryModel.aggregate([
                        {
                            $group: {
                                _id: "$categoryId",
                                flowerIds: { $push: "$flowerId" },
                            },
                        },
                        {
                            $lookup: {
                                from: "flowers",
                                let: { flowerIds: "$flowerIds" },
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
                                                    {
                                                        $eq: [
                                                            "$isDeleted",
                                                            false,
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: "flowers",
                            },
                        },
                        {
                            $lookup: {
                                from: "categories",
                                let: { categoryId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            "$_id",
                                                            "$$categoryId",
                                                        ],
                                                    },
                                                    {
                                                        $eq: [
                                                            "$isDeleted",
                                                            false,
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                                as: "c",
                            },
                        },
                        {
                            $unwind: "$c",
                        },
                        {
                            $project: {
                                _id: 0,
                                categoryName: "$c.categoryName",
                                totalQuantity: { $size: "$flowers" },
                            },
                        },
                    ]);

                let total = flowerProductStructure.reduce(
                    (acc, val) => acc + val.totalQuantity,
                    0
                );
                flowerProductStructure = flowerProductStructure.map((fps) => ({
                    ...fps,
                    quantityPercent:
                        Math.round(((fps.totalQuantity * 100) / total) * 100) /
                        100,
                }));

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: flowerProductStructure,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async GetMinShipDateYear(): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                let minShipDateYear = await OrderModel.aggregate([
                    {
                        $match: {
                            status: orderStatusMap.Delivered,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            minShipDateYear: { $min: "$shipDate" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            minShipDateYear: { $year: "$minShipDateYear" },
                        },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data:
                            minShipDateYear && minShipDateYear.length > 0
                                ? minShipDateYear[0].minShipDateYear
                                : null,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }
}

const statisticService = new StatisticService();
export default statisticService;
