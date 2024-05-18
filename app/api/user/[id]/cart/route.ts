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
 *      Cart:
 *        type: object
 *        properties:
 *          flowerId:
 *            type: string
 *            description: The unique identifier of the flower.
 *          name:
 *            type: string
 *            description: The name of the flower.
 *          numberOfFlowers:
 *            type: integer
 *            description: The quantity of the flower available.
 *          unitPrice:
 *            type: number
 *            description: The unit price for the flower.
 *          discount:
 *            type: integer
 *            description: The discount percentage for the flower.
 *          image:
 *            type: string
 *            description: The URL of the image related to the flower.
 *          remainAmount:
 *            type: integer
 *            description: The remaining quantity of the flower.
 *          selected:
 *            type: boolean
 *            description: Indicates whether the flower is selected or not.
 */

/**
 * @swagger
 * /api/user/{id}/cart:
 *   get:
 *     summary: Return cart by user id
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
 *         description: Cart by id
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
 *                   $ref: '#/components/schemas/Cart'
 *             example:
 *               status: success
 *               total: 1
 *               data:
 *                 - flowerId: "6630456bfc13ae1b64a24111"
 *                   name: "Lobster - Tail 6 Oz"
 *                   numberOfFlowers: 12
 *                   unitPrice: 234
 *                   discount: 42
 *                   image: "https://happyflower.vn/app/uploads/2019/12/RoseMixBaby-1024x1024.jpg"
 *                   remainAmount: 190
 *                   selected: true
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetCartByUserId)(params);
        const { id } = params;
        return await UserController.GetCartByUserId(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
