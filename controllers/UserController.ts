import UserService from "@/services/UserService";
import ApiResponse from "@/utils/ApiResponse";

class UserController {
    async GetCartByUserId(userId: string) {
        try {
            return await UserService.GetCartByUserId(userId);
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }

    async GetOrderByUserId(userId: string) {
        try {
            return await UserService.GetOrderByUserId(userId);
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }

    async GetFavouriteFlowerByUserId(userId: string) {
        try {
            return await UserService.GetFavouriteFlowerByUserId(userId);
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }
}

export default new UserController();
