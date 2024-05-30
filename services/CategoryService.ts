import { connectToDB } from "@/utils/database";
import HttpStatus from "http-status";
import ApiResponse from "@/utils/ApiResponse";
import CategoryModel from "@/models/CategoryModel";
import FlowerModel from "@/models/FlowerModel";
import mongoose from "mongoose";
import moment from "moment";
import { parseSortString } from "@/utils/helper";
import CloudinaryService from "./CloudinaryService";

class CategoryService {
    async GetAllCategory(query: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                query.keyword = query.keyword ?? "";
                query.pageNumber = query.pageNumber ?? 1;
                query.pageSize = query.pageSize ?? 10;
                query.isExport = query.isExport ?? false;
                query.orderBy = query.orderBy ?? "categoryName:1";

                const orderBy = parseSortString(query.orderBy);
                if (!orderBy)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Order by field don't follow valid format!",
                        })
                    );

                const results = await CategoryModel.aggregate([
                    {
                        $match: {
                            isDeleted: false,
                            $or: [
                                {
                                    categoryName: {
                                        $regex: query.keyword,
                                        $options: "i",
                                    },
                                },
                                {
                                    description: {
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
                            categoryName: 1,
                            avatarUrl: 1,
                            description: 1,
                            createdAt: "$createdAt",
                            createdBy: "$createdBy",
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

    async CreateCategory(category: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                if (!category.avatar)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Category avatar is required!",
                        })
                    );

                if (
                    await CategoryModel.findOne({
                        categoryName: category.categoryName,
                        isDeleted: false,
                    })
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Category name already exists!",
                        })
                    );
                }
                //upload image cloudinary
                const response = await CloudinaryService.Upload(
                    category.avatar
                );

                category.avatarUrl = response.url;
                category.avatarId = response.public_id;

                const currentDate = moment().toDate();

                const newCategory = await CategoryModel.create(
                    [
                        {
                            ...category,
                            createdAt: currentDate,
                            createdBy: category.createdBy ?? "System",
                            isDeleted: false,
                        },
                    ],
                    { session: session }
                ).then((res) => res[0]);

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.CREATED,
                        data: newCategory,
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

    async UpdateCategory(category: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                if (!category.avatarUrl && !category.avatar)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Category avatar is required!",
                        })
                    );

                const categoryDb = await CategoryModel.findOne({
                    _id: category._id,
                    isDeleted: false,
                });

                if (!categoryDb)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Category not found!",
                        })
                    );

                if (
                    await CategoryModel.findOne({
                        _id: { $ne: category._id },
                        categoryName: category.categoryName,
                        isDeleted: false,
                    })
                ) {
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: "Category name already exists!",
                        })
                    );
                }
                //update cloudinary
                if (!category.avatarUrl && category.avatar) {
                    // upload image and retrieve photo_url
                    const response = await CloudinaryService.Upload(
                        category.avatar
                    );
                    if (categoryDb.avatarId) {
                        // delete old image async
                        await CloudinaryService.DeleteByPublicId(
                            categoryDb.avatarId
                        );
                    }

                    category.avatarUrl = response.url;
                    category.avatarId = response.public_id;
                }

                const updatedCategory = await CategoryModel.findOneAndUpdate(
                    { _id: category._id },
                    {
                        $set: {
                            ...category,
                            updatedAt: moment().toDate(),
                            updatedBy: category.updatedBy ?? "System",
                        },
                    },
                    {
                        session: session,
                        new: true,
                        select: "_id categoryName avatarUrl description",
                    }
                );

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: updatedCategory,
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
                            avatar: "$avatarUrl",
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
                    avatar: "https://th.bing.com/th/id/R.d10f6cdbdee788fc31cHttpStatus.OKa327335357?rik=Eqo%2bzTxQDGQmbg&pid=ImgRaw&r=0",
                    flowers: limit
                        ? flowers.slice(0, Math.min(limit, flowers.length))
                        : flowers,
                });

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: representCategories,
                    })
                );
            } catch (error) {
                return reject(error);
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
                        return reject(
                            new ApiResponse({
                                status: HttpStatus.NOT_FOUND,
                                message: "Not found category",
                            })
                        );
                    else
                        resolve(
                            new ApiResponse({
                                status: HttpStatus.OK,
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
                        avatar: "https://th.bing.com/th/id/R.d10f6cdbdee788fc31cHttpStatus.OKa327335357?rik=Eqo%2bzTxQDGQmbg&pid=ImgRaw&r=0",
                        flowers: limit
                            ? flowers.slice(0, Math.min(limit, flowers.length))
                            : flowers,
                    };

                    resolve(
                        new ApiResponse({
                            status: HttpStatus.OK,
                            data: representCategories,
                        })
                    );
                }
            } catch (error) {
                return reject(error);
            }
        });
    }

    async GetCategoryById(id: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            try {
                const category = await CategoryModel.findOne(
                    {
                        _id: id,
                        isDeleted: false,
                    },
                    {
                        _id: 1,
                        categoryName: 1,
                        avatarUrl: 1,
                        description: 1,
                    }
                );

                if (!category)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Category not found!",
                        })
                    );

                resolve(
                    new ApiResponse({
                        status: HttpStatus.OK,
                        data: category,
                    })
                );
            } catch (error: any) {
                return reject(error);
            }
        });
    }

    async DeleteCategory(id: string, username: string): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                if (
                    !(await CategoryModel.findOne({
                        _id: id,
                        isDeleted: false,
                    }))
                )
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.NOT_FOUND,
                            message: "Category not found!",
                        })
                    );

                //delete avatar dianary

                await CategoryModel.findOneAndUpdate(
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

    async DeleteCategories(body: any): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                //delete avatar dianary
                const objectIds = body.categoryIds.map(
                    (id: string) => new mongoose.Types.ObjectId(id)
                );

                const currentDate = moment().toDate();

                await CategoryModel.updateMany(
                    { _id: { $in: objectIds } },
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

const categoryService = new CategoryService();
export default categoryService;
