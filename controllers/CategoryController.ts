import CategoryService from "@/services/CategoryService";
import ApiResponse from "@/utils/ApiResponse";

class CategoryController {
    async GetCategoryWithFlowers(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await CategoryService.GetCategoryWithFlowers(
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            throw error;
        }
    }

    async GetCategoryByIdWithFlowers(id: string, query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await CategoryService.GetCategoryByIdWithFlowers(
                id,
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            throw error;
        }
    }
}

export default new CategoryController();
