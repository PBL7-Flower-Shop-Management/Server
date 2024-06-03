import IdentificationController from "@/controllers/IdentificationController";
import { auth } from "@/middlewares/Authorization";
import { checkFile } from "@/middlewares/CheckFile";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

/**
 * @swagger
 * tags:
 *   name: Identification
 *   description: The identification managing API
 */

/**
 * @swagger
 * /api/identification:
 *   post:
 *     summary: Classify flower
 *     tags: [Identification]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               flowerImage:
 *                 type: string
 *                 format: binary
 *                 description: The flower image.
 *     responses:
 *       201:
 *         description: Classify flower and return identification result
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
 */

export const POST = async (req: NextRequest) => {
    try {
        const authHeader = headers().get("authorization");
        let userToken: any = null;
        if (authHeader)
            await auth((token: any) => {
                userToken = token;
            });

        let flowerImage = null;
        if (!req.headers.get("content-type")?.includes("application/json")) {
            const formData = await req.formData();
            flowerImage = formData.get("flowerImage");
            await checkFile(flowerImage as File, true);
        }
        return await IdentificationController.ClassifyFlower(
            flowerImage,
            userToken?.user
        );
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
