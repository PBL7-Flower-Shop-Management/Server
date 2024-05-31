import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
    Upload = async (file: File) => {
        const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
        let dataURI = "data:" + file.type + ";base64," + b64;
        const res = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
        });
        return res;
    };

    DeleteByPublicId = async (public_id: any) => {
        await cloudinary.uploader.destroy(public_id, {
            resource_type: "video",
            invalidate: true,
        });
        return await cloudinary.uploader.destroy(public_id, {
            resource_type: "image",
            invalidate: true,
        });
    };

    GetImages = async (next_cursor = null) => {
        var result: any = [];
        var options: any = {
            resource_type: "image",
            folder: "",
            max_results: 500,
        };

        const listResources = async (next_cursor = null) => {
            if (next_cursor) {
                options["next_cursor"] = next_cursor;
            }
            try {
                const res = await cloudinary.api.resources(options);
                let more = res.next_cursor;
                let resources = res.resources;
                for (const resource of resources) {
                    const url = resource.secure_url;
                    const public_id = resource.public_id;
                    result.push({ url, public_id });
                }

                if (more) {
                    await listResources(more);
                }
            } catch (error) {
                console.log(error);
            }
        };
        await listResources(next_cursor);
        return result;
    };
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
