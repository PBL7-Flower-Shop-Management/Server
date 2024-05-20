import UserController from "@/controllers/UserController";
import { auth } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import ApiResponse from "@/utils/ApiResponse";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/UserValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/user/change-password:
 *   patch:
 *     summary: Change password by User (through profile page)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                password:
 *                  type: string
 *                  description: The user's current password.
 *                  required: true
 *                newPassword:
 *                  type: string
 *                  description: The user's new password.
 *                  required: true
 *                confirmNewPassword:
 *                  type: string
 *                  description: The user's confirm new password.
 *                  required: true
 *     responses:
 *       200:
 *         description: Change password by user successfully
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
        return await auth(async (userToken: any) => {
            let body = await new Response(req.body).json();
            ({ req, body: body } = TrimRequest.all(req, null, body));
            await validate(schemas.ChangePasswordSchema)(null, null, body);
            return await UserController.ChangePassword(
                body,
                userToken.user._id
            );
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
