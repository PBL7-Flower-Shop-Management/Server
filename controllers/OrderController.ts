import OrderService from "@/services/OrderService";
import ApiResponse from "@/utils/ApiResponse";

class OrderController {
    async GetOrderDetail(orderId: string) {
        try {
            return await OrderService.GetOrderDetail(orderId);
        } catch (error: any) {
            return new ApiResponse({
                status: 500,
                message: error.message ?? error,
            });
        }
    }
}

export default new OrderController();
