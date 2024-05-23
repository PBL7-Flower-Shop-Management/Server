import FlowerController from "@/controllers/FlowerController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FlowerValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/flower/decoration:
 *   get:
 *     summary: Return the list of all the decorative flowers
 *     tags: [Flower]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Limit of decorative flower lists
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: The list of the decorative flowers
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
        await validate(schemas.GetDecorativeFlowerSchema)(null, query);
        return await FlowerController.GetDecorationFlower(query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
