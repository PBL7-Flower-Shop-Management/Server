import AuthController from "@/controllers/AuthController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AuthValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Login:
 *        type: object
 *        properties:
 *          username:
 *            type: string
 *            description: The unique identifier of the flower.
 *          password:
 *            type: string
 *            description: The content of the feedback.
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Return the account information
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 required: true
 *                 description: The password of the user.
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

export const POST = async (req: NextApiRequest) => {
    try {
        let query,
            body = await new Response(req.body).json();
        ({ req, query: query, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.LoginSchema)(req, null, query, body);
        return await AuthController.Login(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
