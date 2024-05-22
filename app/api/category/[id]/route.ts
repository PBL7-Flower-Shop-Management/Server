import CategoryController from "@/controllers/CategoryController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/CategoryValidation";
import { NextApiRequest } from "next";

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Category id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return category by id
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
 *     summary: Delete a category
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Category id
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Delete category successfully
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetByIdSchema)(params);
        const { id } = params;
        return await CategoryController.GetCategoryById(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const DELETE = async (req: NextApiRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin, roleMap.Employee])(
                userToken,
                async () => {
                    ({ params: params } = TrimRequest.all(req, params));
                    await validate(schemas.DeleteCategorySchema)(params);
                    const { id } = params;
                    return await CategoryController.DeleteCategory(
                        id,
                        userToken.user.username
                    );
                }
            );
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
