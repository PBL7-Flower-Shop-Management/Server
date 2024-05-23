import FeedbackController from "@/controllers/FeedbackController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FeedbackValidation";
import { NextRequest } from "next/server";

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
 */

export const GET = async (req: NextRequest) => {
    try {
        let query;
        ({ req, query: query } = TrimRequest.all(req));
        await validate(schemas.GetRecentFeedbackSchema)(null, query);
        return await FeedbackController.GetRecentFeedback(query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
