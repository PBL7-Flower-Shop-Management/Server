import StatisticController from "@/controllers/StatisticController";
import { auth, checkRole } from "@/middlewares/Authorization";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import { roleMap } from "@/utils/constants";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/StatisticValidation";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/statistic/evolution-of-revenue:
 *   get:
 *     summary: Get evolution of revenue statistic
 *     tags: [Statistic]
 *     parameters:
 *       - name: year
 *         type: number
 *         in: query
 *         description: Statistic year
 *     responses:
 *       200:
 *         description: Return evolution of revenue statistic
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
                let query;
                ({ req, query: query } = TrimRequest.all(req));
                await validate(schemas.GetEvolutionOfRevenueSchema)(
                    null,
                    query
                );
                return await StatisticController.GetEvolutionOfRevenueStatistic(
                    query.year
                );
            });
        });
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
