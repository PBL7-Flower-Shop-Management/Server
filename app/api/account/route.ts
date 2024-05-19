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
 *
 *      UpdatedAccount:
 *        type: object
 *        required:
 *          - _id
 *          - name
 *          - email
 *        properties:
 *          _id:
 *            type: string
 *            description: The account id.
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
 *   get:
 *     summary: Get all account
 *     tags: [Account]
 *     parameters:
 *       - name: keyword
 *         type: string
 *         in: query
 *         description: Search keyword (search by role, name, email and username)
 *       - name: pageNumber
 *         type: integer
 *         in: query
 *         description: Page number
 *         minimum: 1
 *         default: 1
 *       - name: pageSize
 *         type: integer
 *         in: query
 *         description: Number of items per page
 *         minimum: 1
 *         default: 10
 *       - name: isExport
 *         in: query
 *         description: Export data flag
 *         schema:
 *            type: boolean
 *            enum: [true, false]
 *            default: false
 *       - name: orderBy
 *         type: string
 *         in: query
 *         description: Field to order by (Fields must be separated by spaces)
 *         default: username
 *     responses:
 *       200:
 *         description: Return all accounts
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
 *       201:
 *         description: Create account successfully and return account information
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
 *     summary: Update an account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatedAccount'
 *     responses:
 *       200:
 *         description: Update account successfully and return account information
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
 *   patch:
 *     summary: Lock/unlock an account
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
 *                isActived:
 *                  type: boolean
 *                  description: The account status
 *                  default: false
 *
 *     responses:
 *       200:
 *         description: Lock/unlock successful account and return result
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

export const GET = async (req: NextApiRequest) => {
    try {
        let query;
        ({ req, query: query } = TrimRequest.all(req));
        await validate(schemas.GetAllAccountSchema)(null, query);
        return await AccountController.GetAllAccount(query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

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

export const PUT = async (req: NextApiRequest) => {
    try {
        let body = await new Response(req.body).json();
        ({ req, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.UpdateAccountSchema)(null, null, body);
        return await AccountController.UpdateAccount(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const PATCH = async (req: NextApiRequest) => {
    try {
        let body = await new Response(req.body).json();
        ({ req, body: body } = TrimRequest.all(req, null, body));
        await validate(schemas.LockUnLockAccountSchema)(null, null, body);
        return await AccountController.LockUnLockAccount(body);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
