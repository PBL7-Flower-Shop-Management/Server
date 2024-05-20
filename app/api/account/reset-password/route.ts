import AccountController from "@/controllers/AccountController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AccountValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/account/reset-password:
 *   patch:
 *     summary: Reset password by User
 *     tags: [Account]
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
 *                  description: The account email.
 *                  required: true
 *                password:
 *                  type: string
 *                  description: The account password.
 *                  required: true
 *                confirmPassword:
 *                  type: string
 *                  description: The account confirm password.
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
        return await AccountController.ResetPassword(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
