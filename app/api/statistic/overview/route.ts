import StatisticController from "@/controllers/StatisticController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import { roleMap } from "@/utils/constants";
import { NextRequest } from "next/server";

/**
 * @swagger
 * tags:
 *   name: Statistic
 *   description: The statistic managing API
 */

/**
 * @swagger
 * /api/statistic/overview:
 *   get:
 *     summary: Get overview statistic
 *     tags: [Statistic]
 *     responses:
 *       200:
 *         description: Return overview statistic
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

export const GET = async (req: NextRequest) => {
    try {
        return await auth(async (userToken: any) => {
            return await checkRole([roleMap.Admin])(userToken, async () => {
                return await StatisticController.GetOverviewStatistic();
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
