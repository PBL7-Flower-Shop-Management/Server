import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image } from "antd";
import ReactPlayer from "react-player";
import { allowedImageExtensions } from "@/utils/constants";
import { getMimeType } from "@/utils/helper";

const ProductImages = (props: any) => {
    const {
        formik,
        loadingSkeleton,
        handleAddImage,
        handleRemoveImage,
        isFieldDisabled,
    } = props;

    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState<any>(null);

    const getFileType = (input: any) => {
        const arr = input.split(".");
        const type = arr.length > 1 ? arr[arr.length - 1] : "unknown";
        return allowedImageExtensions.includes(type) ||
            input.startsWith("image")
            ? "image"
            : "video";
    };

    const [fileList, setFileList] = useState<any>([]);

    const uploadImage = async (options: any) => {
        const { file, onSuccess, onError } = options;
        handleAddImage(file);
        try {
            if (file.type.startsWith("image/")) {
                onSuccess(null, file);
            } else if (file.type.startsWith("video/")) {
                onSuccess(null, file);
            }
            onSuccess(null, file);
        } catch (error) {
            console.log(error);
            onError(error);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 2,
                }}
            >
                Tải lên hình ảnh/video <br /> sản phẩm
            </div>
        </div>
    );

    const handlePreviewImages = async (file: any) => {
        const fileIndex = fileList.findIndex(
            (image: any) => image.uid === file.uid
        );
        setCurrentPreviewIndex(fileIndex);
        setPreviewVisible(true);
    };

    const handleChangeImages = (info: any) => {
        let newFileList = [...info.fileList];

        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });

        setFileList(newFileList);
    };

    const handleRemove = (file: any) => {
        setFileList(fileList.filter((f: any) => f.uid !== file.uid));
        handleRemoveImage(file);
    };

    useEffect(() => {
        if (
            formik.values.imageVideoFiles &&
            formik.values.imageVideoFiles.length > 0
        )
            setFileList(
                formik.values.imageVideoFiles.map((f: any) => ({
                    ...f,
                    url: f.url,
                    type: f.type ? f.type : getMimeType(f.url),
                }))
            );
    }, [formik.values.imageVideoFiles]);

    return (
        <Card
            sx={{
                p: 0,
            }}
        >
            <CardContent>
                <Box sx={{ fontWeight: 700, marginBottom: 1 }}>
                    Hình ảnh/video sản phẩm
                </Box>
                <Grid container spacing={3}>
                    {[
                        {
                            label: "Hình ảnh/video sản phẩm",
                            name: "productImages",
                            upload: true,
                        },
                    ].map((field: any) => (
                        <Grid key={field.name} xs={12} md={field.md || 12}>
                            {loadingSkeleton || formik.values === null ? (
                                <Skeleton variant="rounded">
                                    <TextField fullWidth />
                                </Skeleton>
                            ) : (
                                <>
                                    <Upload
                                        disabled={
                                            isFieldDisabled || field.disabled
                                        }
                                        accept="image/*,video/*"
                                        name={field.name}
                                        customRequest={(options: any) =>
                                            uploadImage(options)
                                        }
                                        onChange={handleChangeImages}
                                        onRemove={handleRemove}
                                        onPreview={handlePreviewImages}
                                        multiple={true}
                                        listType="picture-card"
                                        fileList={fileList}
                                    >
                                        {uploadButton}
                                    </Upload>
                                    <Typography
                                        sx={{
                                            mt: 0.75,
                                            color: "error.main",
                                        }}
                                    >
                                        {formik.errors.imageVideoFiles}
                                    </Typography>
                                    {previewVisible && (
                                        <Image.PreviewGroup
                                            preview={{
                                                visible: previewVisible,
                                                onVisibleChange: (visible) =>
                                                    setPreviewVisible(visible),
                                                ...(currentPreviewIndex !==
                                                    null && {
                                                    current:
                                                        currentPreviewIndex,
                                                }),
                                                onChange: (index: any) =>
                                                    setCurrentPreviewIndex(
                                                        index
                                                    ),
                                                toolbarRender: (
                                                    originalNode: any,
                                                    info: any
                                                ) => {
                                                    return getFileType(
                                                        fileList[info.current]
                                                            .type ||
                                                            fileList[
                                                                info.current
                                                            ].url
                                                    ) !== "image"
                                                        ? null
                                                        : originalNode;
                                                },
                                                imageRender: (
                                                    originalNode: any,
                                                    info: any
                                                ) => {
                                                    return getFileType(
                                                        fileList[info.current]
                                                            .type ||
                                                            fileList[
                                                                info.current
                                                            ].url
                                                    ) === "image" ? (
                                                        originalNode
                                                    ) : (
                                                        <ReactPlayer
                                                            url={
                                                                fileList[
                                                                    info.current
                                                                ].url ||
                                                                fileList[
                                                                    info.current
                                                                ].thumbUrl
                                                            }
                                                            controls
                                                            height="100%"
                                                            width="100%"
                                                        />
                                                    );
                                                },
                                            }}
                                            items={fileList.map(
                                                (file: any) =>
                                                    file.url || file.thumbUrl
                                            )}
                                        />
                                    )}
                                </>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ProductImages;
