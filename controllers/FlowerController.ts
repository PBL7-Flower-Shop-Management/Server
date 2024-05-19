import FlowerService from "@/services/FlowerService";

class FlowerController {
    async GetBestSellerFlower(query: any) {
        try {
            return await FlowerService.GetBestSellerFlower(query.limit);
        } catch (error: any) {
            throw error;
        }
    }

    async GetDecorationFlower(query: any) {
        try {
            return await FlowerService.GetDecorationFlower(query.limit);
        } catch (error: any) {
            throw error;
        }
    }

    async GetFlowerAsGift(query: any) {
        try {
            return await FlowerService.GetFlowerAsGift(query.limit);
        } catch (error: any) {
            throw error;
        }
    }

    async GetSuggestedFlower(query: any) {
        try {
            return await FlowerService.GetSuggestedFlower(query.limit);
        } catch (error: any) {
            throw error;
        }
    }

    async GetFlowerDetail(id: string) {
        try {
            return await FlowerService.GetFlowerDetail(id);
        } catch (error: any) {
            throw error;
        }
    }

    async GetFeedbackOfFlower(id: string) {
        try {
            return await FlowerService.GetFeedbackOfFlower(id);
        } catch (error: any) {
            throw error;
        }
    }
}

export default new FlowerController();
