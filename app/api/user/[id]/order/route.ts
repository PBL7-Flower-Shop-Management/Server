import UserController from "@/controllers/UserController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/UserValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Order:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The ID of the order.
 *          orderDate:
 *            type: string
 *            format: date-time
 *            description: The date when the order was placed.
 *          shipDate:
 *            type: string
 *            format: date-time
 *            description: The date when the product was shipped.
 *          shipAddress:
 *            type: string
 *            description: The shipping address of the order.
 *          shipPrice:
 *            type: number
 *            format: float
 *            description: The shipping price of the order.
 *          discount:
 *            type: number
 *            format: float
 *            description: The discount applied to the order.
 *          totalPrice:
 *            type: number
 *            format: float
 *            description: The total price of the order.
 *          status:
 *            type: string
 *            description: The status of the order.
 *          paymentMethod:
 *            type: string
 *            description: The payment method used for the order.
 *          note:
 *            type: string
 *            description: Any additional notes for the order.
 *          orderDetails:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderDetail'
 *            description: A list of order details.
 *      OrderDetail:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The ID of the order detail.
 *          name:
 *            type: string
 *            description: The name of the ordered item.
 *          unitPrice:
 *            type: number
 *            format: float
 *            description: The unit price of the ordered item.
 *          discount:
 *            type: number
 *            format: integer
 *            description: The discount of the ordered item.
 *          numberOfFlowers:
 *            type: integer
 *            description: The number of flowers ordered.
 *          image:
 *            type: string
 *            description: The URL of the image associated with the ordered item.
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 */

/**
 * @swagger
 * /api/user/{id}/order:
 *   get:
 *     summary: Return order by user id
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id
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
 *                     - _id: "663052f124e3cdd3e58c1e72"
 *                       name: "Cheese - Brie, Triple Creme"
 *                       unitPrice: 25
 *                       discount: 3
 *                       numberOfFlowers: 10
 *                       image: "https://th.bing.com/th/id/OIP.HSM7Z15cDV86T7YjP14MvQHaFF?pid=ImgDet&w=474&h=325&rs=1"
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetOrderByUserId)(null, params);
        const { id } = params;
        return await UserController.GetOrderByUserId(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
