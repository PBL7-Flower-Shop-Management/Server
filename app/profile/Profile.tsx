"use client";

import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import {
    Alert,
    Box,
    Collapse,
    Container,
    IconButton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";
import { ProfileAvatar } from "@/components/Profile/ProfileAvatar";
import ProfileDetail from "@/components/Profile/ProfileDetail";
import { zIndexLevel } from "@/utils/constants";

const Profile = () => {
    const [profile, setProfile] = useState<any>();
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonPicture, setLoadingButtonPicture] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(true);
    const { data: session } = useSession();

    const getProfile = useCallback(async () => {
        if (session?.user) {
            setLoadingSkeleton(true);
            try {
                // const user = JSON.parse(localStorage.getItem("user"));
                const profile = {
                    _id: "6648c33bdacda77e9bdad9e6",
                    username: "HoangG",
                    avatar: "string",
                    name: "gewhgo Hoàng",
                    citizenId: "25445",
                    email: "nguyenthedanghoan@gmail.com",
                    phoneNumber: "5435",
                    role: "Customer",
                    isActived: true,
                };
                setProfile(profile);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoadingSkeleton(false);
            }
        }
    }, []);

    useEffect(() => {
        getProfile();
    }, [session?.user]);

    const updateLocalStorage = (updatedUser: any) => {
        try {
            // Merge the updated account with the existing user data
            const updatedUserData = {
                ...profile,
                ...updatedUser,
            };

            // Update the user data in local storage
            localStorage.setItem("user", JSON.stringify(updatedUserData));
        } catch (error: any) {
            console.error("Error updating local storage:", error);
            setError("Error updating local storage:" + error);
        }
    };

    const updateDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                setSuccess("");
                setError("");
                const { imageLink, ...userWithoutImageLink } = profile;
                const updatedUser = {
                    // id: window.sessionStorage.getItem("userId"),
                    ...userWithoutImageLink,
                    ...updatedDetails,
                };

                // await profileApi.editProfile(updatedUser, auth);
                // updateLocalStorage(updatedDetails);
                // getUser();
                setSuccess("Cập nhật thông tin cá nhân thành công.");
                setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [profile]
    );

    const updateUserDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                setLoadingButtonDetails(true);
                // setUser((prevUser) => ({ ...prevUser, ...updatedDetails }));
                setOpen(true);
                await updateDetails(updatedDetails);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingButtonDetails(false);
            }
        },
        [setProfile, updateDetails]
    );

    const uploadImage = useCallback(
        async (newImage: any) => {
            try {
                setSuccess("");
                setError("");
                // const response = await imagesApi.uploadImage(newImage);
                // const { imageLink, ...userWithoutImageLink } = profile;
                // const updatedUser = {
                //     ...userWithoutImageLink,
                //     image: response[0].filePath,
                // };

                // await profileApi.editProfile(updatedUser, auth);
                // updateLocalStorage({
                //     image: response[0].filePath,
                //     imageLink: response[0].fileUrl,
                // });
                // getUser();
                setSuccess("Cập nhật ảnh đại diện thành công.");
                setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [profile]
    );

    const updateUserPicture = useCallback(
        async (newImage: any) => {
            try {
                setLoadingButtonPicture(true);
                // setProfile((prevUser) => ({ ...prevUser, image: newImage }));
                setOpen(true);
                await uploadImage(newImage);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingButtonPicture(false);
            }
        },
        [setProfile, uploadImage]
    );

    return (
        <>
            <Head>
                <title>Thông tin cá nhân</title>
            </Head>
            <Box
                sx={{
                    flexGrow: 1,
                    mt: 0.5,
                    mb: 1,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={2}>
                        <div>
                            <Typography variant="h4">
                                Thông tin cá nhân
                            </Typography>
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6} lg={4}>
                                    <ProfileAvatar
                                        imageLink={profile?.avatar}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        onUpdate={updateUserPicture}
                                        success={success}
                                    />
                                </Grid>
                                <Grid xs={12} md={6} lg={8}>
                                    <ProfileDetail
                                        profile={profile}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        onUpdate={updateUserDetails}
                                        success={success}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <Box
                            sx={{
                                position: "fixed",
                                bottom: "0",
                                right: "0",
                                zIndex: zIndexLevel.four,
                                mb: 2,
                                mr: 2,
                            }}
                        >
                            {success && (
                                <Collapse in={open}>
                                    <Snackbar
                                        open={open}
                                        autoHideDuration={6000}
                                        onClose={() => setOpen(false)}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "center",
                                        }}
                                    >
                                        <Alert
                                            variant="outlined"
                                            severity="success"
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => {
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <CloseIcon fontSize="inherit" />
                                                </IconButton>
                                            }
                                            sx={{
                                                mb: 1.5,
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <Typography
                                                color="success"
                                                variant="subtitle2"
                                            >
                                                {success}
                                            </Typography>
                                        </Alert>
                                    </Snackbar>
                                </Collapse>
                            )}
                            {error && (
                                <Collapse in={open}>
                                    <Snackbar
                                        open={open}
                                        autoHideDuration={6000}
                                        onClose={() => setOpen(false)}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "center",
                                        }}
                                    >
                                        <Alert
                                            variant="outlined"
                                            severity="error"
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => {
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <CloseIcon fontSize="inherit" />
                                                </IconButton>
                                            }
                                            sx={{
                                                mb: 1.5,
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <Typography
                                                color="error"
                                                variant="subtitle2"
                                            >
                                                {error}
                                            </Typography>
                                        </Alert>
                                    </Snackbar>
                                </Collapse>
                            )}
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default Profile;
