import UserController from "@/controllers/UserController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import { roleMap } from "@/utils/constants";

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
 * /api/user/favourite-flower:
 *   get:
 *     summary: Return favourite flowers of user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Favourite flowers of user
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

export const GET = async () => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                return await UserController.GetFavouriteFlowerByUserId(
                    userToken.user._id
                );
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
