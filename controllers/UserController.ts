import UserService from "@/services/UserService";

class UserController {
    async GetCartByUserId(userId: string) {
        try {
            return await UserService.GetCartByUserId(userId);
        } catch (error: any) {
            throw error;
        }
    }

    async GetOrderByUserId(userId: string) {
        try {
            return await UserService.GetOrderByUserId(userId);
        } catch (error: any) {
            throw error;
        }
    }

    async GetFavouriteFlowerByUserId(userId: string) {
        try {
            return await UserService.GetFavouriteFlowerByUserId(userId);
        } catch (error: any) {
            throw error;
        }
    }
}

export default new UserController();
