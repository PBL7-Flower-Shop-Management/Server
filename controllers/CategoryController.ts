import CategoryService from "@/services/CategoryService";
import ApiResponse from "@/utils/ApiResponse";
import { NextApiRequest } from "next";

class CategoryController {
    async GetCategoryWithFlowers(query?: URLSearchParams) {
        try {
            const limit = query?.get("limit");
            return await CategoryService.GetCategoryWithFlowers(
                limit ? Number(limit) : undefined
            );
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
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
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }
}

export default new CategoryController();
