import CategoryService from "@/services/CategoryService";

class CategoryController {
    async GetAllCategory(query: any) {
        try {
            return await CategoryService.GetAllCategory(query);
        } catch (error) {
            throw error;
        }
    }

    async CreateCategory(body: any) {
        try {
            return await CategoryService.CreateCategory(body);
        } catch (error) {
            throw error;
        }
    }

    async UpdateCategory(body: any) {
        try {
            return await CategoryService.UpdateCategory(body);
        } catch (error) {
            throw error;
        }
    }

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
