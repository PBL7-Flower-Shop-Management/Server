import CartController from "@/controllers/CartController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/CartValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/user/cart/{id}:
 *   delete:
 *     summary: Delete a cart
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Flower id
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Delete cart successfully
 */

export const DELETE = async (req: NextApiRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                ({ params: params } = TrimRequest.all(req, params));
                await validate(schemas.DeleteCartSchema)(params);
                const { id } = params;
                return await CartController.DeleteCart(id, userToken.user._id);
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
