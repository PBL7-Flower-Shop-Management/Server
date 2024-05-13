import { connectToDB } from "@/utils/database";
import ApiResponse from "@/utils/ApiResponse";
import mongoose from "mongoose";
import IdentificationHistoryModel from "@/models/IdentificationHistoryModel";

class IdentificationService {
    async GetIdentificationHistoryByUserId(
        userId: string
    ): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const histories = await IdentificationHistoryModel.aggregate([
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId),
                            isDeleted: false,
                        },
                    },
                    {
                        $lookup: {
                            from: "identificationresults",
                            localField: "_id",
                            foreignField: "identificationHistoryId",
                            as: "iResults",
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            date: "$date",
                            inputImage: "$inputImage",
                            results: {
                                $map: {
                                    input: "$iResults",
                                    in: {
                                        flowerName: "$$this.flowerName",
                                        accuracy: "$$this.accuracy",
                                        image: "$$this.image",
                                    },
                                },
                            },
                        },
                    },
                ]);

                if (histories.length === 0)
                    reject(
                        new ApiResponse({
                            status: 404,
                            message: "Not found history",
                        })
                    );
                else
                    resolve(
                        new ApiResponse({
                            status: 200,
                            data: histories,
                        })
                    );
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new IdentificationService();
