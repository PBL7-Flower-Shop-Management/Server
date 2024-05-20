import UserController from "@/controllers/UserController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/UserValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/user/reset-password:
 *   patch:
 *     summary: Reset password by User
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
 *                  example: example@gmail.com
 *                  description: The user email.
 *                  required: true
 *                password:
 *                  type: string
 *                  description: The user password.
 *                  required: true
 *                confirmPassword:
 *                  type: string
 *                  description: The user confirm password.
 *                  required: true
 *                token:
 *                  type: string
 *                  description: The reset password token.
 *                  required: true
 *     responses:
 *       200:
 *         description: Reset password by user successfully
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
        await validate(schemas.ResetPasswordSchema)(null, null, body);
        return await UserController.ResetPassword(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
