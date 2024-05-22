import FeedbackController from "@/controllers/FeedbackController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
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
 *          orderDetailId:
 *            type: string
 *            description: The order detail id.
 *            required: true
 *          content:
 *            type: string
 *            description: The content of the feedback.
 *            required: true
 *          numberOfStars:
 *            type: number
 *            description: The total number of stars of feedback user for the product.
 *            default: 1
 *          imageVideoFiles:
 *            type: array
 *            items:
 *              type: string
 *            description: Related images or videos
 *
 *      UpdatedFeedback:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The feedback id.
 *            required: true
 *          content:
 *            type: string
 *            description: The content of the feedback.
 *            required: true
 *          numberOfStars:
 *            type: number
 *            description: The total number of stars of feedback user for the product.
 *            default: 1
 *          imageVideoFiles:
 *            type: array
 *            items:
 *              type: string
 *            description: Related images or videos
 */

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: The feedback managing API
 */

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedbacks
 *     tags: [Feedback]
 *     parameters:
 *       - name: keyword
 *         type: string
 *         in: query
 *         description: Search keyword (search by content and feedbackBy)
 *       - name: pageNumber
 *         type: integer
 *         in: query
 *         description: Page number
 *         minimum: 1
 *         default: 1
 *       - name: pageSize
 *         type: integer
 *         in: query
 *         description: Number of items per page
 *         minimum: 1
 *         default: 10
 *       - name: isExport
 *         in: query
 *         description: Export data flag
 *         schema:
 *            type: boolean
 *            enum: [true, false]
 *            default: false
 *       - name: orderBy
 *         type: string
 *         in: query
 *         description: >
 *               Fields and sort order to order by (format: <field_name>:<sort_order>, <field_name>:<sort_order>).
 *               With sort_order = 1 is ascending order and sort_order = -1 is descending order.
 *         default: numberOfStars:-1
 *     responses:
 *       200:
 *         description: Return all feedbacks
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
 *
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feedback'
 *     responses:
 *       201:
 *         description: Create feedback successfully and return feedback information
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
 *
 *   put:
 *     summary: Update a feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatedFeedback'
 *     responses:
 *       200:
 *         description: Update feedback successfully and return feedback information
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
 *
 *   patch:
 *     summary: Update number of likes of feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                _id:
 *                  type: string
 *                  description: The feedback id.
 *                  required: true
 *                isLike:
 *                  type: boolean
 *                  default: false
 *                  description: The number of likes of feedback.
 *     responses:
 *       200:
 *         description: Update number of likes successfully
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
 *
 */

export const GET = async (req: NextApiRequest) => {
    try {
        let query;
        ({ req, query: query } = TrimRequest.all(req));
        await validate(schemas.GetAllFeedbackSchema)(null, query);
        return await FeedbackController.GetAllFeedback(query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const POST = async (req: NextApiRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                let body = await new Response(req.body).json();
                ({ req, body: body } = TrimRequest.all(req, null, body));
                await validate(schemas.CreateFeedbackSchema)(null, null, body);
                body.createdBy = userToken.user.username;
                return await FeedbackController.CreateFeedback(body);
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const PUT = async (req: NextApiRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                let body = await new Response(req.body).json();
                ({ req, body: body } = TrimRequest.all(req, null, body));
                await validate(schemas.UpdateFeedbackSchema)(null, null, body);
                body.updatedBy = userToken.user.username;
                return await FeedbackController.UpdateFeedback(body);
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const PATCH = async (req: NextApiRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                let body = await new Response(req.body).json();
                ({ req, body: body } = TrimRequest.all(req, null, body));
                await validate(schemas.UpdateFeedbackLikeSchema)(
                    null,
                    null,
                    body
                );
                body.updatedBy = userToken.user.username;
                return await FeedbackController.UpdateFeedbackLike(
                    body,
                    userToken.user._id
                );
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
