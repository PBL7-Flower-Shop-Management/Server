import IdentificationController from "@/controllers/IdentificationController";
import { auth } from "@/middlewares/Authorization";
import { checkFile } from "@/middlewares/CheckFile";
import { ErrorHandler } from "@/middlewares/ErrorHandler";
import { createFileFromBuffer } from "@/utils/helper";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import fetch from "node-fetch";

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
        let authHeader = headers().get("authorization");
        let userToken: any = null;
        if (authHeader) {
            authHeader = authHeader?.split(" ")[1];
            if (authHeader !== "undefined")
                await auth((token: any) => {
                    userToken = token;
                });
        }

        let flowerImage = null;
        let body = null;

        if (!req.headers.get("content-type")?.includes("application/json")) {
            const formData = await req.formData();
            flowerImage = formData.get("flowerImage");
            await checkFile(flowerImage as File, true);
        } else {
            body = await new Response(req.body).json();

            const imageUrl = new URL(body.url);
            const response = await fetch(imageUrl);

            const buffer = await response.arrayBuffer();
            flowerImage = createFileFromBuffer(
                buffer,
                "image.jpg",
                "image/jpeg"
            );

            await checkFile(flowerImage as File, true);
        }

        return await IdentificationController.ClassifyFlower(
            flowerImage,
            body,
            userToken?.user
        );
    } catch (error: any) {
        return ErrorHandler(error);
    }
};
