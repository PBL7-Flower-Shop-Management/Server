import OrderService from "@/services/OrderService";

class OrderController {
    async GetAllOrder(query: any) {
        try {
            return await OrderService.GetAllOrder(query);
        } catch (error) {
            throw error;
        }
    }

    async CreateOrder(body: any) {
        try {
            return await OrderService.CreateOrder(body);
        } catch (error) {
            throw error;
        }
    }

    async UpdateOrder(body: any) {
        try {
            return await OrderService.UpdateOrder(body);
        } catch (error) {
            throw error;
        }
    }

    async GetOrderDetail(orderId: string) {
        try {
            return await OrderService.GetOrderDetail(orderId);
        } catch (error: any) {
            throw error;
        }
    }
}

export default new OrderController();
