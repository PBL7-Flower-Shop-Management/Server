import { connectToDB } from "@/utils/database";
import ApiResponse from "@/utils/ApiResponse";
import CategoryModel from "@/models/CategoryModel";
import FlowerModel from "@/models/FlowerModel";
import mongoose from "mongoose";

class CategoryService {
    async GetCategoryWithFlowers(limit?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const representCategories = await CategoryModel.aggregate([
                    { $match: { isDeleted: false } },
                    {
                        $sort: { categoryName: 1 },
                    },
                    {
                        $lookup: {
                            from: "flowercategories",
                            localField: "_id",
                            foreignField: "categoryId",
                            as: "fc",
                        },
                    },
                    {
                        $lookup: {
                            from: "flowers",
                            let: { flowerIds: "$fc.flowerId" },
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
                        $project: {
                            _id: 1,
                            name: "$categoryName",
                            avatar: "$image",
                            flowers: {
                                $map: {
                                    input: limit
                                        ? { $slice: ["$f", limit] }
                                        : "$f",
                                    in: {
                                        _id: "$$this._id",
                                        name: "$$this.name",
                                        stars: "$$this.starsTotal",
                                        unitPrice: "$$this.unitPrice",
                                        status: "$$this.status",
                                        discount: "$$this.discount",
                                        soldQuantity: "$$this.soldQuantity",
                                        image: {
                                            $cond: [
                                                {
                                                    $ne: [
                                                        "$$this.imageVideoFiles",
                                                        null,
                                                    ],
                                                },
                                                {
                                                    $arrayElemAt: [
                                                        "$$this.imageVideoFiles",
                                                        0,
                                                    ],
                                                },
                                                null,
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                ]);

                const flowers = await FlowerModel.find(
                    {},
                    {
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
                    }
                );

                representCategories.unshift({
                    _id: 0,
                    name: "Tất cả",
                    avatar: "https://th.bing.com/th/id/R.d10f6cdbdee788fc31c200a327335357?rik=Eqo%2bzTxQDGQmbg&pid=ImgRaw&r=0",
                    flowers: limit
                        ? flowers.slice(0, Math.min(limit, flowers.length))
                        : flowers,
                });

                resolve(
                    new ApiResponse({
                        status: 200,
                        data: representCategories,
                    })
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetCategoryByIdWithFlowers(
        id: string,
        limit?: number
    ): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                if (id !== "0") {
                    const representCategories = await CategoryModel.aggregate([
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(id),
                                isDeleted: false,
                            },
                        },
                        {
                            $lookup: {
                                from: "flowercategories",
                                localField: "_id",
                                foreignField: "categoryId",
                                as: "fc",
                            },
                        },
                        {
                            $lookup: {
                                from: "flowers",
                                let: { flowerIds: "$fc.flowerId" },
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
                                as: "f",
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: "$categoryName",
                                avatar: "$image",
                                flowers: {
                                    $map: {
                                        input: limit
                                            ? { $slice: ["$f", limit] }
                                            : "$f",
                                        in: {
                                            _id: "$$this._id",
                                            name: "$$this.name",
                                            stars: "$$this.starsTotal",
                                            unitPrice: "$$this.unitPrice",
                                            status: "$$this.status",
                                            discount: "$$this.discount",
                                            soldQuantity: "$$this.soldQuantity",
                                            image: {
                                                $cond: [
                                                    {
                                                        $ne: [
                                                            "$$this.imageVideoFiles",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $arrayElemAt: [
                                                            "$$this.imageVideoFiles",
                                                            0,
                                                        ],
                                                    },
                                                    null,
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ]);

                    if (representCategories.length === 0)
                        reject(
                            new ApiResponse({
                                status: 404,
                                message: "Not found category",
                            })
                        );
                    else
                        resolve(
                            new ApiResponse({
                                status: 200,
                                data: representCategories[0],
                            })
                        );
                } else {
                    const flowers = await FlowerModel.find(
                        {},
                        {
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
                        }
                    );

                    const representCategories = {
                        _id: 0,
                        name: "Tất cả",
                        avatar: "https://th.bing.com/th/id/R.d10f6cdbdee788fc31c200a327335357?rik=Eqo%2bzTxQDGQmbg&pid=ImgRaw&r=0",
                        flowers: limit
                            ? flowers.slice(0, Math.min(limit, flowers.length))
                            : flowers,
                    };

                    resolve(
                        new ApiResponse({
                            status: 200,
                            data: representCategories,
                        })
                    );
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new CategoryService();
