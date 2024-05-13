import IdentificationService from "@/services/IdentificationService";

class IdentificationController {
    async GetIdentificationHistoryByUserId(userId: string) {
        try {
            return await IdentificationService.GetIdentificationHistoryByUserId(
                userId
            );
        } catch (error: any) {
            throw error;
        }
    }
}

export default new IdentificationController();
