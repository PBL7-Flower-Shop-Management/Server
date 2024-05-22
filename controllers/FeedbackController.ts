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

    async GetFeedbackById(id: string) {
        try {
            return await FeedbackService.GetFeedbackById(id);
        } catch (error) {
            throw error;
        }
    }

    async DeleteFeedback(id: string, username: string) {
        try {
            return await FeedbackService.DeleteFeedback(id, username);
        } catch (error) {
            throw error;
        }
    }
}

export default new FeedbackController();
