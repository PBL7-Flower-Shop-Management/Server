import AccountController from "@/controllers/AccountController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/AccountValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Account:
 *        type: object
 *        required:
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
 *          isActived:
 *            type: boolean
 *            description: The account status
 *            default: false
 *            enum:
 *             - true
 *             - false
 *          role:
 *            type: string
 *            description: The role of account
 *            default: Customer
 *            enum:
 *             - "Admin"
 *             - "Employee"
 *             - "Customer"
 */

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: The account managing API
 */

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: Create an new account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Create new successful user and return user information
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
        await validate(schemas.CreateAccountSchema)(null, null, body);
        return await AccountController.CreateAccount(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
