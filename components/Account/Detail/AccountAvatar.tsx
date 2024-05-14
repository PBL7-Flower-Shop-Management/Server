import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Skeleton,
    Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export const AccountAvatar = (props: any) => {
    const {
        imageLink,
        loadingSkeleton,
        loadingButtonDetails,
        loadingButtonPicture,
        onUpdate,
        success,
    } = props;
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [message, setMessage] = useState("");

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            image: imageLink ? imageLink : null,
            file: null,
        },
        validationSchema: Yup.object({
            file: Yup.mixed()
                .nullable()
                .test(
                    "fileFormat",
                    "Ảnh tải lên không hợp lệ",
                    (value: any) => {
                        if (value && value.type) {
                            return value.type.startsWith("image/");
                        }
                        return true;
                    }
                ),
        }),
        onSubmit: async (values, helpers: any) => {
            try {
                handleUpload();
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        setIsImageChanged(false);
    }, [imageLink]);

    const inputRef = useRef(null);

    const handleClick = () => {
        if (inputRef && inputRef.current) (inputRef.current as any).click();
    };

    const handleFileChange = (event: any) => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        if (!fileObj.type.startsWith("image/")) {
            setMessage("Ảnh tải lên không hợp lệ. Vui lòng thử lại.");
            return;
        }
        setMessage("");
        formik.setValues({
            ...formik.values,
            file: fileObj,
            image: URL.createObjectURL(fileObj),
        });
        setIsImageChanged(true);
    };

    const handleCancel = () => {
        formik.setValues({
            ...formik.values,
            file: null,
            image: imageLink,
        });
        setIsImageChanged(false);
    };

    const handleUpload = () => {
        if (isImageChanged && formik.values.file) {
            const formData = new FormData();
            formData.append("Files", formik.values.file);
            setIsImageChanged(false);
            onUpdate(formData);
            setIsImageChanged(!success);
        }
    };

    return (
        <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
            <Card>
                <CardContent
                    sx={{
                        p: 0,
                        mb: 3,
                        mt: 3,
                    }}
                >
                    <Box
                        sx={{
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                        }}
                    >
                        {loadingSkeleton ? (
                            <Skeleton variant="circular">
                                <Avatar
                                    sx={{
                                        height: 250,
                                        width: 250,
                                    }}
                                />
                            </Skeleton>
                        ) : (
                            <>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    badgeContent={
                                        <>
                                            <input
                                                style={{ display: "none" }}
                                                ref={inputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            <IconButton
                                                disabled={loadingButtonDetails}
                                                onClick={handleClick}
                                                aria-label="edit"
                                                sx={{
                                                    backgroundColor:
                                                        "background.paper",
                                                    height: 50,
                                                    width: 50,
                                                    boxShadow: 11,
                                                    position: "absolute",
                                                    top: -10,
                                                    right: -5,
                                                    "&:hover": {
                                                        transition:
                                                            "0.2s all ease-in-out",
                                                        "& .MuiSvgIcon-root": {
                                                            color: "background.paper",
                                                        },
                                                        backgroundColor:
                                                            "primary.main",
                                                    },
                                                }}
                                            >
                                                <EditIcon
                                                    sx={{
                                                        color: "primary.main",
                                                        height: 35,
                                                        width: 35,
                                                    }}
                                                />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <Avatar
                                        src={formik.values.image}
                                        sx={{
                                            borderColor: "primary.main",
                                            borderStyle: "solid",
                                            borderWidth: 4,
                                            boxShadow: 10,
                                            height: 250,
                                            width: 250,
                                        }}
                                    />
                                </Badge>
                                <Typography
                                    sx={{
                                        mt: 0.75,
                                        color: "error.main",
                                    }}
                                >
                                    {message}
                                </Typography>
                            </>
                        )}
                    </Box>
                </CardContent>
                <Divider />
                {loadingButtonPicture && (
                    <CardActions
                        sx={{
                            justifyContent: "center",
                        }}
                    >
                        <LoadingButton
                            disabled
                            loading={loadingButtonPicture}
                            fullWidth
                            size="medium"
                            variant="contained"
                        >
                            Tải ảnh lên
                        </LoadingButton>
                    </CardActions>
                )}
                {isImageChanged && !loadingButtonPicture && (
                    <CardActions
                        sx={{
                            justifyContent: "center",
                        }}
                    >
                        <Grid xs={12} md={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                Tải ảnh lên
                            </Button>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={handleCancel}
                            >
                                Hủy
                            </Button>
                        </Grid>
                    </CardActions>
                )}
            </Card>
        </form>
    );
};
