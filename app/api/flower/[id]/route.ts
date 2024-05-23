import FlowerController from "@/controllers/FlowerController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FlowerValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/flower/{id}:
 *   get:
 *     summary: Get flower by id
 *     tags: [Flower]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Flower id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get flower by id successfully
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
 *     summary: Delete a flower
 *     tags: [Flower]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Flower id
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Delete flower successfully
 */

export const GET = async (req: NextRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetFlowerDetailSchema)(params);
        const { id } = params;
        return await FlowerController.GetFlowerDetail(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin, roleMap.Employee])(
                userToken,
                async () => {
                    ({ params: params } = TrimRequest.all(req, params));
                    await validate(schemas.DeleteFlowerSchema)(params);
                    const { id } = params;
                    return await FlowerController.DeleteFlower(
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
