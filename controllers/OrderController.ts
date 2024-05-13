import OrderService from "@/services/OrderService";

class OrderController {
    async GetOrderDetail(orderId: string) {
        try {
            return await OrderService.GetOrderDetail(orderId);
        } catch (error: any) {
            throw error;
        }
    }
}

export default new OrderController();
