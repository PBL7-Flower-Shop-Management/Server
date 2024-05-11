import CategoryController from "@/controllers/CategoryController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/CategoryValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 *  components:
 *    schemas:
 *      CategoryWithFlowers:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The id of the category.
 *          name:
 *            type: string
 *            description: The name of the category.
 *          avatar:
 *            type: string
 *            description: The avatar path of the category.
 *          flowers:
 *            type: array
 *            description: The flowers belong to the category.
 *            items:
 *              $ref: '#/components/schemas/SuggestedFlower'
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: The category managing API
 */

/**
 * @swagger
 * /api/category/with-flowers:
 *   get:
 *     summary: Return the list of all the categories with flowers
 *     tags: [Category]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Limit of flowers list in each category
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: The list of the categories with flowers
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryWithFlowers'
 *               example:
 *                 status: success
 *                 total: 1
 *                 data:
 *                   - _id: "663047485c22d11402fcc6d3"
 *                     name: "Hoa trồng vườn"
 *                     avatar: "https://th.bing.com/th/id/OIP.f-FXUJ0aDZgeT7USzI7CUgHaKW?rs=1&pid=ImgDetMain"
 *                     flowers:
 *                       - "_id": "6630456bfc13ae1b64a24114"
 *                         "name": "Soup - Campbells Chili Veg"
 *                         "stars": 2.9
 *                         "unitPrice": 100
 *                         "status": "Out of Stock"
 *                         "discount": 41
 *                         "soldQuantity": 499
 *                         "image":
 *                            "https://th.bing.com/th/id/OIP.WijcKwJiY-TL-qj6UwNovwHaFv?rs=1&pid=ImgDetMain"
 */

export const GET = async (req: NextApiRequest) => {
    try {
        let query;
        ({ req, query: query } = TrimRequest.all(req));
        await validate(schemas.GetCategoryWithFlowers)(req, null, query);
        return await CategoryController.GetCategoryWithFlowers(query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
