import UserController from "@/controllers/UserController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/UserValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/user/forgot-password:
 *   patch:
 *     summary: Forgot password by User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                email:
 *                  type: string
 *                  description: The user email.
 *                  required: true
 *                resetPasswordPageUrl:
 *                  type: string
 *                  format: url
 *                  example: https://example.com/reset-password
 *                  description: URL to the reset password page
 *
 *     responses:
 *       200:
 *         description: Sent Forgot password token to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 */

export const PATCH = async (req: NextApiRequest) => {
    try {
        let body = await new Response(req.body).json();
        ({ req, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.ForgotPasswordSchema)(null, null, body);
        return await UserController.ForgotPassword(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
