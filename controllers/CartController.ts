import CartService from "@/services/CartService";

class CartController {
    async CreateCart(body: any, userId: string) {
        try {
            return await CartService.CreateCart(body, userId);
        } catch (error) {
            throw error;
        }
    }

    async UpdateCart(body: any, userId: string) {
        try {
            return await CartService.UpdateCart(body, userId);
        } catch (error) {
            throw error;
        }
    }

    async DeleteCart(flowerId: string, userId: string) {
        try {
            return await CartService.DeleteCart(flowerId, userId);
        } catch (error) {
            throw error;
        }
    }

    async DeleteCarts(body: any, userId: string) {
        try {
            return await CartService.DeleteCarts(body, userId);
        } catch (error) {
            throw error;
        }
    }
}

const cartController = new CartController();
export default cartController;
