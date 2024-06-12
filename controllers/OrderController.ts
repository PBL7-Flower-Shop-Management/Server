import OrderService from "@/services/OrderService";

class OrderController {
    async GetAllOrder(query: any) {
        try {
            return await OrderService.GetAllOrder(query);
        } catch (error) {
            throw error;
        }
    }

    async CreateOrder(body: any, user: any) {
        try {
            return await OrderService.CreateOrder(body, user);
        } catch (error) {
            throw error;
        }
    }

    async UpdateOrder(body: any, user: any) {
        try {
            return await OrderService.UpdateOrder(body, user);
        } catch (error) {
            throw error;
        }
    }

    async GetOrderDetail(orderId: string, user: any) {
        try {
            return await OrderService.GetOrderDetail(orderId, user);
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

const orderController = new OrderController();
export default orderController;
