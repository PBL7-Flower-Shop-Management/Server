import IdentificationService from "@/services/IdentificationService";

class IdentificationController {
    async ClassifyFlower(flowerImage: any, user: any | null) {
        try {
            return await IdentificationService.ClassifyFlower(
                flowerImage,
                user
            );
        } catch (error) {
            throw error;
        }
    }
}

const identificationController = new IdentificationController();
export default identificationController;
