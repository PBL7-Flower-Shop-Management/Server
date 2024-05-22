import FlowerController from "@/controllers/FlowerController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FlowerValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/flower/{id}/feedback:
 *   get:
 *     summary: Return feedbacks of flower
 *     tags: [Flower]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Flower id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback by flower id
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
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetFeedbackOfFlowerSchema)(params);
        const { id } = params;
        return await FlowerController.GetFeedbackOfFlower(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
