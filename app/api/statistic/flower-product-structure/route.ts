import StatisticController from "@/controllers/StatisticController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import { roleMap } from "@/utils/constants";

/**
 * @swagger
 * /api/statistic/flower-product-structure:
 *   get:
 *     summary: Get flower product structure statistic
 *     tags: [Statistic]
 *     responses:
 *       200:
 *         description: Return flower product structure statistic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                 data:
 *                   type: object
 */

export const GET = async () => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin])(userToken, async () => {
                return await StatisticController.GetFlowerProductStructureStatistic();
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
