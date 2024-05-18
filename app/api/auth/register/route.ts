import AuthController from "@/controllers/AuthController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import ApiResponse from "@/utils/ApiResponse";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AuthValidation";
import { NextApiRequest } from "next";

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
 *      User:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: Full name of the user.
 *          citizenId:
 *            type: string
 *            description: Citizenship identification number.
 *          email:
 *            type: string
 *            description: Email address of the user.
 *          phoneNumber:
 *            type: string
 *            description: Phone number of the user.
 *          role:
 *            type: string
 *            description: Role of the user within the system.
 *          avatar:
 *            type: string
 *            description: URL pointing to the user's avatar image.
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: Timestamp of user creation.
 *          createdBy:
 *            type: string
 *            description: Identifier for who created the user.
 *          isDeleted:
 *            type: boolean
 *            description: Flag indicating if the user is marked as deleted.
 *          _id:
 *            type: string
 *            description: Database ID of the user.
 *          __v:
 *            type: integer
 *            description: Version number of the user model.
 *      TokenInfo:
 *        type: object
 *        properties:
 *          accessToken:
 *            type: string
 *            description: JWT access token.
 *          accessTokenExpiresAt:
 *            type: string
 *            format: date-time
 *            description: Expiry date and time of the access token.
 *          refreshToken:
 *            type: string
 *            description: JWT refresh token.
 *          refreshTokenExpireAt:
 *            type: string
 *            format: date-time
 *            description: Expiry date and time of the refresh token.
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
 *     summary: Registers a new user and returns account information including tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Registration successful and user data returned.
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
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       $ref: '#/components/schemas/TokenInfo'
 *               example:
 *                 status: "success"
 *                 total: 1
 *                 data:
 *                   user:
 *                     name: "string"
 *                     citizenId: "53454353"
 *                     email: "strireng@gmail.com"
 *                     phoneNumber: "5345435"
 *                     role: "Customer"
 *                     avatar: "string"
 *                     createdAt: "2024-05-11T07:58:52.792Z"
 *                     createdBy: "System"
 *                     isDeleted: false
 *                     _id: "663f253c26cc6a0b75bfcad7"
 *                     __v: 0
 *                   token:
 *                     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjYzZjI1M2MyNmNjNmEwYjc1YmZjYWQ3IiwibG9naW5fdGltZSI6IjIwMjQtMDUtMTFUMDc6NTg6NTIuODcwWiIsImV4cCI6MTcxNTQxNjEzMiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxNTQxNDMzMn0.HpwUQP7VgYjAiDoNh7sA9U8MN6MnqHq0u2JCVWj4CGE"
 *                     accessTokenExpiresAt: "2024-05-11T08:28:52.870Z"
 *                     refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjYzZjI1M2MyNmNjNmEwYjc1YmZjYWQ3IiwibG9naW5fdGltZSI6IjIwMjQtMDUtMTFUMDc6NTg6NTIuODcwWiIsImV4cCI6MTcxNTY3MzUzMiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MTU0MTQzMzJ9.IU2KPPNSSpu0cOSrGjIaaqIxalRoIvTZuN0fzxV9Kk0"
 *                     refreshTokenExpireAt: "2024-05-14T07:58:52.870Z"
 */

export const POST = async (req: NextApiRequest) => {
    try {
        let body = await new Response(req.body).json();
        ({ req, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.RegisterSchema)(null, null, body);
        return await AuthController.Register(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
