import CategoryModel from "@/models/CategoryModel";
import FlowerCategoryModel from "@/models/FlowerCategoryModel";
import FlowerModel from "@/models/FlowerModel";
import { connectToDB } from "@/utils/database";
import { isNumberic, isIntegerNumber } from "@/utils/helper";

/**
 * @swagger
 * /api/flower/decoration:
 *   get:
 *     summary: Returns the list of all the decorative flowers
 *     tags: [Flower]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Limit of decorative flower lists
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: The list of the decorative flowers
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

        const decorativeCategories = (
            await CategoryModel.find({
                categoryName: "Hoa trưng bày",
                isDeleted: false,
            })
        ).map((c) => c._id);

        const decorativeFlowerIds = (
            await FlowerCategoryModel.find({
                categoryId: { $in: decorativeCategories },
            })
        ).map((c) => c.flowerId);

        const searchParams = request.nextUrl.searchParams;
        let limit = searchParams.get("limit");
        if (limit)
            if (isNumberic(limit)) {
                if (isIntegerNumber(limit)) {
                    limit = Number(limit);
                    if (limit <= 0) throw "Limit field must be greater than 0!";
                } else throw "Limit field must be integer number!";
            } else throw "Limit field must be a number";

        let flowers = await FlowerModel.find(
            {
                _id: { $in: decorativeFlowerIds },
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

        if (limit) {
            flowers = flowers.slice(0, Math.min(limit, flowers.length));
        }

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
