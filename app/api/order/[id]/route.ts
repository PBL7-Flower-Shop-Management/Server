import OrderController from "@/controllers/OrderController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/OrderValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: The order managing API
 */

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Return order detail
 *     tags: [Order]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return order by id
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
 *                   type: object
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *             example:
 *               status: "success"
 *               total: 1
 *               data:
 *                   _id: "6159f6a23603a45f08268eb7"
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

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetOrderDetail)(null, params);
        const { id } = params;
        return await OrderController.GetOrderDetail(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
