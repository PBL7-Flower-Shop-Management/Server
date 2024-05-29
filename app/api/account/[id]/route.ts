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
 * /api/account/{id}:
 *   get:
 *     summary: Get account by id
 *     tags: [Account]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Account id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return account by id
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
 *   delete:
 *     summary: Delete an account
 *     tags: [Account]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Account id
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Delete account successfully
 */

export const GET = async (req: NextRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin, roleMap.Employee])(
                userToken,
                async () => {
                    ({ params: params } = TrimRequest.all(req, params));
                    await validate(schemas.GetByIdSchema)(params);
                    const { id } = params;
                    return await AccountController.GetAccountById(
                        id,
                        userToken.user.role
                    );
                }
            );
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin, roleMap.Employee])(
                userToken,
                async () => {
                    ({ params: params } = TrimRequest.all(req, params));
                    await validate(schemas.DeleteAccountSchema)(params);
                    const { id } = params;
                    return await AccountController.DeleteAccount(
                        id,
                        userToken.user
                    );
                }
            );
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
