import AccountController from "@/controllers/AccountController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AccountValidation";
import { NextApiRequest } from "next";

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

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetByIdSchema)(params);
        const { id } = params;
        return await AccountController.GetAccountById(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const DELETE = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.DeleteAccountSchema)(params);
        const { id } = params;
        return await AccountController.DeleteAccount(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
