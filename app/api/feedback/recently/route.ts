import FeedbackController from "@/controllers/FeedbackController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FeedbackValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Feedback:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier of the flower.
 *          content:
 *            type: string
 *            description: The content of the feedback.
 *          numberOfStars:
 *            type: number
 *            description: The total number of stars of feedback user for the product.
 *          feedbackBy:
 *            type: string
 *            description: Feedback user name
 */

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: The feedback managing API
 */

/**
 * @swagger
 * /api/feedback/recently:
 *   get:
 *     summary: Return the list of all the recent feedback
 *     tags: [Feedback]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Limit of feedback lists
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: The list of the feedbacks
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
 *                     $ref: '#/components/schemas/Feedback'
 *               example:
 *                 status: success
 *                 total: 1
 *                 data:
 *                   - _id: "6630456bfc13ae1b64a24111"
 *                     content: "Sản phẩm okela!"
 *                     numberOfStars: 4.5
 *                     feedbackBy: "Nguyễn Thế Đăng Hoan"
 */

export const GET = async (req: NextApiRequest) => {
    try {
        let query;
        ({ req, query: query } = TrimRequest.all(req));
        await validate(schemas.GetRecentFeedbackSchema)(null, query);
        return await FeedbackController.GetRecentFeedback(query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
