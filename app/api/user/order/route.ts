import UserController from "@/controllers/UserController";
import { auth } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 */

/**
 * @swagger
 * /api/user/order:
 *   get:
 *     summary: Return user's order
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Return user's order successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                 total:
 *                   type: integer
 *                   description: The number of order results.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *             example:
 *               status: "success"
 *               total: 1
 *               data:
 *                 - _id: "6159f6a23603a45f08268eb7"
 *                   orderDate: "2024-04-30T12:00:00Z"
 *                   shipDate: "2024-04-30T12:00:00Z"
 *                   shipAddress: "123 Main St"
 *                   shipPrice: 10
 *                   discount: 5
 *                   totalPrice: 100
 *                   status: "Processing"
 *                   paymentMethod: "Credit Card"
 *                   note: "Please deliver before 5 PM"
 *                   orderDetails:
 *                     - _id: "6630456bfc13ae1b64a24116"
 *                       name: "Cheese - Brie, Triple Creme"
 *                       unitPrice: 25
 *                       discount: 3
 *                       numberOfFlowers: 10
 *                       image: "https://th.bing.com/th/id/OIP.HSM7Z15cDV86T7YjP14MvQHaFF?pid=ImgDet&w=474&h=325&rs=1"
 */

export const GET = async () => {
    try {
        return await auth(async (userToken: any) => {
            return await UserController.GetOrderByUserId(userToken.user._id);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
