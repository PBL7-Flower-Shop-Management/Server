import AuthController from "@/controllers/AuthController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AuthValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The expire token
 *                 required: true
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *                 required: true
 *     responses:
 *       200:
 *         description: Refresh token successfully and return new token
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
 */

export const POST = async (req: NextApiRequest) => {
    try {
        let body = await new Response(req.body).json();
        ({ req, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.RefreshTokenSchema)(null, null, body);
        return await AuthController.RefreshToken(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
