import {
    Avatar,
    Badge,
    Box,
    Card,
    CardContent,
    Divider,
    IconButton,
    Skeleton,
    Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState, useRef } from "react";

export const NewAccountAvatar = (props: any) => {
    const {
        loadingSkeleton,
        loadingButtonDetails,
        error,
        onUpdate,
        isFieldDisabled,
        buttonDisabled,
        reset,
    } = props;
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [file, setFile] = useState<any>();
    const [image, setImage] = useState<any>();

    const inputRef = useRef<any>();

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (event: any) => {
        const fileObj = event.target.files && event.target.files[0];
        setFile(fileObj);
        setImage(URL.createObjectURL(fileObj));
        setIsImageChanged(true);
    };

    const handleCancel = () => {
        setImage(null);
        setFile(null);
        setIsImageChanged(false);
    };

    useEffect(() => {
        onUpdate(file);
        if (isImageChanged && file) {
            setIsImageChanged(!error);
        }
    }, [file, isImageChanged]);

    useEffect(() => {
        if (reset) handleCancel();
    }, [reset]);

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
                                    !loadingButtonDetails && !buttonDisabled ? (
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
                                                    isFieldDisabled
                                                }
                                                onClick={() => {
                                                    if (!isImageChanged)
                                                        handleClick();
                                                    else handleCancel();
                                                }}
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
                                                            !isImageChanged
                                                                ? "primary.main"
                                                                : "error.main",
                                                    },
                                                }}
                                            >
                                                {!isImageChanged ? (
                                                    <EditIcon
                                                        sx={{
                                                            color: "primary.main",
                                                            height: 35,
                                                            width: 35,
                                                        }}
                                                    />
                                                ) : (
                                                    <CancelIcon
                                                        sx={{
                                                            color: "error.main",
                                                            height: 50,
                                                            width: 50,
                                                        }}
                                                    />
                                                )}
                                            </IconButton>
                                        </>
                                    ) : (
                                        <></>
                                    )
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
                                {error}
                            </Typography>
                        </>
                    )}
                </Box>
            </CardContent>
            <Divider />
        </Card>
    );
};
