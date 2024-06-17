import ApiResponse from "@/utils/ApiResponse";
import HttpStatus from "http-status";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";
import CloudinaryService from "./CloudinaryService";
import IdentificationHistoryModel from "@/models/IdentificationHistoryModel";
import moment from "moment";
import IdentificationResultModel from "@/models/IdentificationResultModel";
import { Base64ImageToFile } from "@/utils/helper";

class IdentificationService {
    async ClassifyFlower(
        flowerImage: any,
        cloudinaryImage: any,
        user: any | null
    ): Promise<ApiResponse> {
        return new Promise(async (resolve, reject) => {
            await connectToDB();
            const session = await mongoose.startSession();
            session.startTransaction({
                readConcern: { level: "snapshot" },
                writeConcern: { w: "majority" },
                maxTimeMS: 5000, // Adjust the timeout as needed
            });
            try {
                const form = new FormData();
                form.set("FlowerImage", flowerImage);

                const result = await fetch(process.env.AI_SERVER_URL!, {
                    method: "POST",
                    body: form,
                });

                let resultData = await result.json();
                if (!result.ok)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message: resultData.message,
                        })
                    );

                if (!resultData.isPredictable)
                    return reject(
                        new ApiResponse({
                            status: HttpStatus.BAD_REQUEST,
                            message:
                                "Model can't identify the flower in the photo.",
                        })
                    );
                else resultData = resultData.result;

                const currentDate = moment().toDate();
                if (!cloudinaryImage) {
                    //upload image cloudinary
                    cloudinaryImage = await CloudinaryService.Upload(
                        flowerImage
                    );
                }

                const newIdentificationHistory = user
                    ? await IdentificationHistoryModel.create(
                          [
                              {
                                  userId: user._id,
                                  date: currentDate,
                                  inputImageUrl: cloudinaryImage.url,
                                  inputImageId: cloudinaryImage.public_id,
                                  createdAt: currentDate,
                                  createdBy: user.username ?? "System",
                                  isDeleted: false,
                              },
                          ],
                          { session: session }
                      ).then((res) => res[0])
                    : { date: currentDate, inputImageUrl: cloudinaryImage.url };

                let results = [];

                for (const res of resultData) {
                    //upload image cloudinary
                    let response = await CloudinaryService.Upload(
                        Base64ImageToFile(
                            res.image,
                            res.label.english_label + ".png"
                        )
                    );

                    res.label = JSON.parse(res.label);

                    results.push({
                        english_label: res.label.english_label,
                        vietnamese_label: res.label.vietnamese_label,
                        accuracy: res.confidence,
                        imageUrl: response.url,
                    });

                    if (user) {
                        await IdentificationResultModel.create(
                            [
                                {
                                    identificationHistoryId:
                                        newIdentificationHistory._id,
                                    flowerEnglishName: res.label.english_label,
                                    flowerVietnameseName:
                                        res.label.vietnamese_label,
                                    accuracy: res.confidence,
                                    imageUrl: response.url,
                                    imageId: response.public_id,
                                },
                            ],
                            { session: session }
                        );
                    }
                }

                let newObj: any = {};
                newObj.date = newIdentificationHistory.date;
                newObj.inputImageUrl = newIdentificationHistory.inputImageUrl;
                newObj.results = results;

                await session.commitTransaction();

                resolve(
                    new ApiResponse({
                        status: HttpStatus.CREATED,
                        data: newObj,
                    })
                );
            } catch (error: any) {
                await session.abortTransaction();
                return reject(error);
            } finally {
                if (session.inTransaction()) {
                    await session.abortTransaction();
                }
                session.endSession();
            }
        });
    }
}

const identificationService = new IdentificationService();
export default identificationService;
