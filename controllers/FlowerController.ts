import FlowerService from "@/services/FlowerService";

class FlowerController {
    async GetBestSellerFlower(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await FlowerService.GetBestSellerFlower(
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            throw error;
        }
    }

    async GetDecorationFlower(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await FlowerService.GetDecorationFlower(
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            throw error;
        }
    }

    async GetFlowerAsGift(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await FlowerService.GetFlowerAsGift(
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            throw error;
        }
    }

    async GetSuggestedFlower(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await FlowerService.GetSuggestedFlower(
                limit ? Number(limit) : undefined
            );
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