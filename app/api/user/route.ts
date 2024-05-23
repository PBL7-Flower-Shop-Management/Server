import UserController from "@/controllers/UserController";
import { auth } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/UserValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Profile:
 *        type: object
 *        required:
 *          - name
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
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Return corresponding profile
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
 *   put:
 *     summary: Edit profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Edit profile successfully
 */

export const GET = async () => {
    try {
        return await auth(async (userToken: any) => {
            return await UserController.GetProfile(userToken.user._id);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        return await auth(async (userToken: any) => {
            let body = await new Response(req.body).json();
            ({ req, body: body } = TrimRequest.all(req, null, body));
            await validate(schemas.EditProfileSchema)(null, null, body);
            return await UserController.EditProfile(body, userToken.user._id);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
