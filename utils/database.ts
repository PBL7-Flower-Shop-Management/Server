import mongoose from "mongoose";

let isConnected = false; // track the connection

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: "Flower_DB",
            });

            isConnected = true;

            console.log("MongoDB connected");
        } else console.log("Not found mongo uri to connect!");
    } catch (error) {
        console.log(error);
    }
};
