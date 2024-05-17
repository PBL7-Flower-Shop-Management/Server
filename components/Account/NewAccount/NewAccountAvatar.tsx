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
import { useEffect, useState, useRef } from "react";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";

export const NewAccountAvatar = (props: any) => {
    const {
        imageLink,
        loadingSkeleton,
        loadingButtonDetails,
        loadingButtonPicture,
        onUpdate,
        isFieldDisabled,
        buttonDisabled,
    } = props;
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [file, setFile] = useState<any>();
    const [image, setImage] = useState<any>();
    const [message, setMessage] = useState("");

    useEffect(() => {
        setImage(imageLink);
        setIsImageChanged(false);
    }, [imageLink]);

    const inputRef = useRef<any>();

    const handleClick = () => {
        inputRef.current.click();
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
        setFile(fileObj);
        setImage(URL.createObjectURL(fileObj));
        setIsImageChanged(true);
    };

    const handleCancel = () => {
        setImage(imageLink);
        setFile(null);
        setIsImageChanged(false);
    };

    const handleUpload = () => {
        if (isImageChanged && file) {
            const formData = new FormData();
            formData.append("Files", file);
            setIsImageChanged(false);
            onUpdate(formData);
            // setIsImageChanged(!success);
        }
    };

    return (
        <Card>
            <CardContent
                sx={{
                    p: 0,
                    mb: 3.8,
                    mt: 3.8,
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
                                            name="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <IconButton
                                            disabled={
                                                loadingButtonDetails ||
                                                isFieldDisabled ||
                                                buttonDisabled
                                            }
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
                                                right: 4,
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
                                    src={image}
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
                            fullWidth
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={handleUpload}
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
    );
};
