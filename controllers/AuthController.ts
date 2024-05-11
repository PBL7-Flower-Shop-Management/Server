import AuthService from "@/services/AuthService";
import ApiResponse from "@/utils/ApiResponse";
class AuthController {
    async Login(body: any) {
        try {
            const { username, password } = body;
            const result = AuthService.GetUser(username, password) as any;
            if (result.status !== 200) return new ApiResponse(result);
            const user = result.data;
            const tokens = await AuthService.generateAuthTokens(user);
            return {
                user,
                tokens,
            };
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }
}

export default new AuthController();
