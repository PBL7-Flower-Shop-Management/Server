import StatisticController from "@/controllers/StatisticController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import { roleMap } from "@/utils/constants";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/statistic/min-ship-date-year:
 *   get:
 *     summary: Get min ship date year
 *     tags: [Statistic]
 *     responses:
 *       200:
 *         description: Return min ship date year
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
                return await StatisticController.GetMinShipDateYear();
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
