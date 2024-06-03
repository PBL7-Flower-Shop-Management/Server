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

    async ForgotPassword(body: any) {
        try {
            return await UserService.ForgotPassword(body);
        } catch (error) {
            throw error;
        }
    }

    async ResetPassword(body: any) {
        try {
            return await UserService.ResetPassword(body);
        } catch (error) {
            throw error;
        }
    }

    async ChangePassword(body: any, _id: string) {
        try {
            return await UserService.ChangePassword(body, _id);
        } catch (error) {
            throw error;
        }
    }

    async GetProfile(_id: string) {
        try {
            return await UserService.GetProfile(_id);
        } catch (error) {
            throw error;
        }
    }

    async EditProfile(body: any, _id: string) {
        try {
            return await UserService.EditProfile(body, _id);
        } catch (error) {
            throw error;
        }
    }

    async GetIdentificationHistory(userId: string) {
        try {
            return await UserService.GetIdentificationHistory(userId);
        } catch (error: any) {
            throw error;
        }
    }
}

const userController = new UserController();
export default userController;
