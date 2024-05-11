import FeedbackService from "@/services/FeedbackService";
import ApiResponse from "@/utils/ApiResponse";
import { NextApiRequest } from "next";

class FeedbackController {
    async GetRecentFeedback(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await FeedbackService.GetRecentFeedback(
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }
}

export default new FeedbackController();
