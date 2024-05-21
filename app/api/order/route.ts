import OrderController from "@/controllers/OrderController";
import { auth } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/OrderValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Order:
 *        type: object
 *        properties:
 *          orderUserId:
 *            type: string
 *            description: The account id of order user.
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
 *          discount:
 *            type: number
 *            format: float
 *            description: The discount applied to the order.
 *          shipPrice:
 *            type: number
 *            format: float
 *            description: The shipping price of the order.
 *          totalPrice:
 *            type: number
 *            format: float
 *            description: The total price of the order.
 *          paymentMethod:
 *            type: string
 *            description: The payment method used for the order.
 *          status:
 *            type: string
 *            description: The status of the order.
 *            default: Processing
 *            enum:
 *             - "Pending payment processing"
 *             - "Processing"
 *             - "Shipped"
 *             - "Delivered"
 *             - "Cancelled"
 *          note:
 *            type: string
 *            description: Any additional notes for the order.
 *          orderDetails:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderDetail'
 *            description: A list of order's products
 *
 *      OrderDetail:
 *        type: object
 *        properties:
 *          flowerId:
 *            type: string
 *            description: The ID of the flower.
 *          numberOfFlowers:
 *            type: integer
 *            description: The number of flowers ordered.
 *
 *      UpdatedOrder:
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
 *          discount:
 *            type: number
 *            format: float
 *            description: The discount applied to the order.
 *          shipPrice:
 *            type: number
 *            format: float
 *            description: The shipping price of the order.
 *          totalPrice:
 *            type: number
 *            format: float
 *            description: The total price of the order.
 *          paymentMethod:
 *            type: string
 *            description: The payment method used for the order.
 *          status:
 *            type: string
 *            description: The status of the order.
 *            default: Processing
 *            enum:
 *             - "Pending payment processing"
 *             - "Processing"
 *             - "Shipped"
 *             - "Delivered"
 *             - "Cancelled"
 *          note:
 *            type: string
 *            description: Any additional notes for the order.
 *          orderDetails:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/OrderDetail'
 *            description: A list of order's products
 */

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: The order managing API
 */

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     parameters:
 *       - name: keyword
 *         type: string
 *         in: query
 *         description: Search keyword (search by username, address, paymentMethod and status)
 *       - name: pageNumber
 *         type: integer
 *         in: query
 *         description: Page number
 *         minimum: 1
 *         default: 1
 *       - name: pageSize
 *         type: integer
 *         in: query
 *         description: Number of items per page
 *         minimum: 1
 *         default: 10
 *       - name: isExport
 *         in: query
 *         description: Export data flag
 *         schema:
 *            type: boolean
 *            enum: [true, false]
 *            default: false
 *       - name: orderBy
 *         type: string
 *         in: query
 *         description: >
 *               Fields and sort order to order by (format: <field_name>:<sort_order>, <field_name>:<sort_order>).
 *               With sort_order = 1 is ascending order and sort_order = -1 is descending order.
 *         default: username:1
 *     responses:
 *       200:
 *         description: Return all orders
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
 *                   description: The data length.
 *                 data:
 *                   type: object
 *
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Create order successfully and return order information
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
 *                   description: The data length.
 *                 data:
 *                   type: object
 *
 *   put:
 *     summary: Update a order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatedOrder'
 *     responses:
 *       200:
 *         description: Update order successfully and return order information
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
 *                   description: The data length.
 *                 data:
 *                   type: object
 */

export const GET = async (req: NextApiRequest) => {
    try {
        return await auth(async () => {
            let query;
            ({ req, query: query } = TrimRequest.all(req));
            await validate(schemas.GetAllOrderSchema)(null, query);
            return await OrderController.GetAllOrder(query);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const POST = async (req: NextApiRequest) => {
    try {
        return await auth(async (userToken: any) => {
            let body = await new Response(req.body).json();
            ({ req, body: body } = TrimRequest.all(req, null, body));
            await validate(schemas.CreateOrderSchema)(null, null, body);
            body.createdBy = userToken.user.username;
            return await OrderController.CreateOrder(body);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const PUT = async (req: NextApiRequest) => {
    try {
        return await auth(async (userToken: any) => {
            let body = await new Response(req.body).json();
            ({ req, body: body } = TrimRequest.all(req, null, body));
            await validate(schemas.UpdateOrderSchema)(null, null, body);
            body.updatedBy = userToken.user.username;
            return await OrderController.UpdateOrder(body);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
