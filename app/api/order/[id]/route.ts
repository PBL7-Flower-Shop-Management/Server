import OrderController from "@/controllers/OrderController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/OrderValidation";
import { NextApiRequest } from "next";

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
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin, roleMap.Employee])(
                userToken,
                async () => {
                    ({ params: params } = TrimRequest.all(req, params));
                    await validate(schemas.GetOrderDetail)(params);
                    const { id } = params;
                    return await OrderController.GetOrderDetail(id);
                }
            );
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
