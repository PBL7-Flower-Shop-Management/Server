import AuthController from "@/controllers/AuthController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import ApiResponse from "@/utils/ApiResponse";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AuthValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Register:
 *        type: object
 *        required:
 *          - username
 *          - password
 *          - email
 *        properties:
 *          name:
 *            type: string
 *            description: The full name of the user.
 *          citizenId:
 *            type: string
 *            description: The citizenship identification number.
 *          email:
 *            type: string
 *            description: The email address of the user.
 *          phoneNumber:
 *            type: string
 *            description: The contact phone number of the user.
 *          avatar:
 *            type: string
 *            description: URL pointing to the user's avatar image.
 *          username:
 *            type: string
 *            description: The username of the user.
 *          password:
 *            type: string
 *            format: password
 *            description: The password of the user.
 *
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registers a new user and return result
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Register successfully
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

export const POST = async (req: NextRequest) => {
    try {
        let body = await new Response(req.body).json();
        ({ req, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.RegisterSchema)(null, null, body);
        return await AuthController.Register(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
