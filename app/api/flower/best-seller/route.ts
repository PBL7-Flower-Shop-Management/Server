import FlowerController from "@/controllers/FlowerController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FlowerValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 *  components:
 *    schemas:
 *      ShortendFlower:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier of the flower.
 *          name:
 *            type: string
 *            description: The name of the flower.
 *          stars:
 *            type: number
 *            description: The total number of stars received by the flower.
 *          unitPrice:
 *            type: number
 *            description: The unit price for the flower
 *          discount:
 *            type: integer
 *            description: The discount percentage for the flower.
 *          image:
 *            type: string
 *            description: The URLs of image or video file related to the flower.
 *          status:
 *            type: string
 *            description: The status of the flower.
 */

/**
 * @swagger
 * /api/flower/best-seller:
 *   get:
 *     summary: Return the list of all the best seller flowers
 *     tags: [Flower]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Limit of best seller flower lists
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: The list of the best seller flowers
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShortendFlower'
 *               example:
 *                 status: success
 *                 total: 1
 *                 data:
 *                   - _id: "6630456bfc13ae1b64a24222"
 *                     name: "Fenngreek Seed"
 *                     unitPrice: 341
 *                     discount: 34
 *                     image:
 *                         "https://th.bing.com/th/id/R.f852bb117e8734ca0d7507781d76ad2e?rik=VtL1rYEsidWJsA&pid=ImgRaw&r=0"
 *                     status: "Available"
 *                     stars: 0.8
 */

export const GET = async (req: NextRequest) => {
    try {
        let query;
        ({ req, query: query } = TrimRequest.all(req));
        await validate(schemas.GetBestSellerFlowerSchema)(null, query);
        return await FlowerController.GetBestSellerFlower(query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
