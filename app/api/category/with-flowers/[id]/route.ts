import CategoryController from "@/controllers/CategoryController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import schemas from "@/validations/CategoryValidation";
import { NextApiRequest } from "next";
import TrimRequest from "@/utils/TrimRequest";

/**
 * @swagger
 * /api/category/with-flowers/{categoryId}:
 *   get:
 *     summary: Return the category by id with flowers
 *     tags: [Category]
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         description: Category id
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Limit of flowers list in the category
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: The list of the category by id with flowers
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
 *                   items:
 *                     $ref: '#/components/schemas/CategoryWithFlowers'
 *               example:
 *                 status: success
 *                 total: 1
 *                 data:
 *                     _id: "663047485c22d11402fcc6d3"
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

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        let query;
        ({ req, params, query: query } = TrimRequest.all(req, params));
        await validate(schemas.GetCategoryByIdWithFlowers)(params, query);
        const { id } = params;
        return await CategoryController.GetCategoryByIdWithFlowers(id, query);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
