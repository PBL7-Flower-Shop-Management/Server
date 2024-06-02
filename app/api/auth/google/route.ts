import AuthController from "@/controllers/AuthController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AuthValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Login:
 *        type: object
 *        required:
 *          - username
 *          - password
 *        properties:
 *          username:
 *            type: string
 *            description: The username of the user.
 *          password:
 *            type: string
 *            format: password
 *            description: The password of the user.
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login by google and returns account information including tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 required: true
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *                 required: true
 *     responses:
 *       200:
 *         description: Login successful and user data returned.
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

export const POST = async (req: NextRequest) => {
    try {
        let body = await new Response(req.body).json();
        ({ req, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.GoogleLoginSchema)(null, null, body);
        return await AuthController.GoogleLogin(body.accessToken);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
