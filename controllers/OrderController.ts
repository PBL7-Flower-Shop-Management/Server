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

    async DeleteOrder(id: string, username: string) {
        try {
            return await OrderService.DeleteOrder(id, username);
        } catch (error) {
            throw error;
        }
    }

    async DeleteOrders(body: any) {
        try {
            return await OrderService.DeleteOrders(body);
        } catch (error) {
            throw error;
        }
    }
}

export default new OrderController();
