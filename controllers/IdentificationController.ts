import IdentificationService from "@/services/IdentificationService";
import ApiResponse from "@/utils/ApiResponse";

class IdentificationController {
    async GetIdentificationHistoryByUserId(userId: string) {
        try {
            return await IdentificationService.GetIdentificationHistoryByUserId(
                userId
            );
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }
}

export default new IdentificationController();
