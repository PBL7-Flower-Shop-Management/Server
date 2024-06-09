import {
    Avatar,
    Badge,
    Box,
    Card,
    CardContent,
    IconButton,
    Skeleton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useRef } from "react";

export const ProfileAvatar = (props: any) => {
    const { formik, loadingSkeleton, loadingButtonDetails, isFieldDisabled } =
        props;

    const inputRef = useRef(null);

    const handleClick = () => {
        if (inputRef && inputRef.current) (inputRef.current as any).click();
    };

    const handleFileChange = (event: any) => {
        const fileObj = event.target.files && event.target.files[0];
        formik.setValues({
            ...formik.values,
            file: fileObj,
            avatarUrl: URL.createObjectURL(fileObj),
        });
    };

    const handleCancel = () => {
        formik.setValues({
            ...formik.values,
            file: null,
            avatarUrl: null,
        });
        formik.setErrors({});
    };

    return (
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
                                    !loadingButtonDetails &&
                                    !isFieldDisabled ? (
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
                                                onClick={() => {
                                                    if (
                                                        !formik.values.avatarUrl
                                                    )
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
                                                    right: -5,
                                                    "&:hover": {
                                                        transition:
                                                            "0.2s all ease-in-out",
                                                        "& .MuiSvgIcon-root": {
                                                            color: "background.paper",
                                                        },
                                                        backgroundColor: !formik
                                                            .values.avatarUrl
                                                            ? "primary.main"
                                                            : "error.main",
                                                    },
                                                }}
                                            >
                                                {!formik.values.avatarUrl ? (
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
                                    src={formik.values.avatarUrl}
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
                            {formik.errors.file && (
                                <div
                                    style={{
                                        color: "red",
                                        marginTop: "10px",
                                    }}
                                >
                                    {formik.errors.file}
                                </div>
                            )}
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
