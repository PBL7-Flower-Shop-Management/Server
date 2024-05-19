import CategoryService from "@/services/CategoryService";

class CategoryController {
    async GetCategoryWithFlowers(query: any) {
        try {
            return await CategoryService.GetCategoryWithFlowers(query.limit);
        } catch (error: any) {
            throw error;
        }
    }

    async GetCategoryByIdWithFlowers(id: string, query: any) {
        try {
            return await CategoryService.GetCategoryByIdWithFlowers(
                id,
                query.limit
            );
        } catch (error: any) {
            throw error;
        }
    }
}

export default new CategoryController();
