import FeedbackService from "@/services/FeedbackService";

class FeedbackController {
    async GetRecentFeedback(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await FeedbackService.GetRecentFeedback(
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            throw error;
        }
    }
}

export default new FeedbackController();
