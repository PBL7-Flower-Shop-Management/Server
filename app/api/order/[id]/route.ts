import OrderController from "@/controllers/OrderController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/OrderValidation";
import { NextRequest } from "next/server";

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
 *
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order id
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Delete order successfully
 */

export const GET = async (req: NextRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            ({ params: params } = TrimRequest.all(req, params));
            await validate(schemas.GetOrderDetailSchema)(params);
            const { id } = params;
            return await OrderController.GetOrderDetail(id, userToken.user);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin, roleMap.Employee])(
                userToken,
                async () => {
                    ({ params: params } = TrimRequest.all(req, params));
                    await validate(schemas.DeleteOrderSchema)(params);
                    const { id } = params;
                    return await OrderController.DeleteOrder(
                        id,
                        userToken.user.username
                    );
                }
            );
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
