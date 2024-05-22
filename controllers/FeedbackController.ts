import FeedbackService from "@/services/FeedbackService";

class FeedbackController {
    async GetRecentFeedback(query: any) {
        try {
            return await FeedbackService.GetRecentFeedback(query.limit);
        } catch (error: any) {
            throw error;
        }
    }

    async GetAllFeedback(query: any) {
        try {
            return await FeedbackService.GetAllFeedback(query);
        } catch (error) {
            throw error;
        }
    }

    async CreateFeedback(body: any) {
        try {
            return await FeedbackService.CreateFeedback(body);
        } catch (error) {
            throw error;
        }
    }

    async UpdateFeedback(body: any) {
        try {
            return await FeedbackService.UpdateFeedback(body);
        } catch (error) {
            throw error;
        }
    }

    async UpdateFeedbackLike(body: any, userId: string) {
        try {
            return await FeedbackService.UpdateFeedbackLike(body, userId);
        } catch (error) {
            throw error;
        }
    }
}

export default new FeedbackController();
