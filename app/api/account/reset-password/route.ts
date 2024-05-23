import AccountController from "@/controllers/AccountController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AccountValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/account/reset-password:
 *   patch:
 *     summary: Reset password by Admin
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                _id:
 *                  type: string
 *                  description: The account id.
 *                  required: true
 *     responses:
 *       200:
 *         description: Reset password and send new password to account's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 */

export const PATCH = async (req: NextRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin])(userToken, async () => {
                let body = await new Response(req.body).json();
                ({ req, body: body } = TrimRequest.all(req, null, body));
                await validate(schemas.AdminResetPasswordSchema)(
                    null,
                    null,
                    body
                );
                const { _id: id } = body;
                return await AccountController.AdminResetPassword(id);
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
