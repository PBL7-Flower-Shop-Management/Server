import FlowerController from "@/controllers/FlowerController";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import validate from "@/middlewares/YupValidation";
import TrimRequest from "@/utils/TrimRequest";
import schemas from "@/validations/FlowerValidation";
import { NextApiRequest } from "next";

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
 *          habitat:
 *            type: string
 *            description: The habitat of the flower.
 *          care:
 *            type: string
 *            description: The care instructions for the flower.
 *          growthTimeDay:
 *            type: integer
 *            description: The growth time of the flower in days.
 *          growthTimeMinute:
 *            type: integer
 *            description: The growth time of the flower in minutes.
 *          starsTotal:
 *            type: number
 *            description: The total stars received by the flower.
 *          feedbacksTotal:
 *            type: integer
 *            description: The total number of feedbacks received by the flower.
 *          unitPrice:
 *            type: number
 *            description: The unit price for the flower.
 *          discount:
 *            type: integer
 *            description: The discount percentage for the flower.
 *          quantity:
 *            type: integer
 *            description: The quantity of the flower available.
 *          soldQuantity:
 *            type: integer
 *            description: The quantity of the flower sold.
 *          imageVideoFiles:
 *            type: array
 *            items:
 *              type: string
 *            description: The URLs of image or video files related to the flower.
 *          description:
 *            type: string
 *            description: The description of the flower.
 *          status:
 *            type: string
 *            description: The status of the flower.
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: The timestamp when the flower was created.
 *          createdBy:
 *            type: string
 *            description: The user who created the flower.
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            description: The timestamp when the flower was last updated.
 *          updatedBy:
 *            type: string
 *            description: The user who last updated the flower.
 *          isDeleted:
 *            type: boolean
 *            description: Indicates whether the flower is deleted or not.
 */

/**
 * @swagger
 * /api/flower/{id}:
 *   get:
 *     summary: Return flower by id
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
 *         description: Flower by id
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
 *                   $ref: '#/components/schemas/Flower'
 *             example:
 *               status: success
 *               total: 1
 *               data:
 *                 _id: "6630456bfc13ae1b64a24116"
 *                 name: "Cheese - Brie, Triple Creme"
 *                 habitat: "Garden"
 *                 care: "Fusce consequat. Nulla nisl. Nunc nisl."
 *                 growthTimeDay: 113
 *                 growthTimeMinute: 43
 *                 starsTotal: 4.6
 *                 feedbacksTotal: 786
 *                 unitPrice: 123
 *                 discount: 86
 *                 quantity: 270
 *                 soldQuantity: 459
 *                 imageVideoFiles:
 *                   - "https://th.bing.com/th/id/OIP.HSM7Z15cDV86T7YjP14MvQHaFF?pid=ImgDet&w=474&h=325&rs=1"
 *                   - "https://th.bing.com/th/id/OIP.HSM7Z15cDV86T7YjP14MvQHaFF?pid=ImgDet&w=474&h=325&rs=1"
 *                 description: "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem."
 *                 status: "Available"
 *                 createdAt: "2023-12-01T00:00:00.000Z"
 *                 createdBy: "Tanny Aspital"
 *                 updatedAt: "2024-04-01T00:00:00.000Z"
 *                 updatedBy: "Queenie Houchen"
 *                 isDeleted: true
 */

export const GET = async (req: NextApiRequest, { params }: any) => {
    try {
        ({ params: params } = TrimRequest.all(req, params));
        await validate(schemas.GetFlowerDetailSchema)(null, params);
        const { id } = params;
        return await FlowerController.GetFlowerDetail(id);
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
