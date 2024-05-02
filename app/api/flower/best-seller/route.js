import OrderDetailModel from "@/models/OrderDetailModel";
import FlowerModel from "@/models/FlowerModel";
import { connectToDB } from "@/utils/database";
import OrderModel from "@/models/OrderModel";
import { isIntegerNumber, isNumberic } from "@/utils/helper";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Flower:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier of the flower.
 *          name:
 *            type: string
 *            description: The name of the flower.
 *          stars:
 *            type: number
 *            description: The total number of stars received by the flower.
 *          unitPrice:
 *            type: number
 *            description: The unit price for the flower
 *          discount:
 *            type: integer
 *            description: The discount percentage for the flower.
 *          imageVideoFiles:
 *            type: array
 *            items:
 *              type: string
 *            description: The URLs of image or video files related to the flower.
 *          status:
 *            type: string
 *            description: The status of the flower.
 *          id:
 *            type: string
 *            description: The auto-generated ID of the flower.
 */

/**
 * @swagger
 * tags:
 *   name: Flower
 *   description: The flower managing API
 */

/**
 * @swagger
 * /api/flower/best-seller:
 *   get:
 *     summary: Returns the list of all the best seller flowers
 *     tags: [Flower]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Limit of best seller flower lists
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: The list of the best seller flowers
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
 *                     $ref: '#/components/schemas/Flower'
 *               example:
 *                 status: success
 *                 total: 1
 *                 data:
 *                   - _id: "6630456bfc13ae1b64a24222"
 *                     name: "Fenngreek Seed"
 *                     unitPrice: 341
 *                     discount: 34
 *                     imageVideoFiles:
 *                       - "https://th.bing.com/th/id/R.f852bb117e8734ca0d7507781d76ad2e?rik=VtL1rYEsidWJsA&pid=ImgRaw&r=0"
 *                       - "https://th.bing.com/th/id/R.f852bb117e8734ca0d7507781d76ad2e?rik=VtL1rYEsidWJsA&pid=ImgRaw&r=0"
 *                       - "https://th.bing.com/th/id/R.f852bb117e8734ca0d7507781d76ad2e?rik=VtL1rYEsidWJsA&pid=ImgRaw&r=0"
 *                       - "https://th.bing.com/th/id/R.f852bb117e8734ca0d7507781d76ad2e?rik=VtL1rYEsidWJsA&pid=ImgRaw&r=0"
 *                     status: "Available"
 *                     stars: 0.8
 *                     id: "6630456bfc13ae1b64a24222"
 */

export const GET = async (request) => {
    try {
        await connectToDB();
        const validOrderIds = (
            await OrderModel.find({
                status: {
                    $in: ["Shipped", "Delivered", "Pending payment processing"],
                },
                isDeleted: false,
            })
        ).map((o) => o._id);

        const searchParams = request.nextUrl.searchParams;
        let limit = searchParams.get("limit");
        if (limit)
            if (isNumberic(limit)) {
                if (isIntegerNumber(limit)) {
                    limit = Number(limit);
                    if (limit <= 0) throw "Limit field must be greater than 0!";
                } else throw "Limit field must be integer number!";
            } else throw "Limit field must be a number";

        const flowerIds = await OrderDetailModel.aggregate([
            { $match: { orderId: { $in: validOrderIds } } },
            {
                $group: {
                    _id: "$flowerId",
                    totalSold: { $sum: "$numberOfFlowers" },
                },
            },
            {
                $sort: { totalSold: -1 },
            },
            ...(limit ? [{ $limit: limit }] : []),
            {
                $project: {
                    _id: 1,
                },
            },
        ]);

        const flowers = await FlowerModel.find(
            {
                _id: { $in: flowerIds },
                isDeleted: false,
            },
            {
                name: 1,
                stars: "$starsTotal",
                unitPrice: 1,
                status: 1,
                discount: 1,
                imageVideoFiles: 1,
            }
        );

        return new Response(
            JSON.stringify(
                {
                    status: "success",
                    total: flowers.length,
                    data: flowers,
                },
                null,
                2
            ),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify(
                {
                    status: "fail",
                    message: error.message ?? error,
                },
                null,
                2
            ),
            {
                status: 500,
            }
        );
    }
};
