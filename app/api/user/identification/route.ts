import UserController from "@/controllers/UserController";
import { auth } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import { NextRequest } from "next/server";

/**
 * @swagger
 *  components:
 *    schemas:
 *      IdentificationResult:
 *        type: object
 *        properties:
 *          flowerName:
 *            type: string
 *            description: The name of the identified flower.
 *          accuracy:
 *            type: number
 *            format: float
 *            description: The accuracy of the flower identification.
 *          image:
 *            type: string
 *            description: The URL of the image associated with the identified flower.
 *      IdentificationHistory:
 *        type: object
 *        properties:
 *          date:
 *            type: string
 *            format: date-time
 *            description: The date when the identification was processed.
 *          inputImage:
 *            type: string
 *            description: The URL of the input image used for identification.
 *          results:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/IdentificationResult'
 *            description: A list of identification results.
 */

/**
 * @swagger
 * tags:
 *   name: Identification
 *   description: The identification managing API
 */

/**
 * @swagger
 * /api/user/identification:
 *   get:
 *     summary: Return identification histories of user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Identification histories of user
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
 *                   description: The number of identification results.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IdentificationHistory'
 *             example:
 *               status: "success"
 *               total: 1
 *               data:
 *                 - date: "2023-11-01T00:00:00Z"
 *                   inputImage: "https://i.ytimg.com/vi/KxgkeWdEoA8/maxresdefault.jpg"
 *                   results:
 *                     - flowerName: "Hoa lan"
 *                       accuracy: 0.8
 *                       image: "https://th.bing.com/th/id/OIP.1Ge95dy85jSACr6fUFPx3AHaEW?rs=1&pid=ImgDetMain"
 *                     - flowerName: "Hoa loa kèn"
 *                       accuracy: 0.2
 *                       image: "https://flowershop.com.vn/wp-content/uploads/2020/09/y-nghia-hoa-loa-ken-8.jpg"
 */

export const GET = async () => {
    try {
        return await auth(async (userToken: any) => {
            return await UserController.GetIdentificationHistory(
                userToken.user._id
            );
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
