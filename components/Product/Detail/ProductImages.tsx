import {
    Unstable_Grid2 as Grid,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Divider,
    Typography,
    Box,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { LoadingButton } from "@mui/lab";
// import * as constants from "../../../../constants/constants";
// import * as messages from "../../../../constants/messages";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image } from "antd";
import ReactPlayer from "react-player";
// import * as imagesApi from "../../../../api/images";

const ProductImages = (props: any) => {
    const {
        productImages,
        loading,
        loadingButtonDetails,
        loadingButtonPicture,
        handleSubmit,
        canEdit,
    } = props;
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);
    const [isClicked, setIsClicked] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [changesMade, setChangesMade] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!loadingButtonDetails && hasSubmitted) {
            setIsClicked(false);
            setHasSubmitted(false);
        }
    }, [loadingButtonDetails, hasSubmitted]);

    const getFileType = (url: string) => {
        const extension = url.slice(((url.lastIndexOf(".") - 1) >>> 0) + 2);
        const imageExtensions = ["jpg", "png", "gif", "jpeg"]; // Additional image extensions
        const videoExtensions = ["mp3", "mp4", "mpeg"]; // Additional video extensions
        return "image";
        if (imageExtensions.includes(extension.toLowerCase())) {
            return "image";
        } else if (videoExtensions.includes(extension.toLowerCase())) {
            return "video";
        } else {
            return "unknown";
        }
    };

    const [fileList, setFileList] = useState(
        productImages &&
            productImages.map((image: any, index: number) => ({
                uid: index,
                name: null,
                status: "done",
                url: image,
            }))
    );

    const handleSuccess = (response: any, filename: any) => {
        if (Array.isArray(response)) {
            const newImages = response.map((image, index) => ({
                fileName: "",
                filePath: image.filePath,
                fileUrl: image.fileUrl,
            }));
            formik.setValues([...formik.values, ...newImages]);
        } else {
            const newImage = {
                fileName: filename,
                filePath: response[0].filePath,
                fileUrl: response[0].fileUrl,
            };
            formik.setValues({
                ...formik.values,
                productImages: [...formik.values, newImage],
            });
        }
    };

    const handleError = (error: any) => {
        setMessage(error);
        setFileList(
            productImages &&
                productImages.map((image: any, index: number) => ({
                    uid: index,
                    name: undefined,
                    status: "done",
                    // path: image.filePath,
                    url: image,
                }))
        );
        formik.setValues(productImages);
    };

    const handleRemove = async (file: any) => {
        try {
            const imageIndex = fileList.findIndex(
                (media: any) => media.uid === file.uid
            );
            const filePath = file.path;
            // const messages = await imagesApi.deleteImage(filePath);
            const messages = "successfully";
            formik.values.splice(imageIndex, 1);
        } catch (e) {
            console.error(e);
        }
    };

    const uploadImage = async (options: any) => {
        const { onProgress, onSuccess, onError, file } = options;
        const fmData = new FormData();

        if (
            !file.type.startsWith("image/") &&
            !file.type.startsWith("video/")
        ) {
            onError("Hình ảnh/video tải lên không hợp lệ. Vui lòng thử lại.");
            return;
        }
        setMessage("");

        if (file.type.startsWith("image/")) {
            fmData.append("Files", file);
            try {
                const config = {
                    headers: { "content-type": "multipart/form-data" },
                    onUploadProgress: (event: any) => {
                        const percent = Math.floor(
                            (event.loaded / event.total) * 100
                        );
                        setProgress(percent);
                        if (percent === 100) {
                            setTimeout(() => setProgress(0), 1000);
                        }
                        onProgress({
                            percent: (event.loaded / event.total) * 100,
                        });
                    },
                };
                // const response = await imagesApi.uploadImage(fmData, config);
                const response = {};
                console.log("response", response);
                onSuccess(response, file.name);
            } catch (error) {
                onError(error);
            }
        } else if (file.type.startsWith("video/")) {
            fmData.append("Files", file);
            fmData.append("NumberImagesEachSecond", 2);

            let result = await auth.refreshToken();
            if (!result.isSuccessfully) {
                throw new Error(result.data);
            }

            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                    Authorization: `Bearer ${result.data}`,
                },
                onUploadProgress: (event: any) => {
                    const percent = Math.floor(
                        (event.loaded / event.total) * 100
                    );
                    setProgress(percent);
                    if (percent === 100) {
                        setTimeout(() => setProgress(0), 1000);
                    }
                    onProgress({ percent: (event.loaded / event.total) * 100 });
                },
            };
            try {
                // const response = await imagesApi.splitVideo(fmData, config);
                const response = {};
                console.log("response", response);
                onSuccess(response);
            } catch (error) {
                onError(error);
            }
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

    const hidePreview = () => {
        setPreviewVisible(false);
    };

    const handleChangeImages = ({ fileList: newFileList }: any) => {
        console.log("newFileList", newFileList);
        setFileList(newFileList);
        setChangesMade(true);
    };

    const handleEditImages = () => {
        setIsFieldDisabled(false);
        setIsClicked(false);
        setChangesMade(false);
    };

    const handleSubmitImages = () => {
        setIsFieldDisabled(true);
        setIsClicked(true);
        setHasSubmitted(true);
        if (changesMade) handleSubmit(formik.values);
    };

    const handleCancelImages = () => {
        setIsClicked(false);
        setIsFieldDisabled(true);
        setChangesMade(false);
        formik.setValues(productImages);
        formik.setTouched({}, false);
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: productImages ? productImages : null,
        onSubmit: async (values, helpers) => {
            try {
                handleSubmitImages();
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        setFileList(
            formik.values?.map((image: any, index: number) => ({
                uid: index,
                // name: image.fileName,
                status: "done",
                // path: image.filePath,
                url: image,
            }))
        );
    }, [formik.values]);

    return (
        <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
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
                                {loading || formik.values === null ? (
                                    <Skeleton variant="rounded">
                                        <TextField fullWidth />
                                    </Skeleton>
                                ) : field.upload ? (
                                    <>
                                        <Upload
                                            disabled={
                                                isFieldDisabled ||
                                                field.disabled
                                            }
                                            accept="image/*,video/*"
                                            name={field.name}
                                            customRequest={(options: any) =>
                                                uploadImage({
                                                    ...options,
                                                    onSuccess: handleSuccess,
                                                    onError: handleError,
                                                })
                                            }
                                            onChange={handleChangeImages}
                                            onRemove={handleRemove}
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={handlePreviewImages}
                                        >
                                            {uploadButton}
                                        </Upload>
                                        <Typography
                                            sx={{
                                                mt: 0.75,
                                                color: "error.main",
                                            }}
                                        >
                                            {message}
                                        </Typography>
                                        {previewVisible && (
                                            <Image.PreviewGroup
                                                preview={{
                                                    visible: previewVisible,
                                                    onVisibleChange:
                                                        hidePreview,
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
                                                            fileList[
                                                                info.current
                                                            ].url
                                                        ) === "image" ? (
                                                            originalNode
                                                        ) : (
                                                            <ReactPlayer
                                                                url={
                                                                    fileList[
                                                                        info
                                                                            .current
                                                                    ].url
                                                                }
                                                                controls
                                                                height="100%"
                                                                width="100%"
                                                            />
                                                        );
                                                    },
                                                }}
                                                items={fileList.map(
                                                    (file: any) => file.url
                                                )}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <TextField
                                        error={
                                            !!(
                                                formik.touched[field.name] &&
                                                formik.errors[field.name]
                                            )
                                        }
                                        fullWidth
                                        helperText={
                                            formik.touched[field.name] &&
                                            formik.errors[field.name]
                                        }
                                        label={field.label}
                                        name={field.name}
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            setChangesMade(true);
                                            formik.handleChange(e);
                                        }}
                                        type={field.name}
                                        value={formik.values[field.name]}
                                        multiline={field.textArea || false}
                                        disabled={
                                            isFieldDisabled || field.disabled
                                        }
                                        required={field.required || false}
                                        select={field.select}
                                        SelectProps={
                                            field.select
                                                ? { native: true }
                                                : undefined
                                        }
                                        sx={{
                                            "& .MuiInputBase-input": {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            },
                                        }}
                                    >
                                        {field.select &&
                                            Object.entries(
                                                field.selectProps
                                            ).map(([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label as any}
                                                </option>
                                            ))}
                                    </TextField>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
                <Divider />
                {canEdit && (
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                        {isClicked ? (
                            loadingButtonDetails && (
                                <LoadingButton
                                    disabled
                                    loading={loadingButtonDetails}
                                    size="medium"
                                    variant="contained"
                                >
                                    Chỉnh sửa thông tin
                                </LoadingButton>
                            )
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (isFieldDisabled) handleEditImages();
                                        else formik.handleSubmit();
                                    }}
                                    disabled={loadingButtonPicture}
                                >
                                    {isFieldDisabled
                                        ? "Chỉnh sửa thông tin"
                                        : "Cập nhật thông tin"}
                                </Button>
                                {!isFieldDisabled && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancelImages}
                                    >
                                        Hủy
                                    </Button>
                                )}
                            </>
                        )}
                    </CardActions>
                )}
            </Card>
        </form>
    );
};

export default ProductImages;
