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
 *      FavouriteFlower:
 *        type: object
 *        properties:
 *          flowerId:
 *            type: string
 *            description: The unique identifier of the flower.
 *          name:
 *            type: string
 *            description: The name of the flower.
 *          stars:
 *            type: number
 *            format: float
 *            description: The average star rating of the flower.
 *          unitPrice:
 *            type: number
 *            description: The unit price for the flower.
 *          status:
 *            type: string
 *            description: The availability status of the flower.
 *          discount:
 *            type: integer
 *            description: The discount percentage for the flower.
 *          image:
 *            type: string
 *            description: The URL of the image related to the flower.

 * @swagger
 * /api/user/{id}/favourite-flower:
 *   get:
 *     summary: Return favourite flowers by user id
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
 *         description: Favourite flowers by id
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
 *                   description: The total number of favourite flowers of user.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FavouriteFlower'
 *             example:
 *               status: "success"
 *               total: 1
 *               data:
 *                 - flowerId: "6630456bfc13ae1b64a24111"
 *                   name: "Lobster - Tail 6 Oz"
 *                   stars: 3.6
 *                   unitPrice: 234
 *                   status: "Available"
 *                   discount: 42
 *                   image: "https://happyflower.vn/app/uploads/2019/12/RoseMixBaby-1024x1024.jpg"
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetFavouriteFlowerByUserId)(null, params);
        const { id } = params;
        return await UserController.GetFavouriteFlowerByUserId(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
