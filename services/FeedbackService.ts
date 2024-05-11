import CommentModel from "@/models/CommentModel";
import { connectToDB } from "@/utils/database";
import ApiResponse from "@/utils/ApiResponse";

class FeedbackService {
    async GetRecentFeedback(limit?: number): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                await connectToDB();

                const recentFeedbacks = await CommentModel.aggregate([
                    {
                        $sort: { commentDate: -1 },
                    },
                    ...(limit ? [{ $limit: limit }] : []),
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "feedbackBy",
                        },
                    },
                    {
                        $unwind: "$feedbackBy",
                    },
                    {
                        $project: {
                            content: 1,
                            numberOfStars: 1,
                            feedbackBy: "$feedbackBy.name",
                        },
                    },
                ]);

                resolve(
                    new ApiResponse({
                        status: 200,
                        data: recentFeedbacks,
                    })
                );
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new FeedbackService();
