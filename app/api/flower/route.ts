import FlowerController from "@/controllers/FlowerController";
import { auth } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FlowerValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Flower:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: The name of the flower.
 *            required: true
 *          habitat:
 *            type: string
 *            description: The habitat of the flower.
 *          growthTime:
 *            type: string
 *            description: The growth time of the flower
 *          care:
 *            type: string
 *            description: The care instructions for the flower.
 *          unitPrice:
 *            type: number
 *            description: The unit price for the flower.
 *          discount:
 *            type: integer
 *            description: The discount percentage for the flower.
 *          quantity:
 *            type: integer
 *            description: The quantity of the flower available.
 *          soldQuantity:
 *            type: integer
 *            description: The quantity of the flower sold.
 *          imageVideoFiles:
 *            type: array
 *            items:
 *              type: string
 *            description: The URLs of image or video files related to the flower.
 *          description:
 *            type: string
 *            description: The description of the flower.
 *          category:
 *            type: array
 *            items:
 *              type: string
 *            description: The list of categorie ids of flower
 *
 *      UpdatedFlower:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier of the flower.
 *            required: true
 *          name:
 *            type: string
 *            description: The name of the flower.
 *            required: true
 *          habitat:
 *            type: string
 *            description: The habitat of the flower.
 *          growthTime:
 *            type: string
 *            description: The growth time of the flower
 *          care:
 *            type: string
 *            description: The care instructions for the flower.
 *          unitPrice:
 *            type: number
 *            description: The unit price for the flower.
 *          discount:
 *            type: integer
 *            description: The discount percentage for the flower.
 *          quantity:
 *            type: integer
 *            description: The quantity of the flower available.
 *          soldQuantity:
 *            type: integer
 *            description: The quantity of the flower sold.
 *          imageVideoFiles:
 *            type: array
 *            items:
 *              type: string
 *            description: The URLs of image or video files related to the flower.
 *          description:
 *            type: string
 *            description: The description of the flower.
 *          category:
 *            type: array
 *            items:
 *              type: string
 *            description: The list of categorie ids of flower
 */

/**
 * @swagger
 * tags:
 *   name: Flower
 *   description: The flower managing API
 */

/**
 * @swagger
 * /api/flower:
 *   get:
 *     summary: Get all flowers
 *     tags: [Flower]
 *     parameters:
 *       - name: keyword
 *         type: string
 *         in: query
 *         description: Search keyword (search by flower name, habitat, status and description)
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
 *         description: >
 *               Fields and sort order to order by (format: <field_name>:<sort_order>, <field_name>:<sort_order>).
 *               With sort_order = 1 is ascending order and sort_order = -1 is descending order.
 *         default: name:1
 *     responses:
 *       200:
 *         description: Return all flowers
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
 *     summary: Create a new flower
 *     tags: [Flower]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flower'
 *     responses:
 *       201:
 *         description: Create flower successfully and return flower information
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
 *     summary: Update a flower
 *     tags: [Flower]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatedFlower'
 *     responses:
 *       200:
 *         description: Update flower successfully and return flower information
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
        return await auth(async () => {
            let query;
            ({ req, query: query } = TrimRequest.all(req));
            await validate(schemas.GetAllFlowerSchema)(null, query);
            return await FlowerController.GetAllFlower(query);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const POST = async (req: NextApiRequest) => {
    try {
        return await auth(async (userToken: any) => {
            let body = await new Response(req.body).json();
            ({ req, body: body } = TrimRequest.all(req, null, body));
            await validate(schemas.CreateFlowerSchema)(null, null, body);
            body.createdBy = userToken.user.username;
            return await FlowerController.CreateFlower(body);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const PUT = async (req: NextApiRequest) => {
    try {
        return await auth(async (userToken: any) => {
            let body = await new Response(req.body).json();
            ({ req, body: body } = TrimRequest.all(req, null, body));
            await validate(schemas.UpdateFlowerSchema)(null, null, body);
            body.updatedBy = userToken.user.username;
            return await FlowerController.UpdateFlower(body);
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
