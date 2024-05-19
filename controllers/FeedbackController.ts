import FeedbackService from "@/services/FeedbackService";

class FeedbackController {
    async GetRecentFeedback(query: any) {
        try {
            return await FeedbackService.GetRecentFeedback(query.limit);
        } catch (error: any) {
            throw error;
        }
    }
}

export default new FeedbackController();
