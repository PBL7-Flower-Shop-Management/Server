import FlowerController from "@/controllers/FlowerController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FlowerValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Feedback:
 *        type: object
 *        properties:
 *          content:
 *            type: string
 *            description: The content of the feedback.
 *          numberOfStars:
 *            type: integer
 *            description: The number of stars given in the feedback.
 *          numberOfLikes:
 *            type: integer
 *            description: The number of likes received by the feedback.
 *          feedbackBy:
 *            type: string
 *            description: The user who provided the feedback.
 *          commentDate:
 *            type: string
 *            format: date-time
 *            description: The timestamp when the feedback was created.
 *          imageVideoFiles:
 *            type: array
 *            items:
 *              type: string
 *            description: The URLs of image or video files related to the feedback.
 */

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
 *                   $ref: '#/components/schemas/Feedback'
 *             example:
 *               status: success
 *               total: 1
 *               data:
 *               - content: "Great product!"
 *                 numberOfStars: 5
 *                 numberOfLikes: 10
 *                 feedbackBy: "Dang Hoan"
 *                 commentDate: "2023-12-01T00:00:00.000Z"
 *                 imageVideoFiles:
 *                   - "https://example.com/image1.jpg"
 *                   - "https://example.com/image2.jpg"
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetFeedbackOfFlowerSchema)(null, params);
        const { id } = params;
        return await FlowerController.GetFeedbackOfFlower(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
