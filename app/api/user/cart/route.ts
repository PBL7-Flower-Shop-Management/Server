import CartController from "@/controllers/CartController";
import UserController from "@/controllers/UserController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/CartValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Cart:
 *        type: object
 *        properties:
 *          flowerId:
 *            type: string
 *            description: The unique identifier of the flower.
 *          numberOfFlowers:
 *            type: integer
 *            description: The quantity of the flower available.
 *            default: 1
 *
 *
 *      UpdatedCart:
 *        type: object
 *        properties:
 *          flowerId:
 *            type: string
 *            description: The unique identifier of the flower.
 *          numberOfFlowers:
 *            type: integer
 *            description: The quantity of the flower available.
 *            default: 1
 *          selected:
 *            type: boolean
 *            description: Indicate whether flower is selected
 *            default: false
 */

/**
 * @swagger
 * /api/user/cart:
 *   get:
 *     summary: Return user's cart
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Return user's cart successfully
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
 *
 *   post:
 *     summary: Create a new cart
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Create cart successfully and return cart information
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
 *     summary: Update a cart
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatedCart'
 *     responses:
 *       200:
 *         description: Update cart successfully and return cart information
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
 *     summary: Delete multiple carts
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flowerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The list of cart's deleted flower ids
 *     responses:
 *       204:
 *         description: Delete carts successfully
 */

export const GET = async () => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                return await UserController.GetCartByUserId(userToken.user._id);
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const POST = async (req: NextRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                let body = await new Response(req.body).json();
                ({ req, body: body } = TrimRequest.all(req, null, body));
                await validate(schemas.CreateCartSchema)(null, null, body);
                return await CartController.CreateCart(
                    body,
                    userToken.user._id
                );
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                let body = await new Response(req.body).json();
                ({ req, body: body } = TrimRequest.all(req, null, body));
                await validate(schemas.UpdateCartSchema)(null, null, body);
                return await CartController.UpdateCart(
                    body,
                    userToken.user._id
                );
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Customer])(userToken, async () => {
                let body = await new Response(req.body).json();
                ({ req, body: body } = TrimRequest.all(req, null, body));
                await validate(schemas.DeleteCartsSchema)(null, null, body);
                return await CartController.DeleteCarts(
                    body,
                    userToken.user._id
                );
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
