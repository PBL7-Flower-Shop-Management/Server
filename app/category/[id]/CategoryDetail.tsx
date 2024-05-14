"use client";
import Head from "next/head";
import NextLink from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
    Alert,
    Box,
    Breadcrumbs,
    Collapse,
    Container,
    IconButton,
    Skeleton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams } from "next/navigation";
import CategoryInformation from "@/components/Category/Detail/CategoryInformation";
import { CategoryAvatar } from "@/components/Category/Detail/CategoryAvatar";
import { isValidUrl } from "@/utils/helper";

const CategoryDetail = ({ params }: any) => {
    const [category, setCategory] = useState<any>(null);
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonPicture, setLoadingButtonPicture] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const categoryId = params?.id;
    const categoryName = searchParams.get("name");
    const canEdit = searchParams.get("edit") === "1";
    const [open, setOpen] = useState(true);

    const getCategory = useCallback(async () => {
        setLoadingSkeleton(true);
        setError("");
        try {
            // const category = await categorysApi.getCategoryById(
            //     categoryId,
            //     auth
            // );
            const category = {
                _id: "663047485c22d11402fcc6d3",
                categoryName: "Hoa trồng vườn",
                image: "https://th.bing.com/th/id/OIP.f-FXUJ0aDZgeT7USzI7CUgHaKW?rs=1&pid=ImgDetMain",
                description:
                    "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
                createdAt: "2024-04-01T00:00:00Z",
                createdBy: "Merl",
            };
            setCategory(category);
            console.log(category);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoadingSkeleton(false);
        }
    }, []);

    useEffect(() => {
        getCategory();
    }, []);

    const updateDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                const updatedCategory = {
                    id: categoryId, // dung params de truyen id
                    ...category,
                    ...updatedDetails,
                };

                const {
                    relatedCases,
                    charge,
                    isWantedCategory,
                    wantedCategorys,
                    avatarLink,
                    ...updated
                } = updatedCategory;
                // console.log(updated);
                // await categorysApi.editCategory(updated, auth);
                // getCategory();
                setSuccess("Cập nhật thông tin chi tiết tội phạm thành công.");
                setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [category]
    );

    const updateCategoryDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                setLoadingButtonDetails(true);
                setCategory((prevCategory: any) => ({
                    ...prevCategory,
                    ...updatedDetails,
                }));
                setOpen(true);
                await updateDetails(updatedDetails);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingButtonDetails(false);
            }
        },
        [setCategory, updateDetails]
    );

    const uploadImage = useCallback(
        async (newImage: any) => {
            try {
                // const response = await imagesApi.uploadImage(newImage);
                // const updatedCategory = {
                //     id: categoryId,
                //     ...category,
                //     avatar: response[0].filePath,
                // };
                // const {
                //     relatedCases,
                //     charge,
                //     isWantedCategory,
                //     wantedCategorys,
                //     avatarLink,
                //     ...updated
                // } = updatedCategory;
                // // console.log(updated);
                // // await categorysApi.editCategory(updated, auth);
                // // getCategory();
                // setSuccess("Cập nhật ảnh đại diện tội phạm thành công.");
                // setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [category]
    );

    const updateCategoryPicture = useCallback(
        async (newImage: any) => {
            try {
                setLoadingButtonPicture(true);
                setCategory((prevCategory: any) => ({
                    ...prevCategory,
                    avatar: newImage,
                }));
                setOpen(true);
                await uploadImage(newImage);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingButtonPicture(false);
            }
        },
        [setCategory, uploadImage]
    );

    return (
        <>
            <Head>
                <title>Hạng mục | {category?.name}</title>
            </Head>
            <Box
                sx={{
                    flexGrow: 1,
                    mb: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={0} pb={1}>
                        <div>
                            {loadingSkeleton ? (
                                <Skeleton variant="rounded">
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            mb: 2.5,
                                        }}
                                    >
                                        Hạng mục
                                    </Typography>
                                </Skeleton>
                            ) : (
                                <Breadcrumbs
                                    sx={{
                                        mb: 1.5,
                                    }}
                                    separator="›"
                                    aria-label="breadcrumb"
                                >
                                    <Link
                                        component={NextLink}
                                        underline="none"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                        href="/category"
                                        color="text.primary"
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                marginLeft: "-8px",
                                                marginRight: "-8px",
                                                padding: "6px 8px",
                                                "&:hover": {
                                                    transition:
                                                        "0.2s all ease-in-out",
                                                    backgroundColor: "divider",
                                                    padding: "6px 8px",
                                                    borderRadius: "8px",
                                                },
                                            }}
                                        >
                                            Hạng mục
                                        </Typography>
                                    </Link>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: "primary.main",
                                        }}
                                    >
                                        {category?.categoryName}
                                    </Typography>
                                </Breadcrumbs>
                            )}
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={12} lg={12}>
                                    <CategoryAvatar
                                        imageLink={
                                            isValidUrl(category?.image)
                                                ? category?.image
                                                : undefined
                                        }
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        onUpdate={updateCategoryPicture}
                                        success={success}
                                    />
                                </Grid>

                                <Grid xs={12} md={12} lg={12}>
                                    <CategoryInformation
                                        category={category}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        handleSubmit={updateCategoryDetails}
                                        canEdit={canEdit}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            {success && (
                                <Collapse in={open}>
                                    {open && (
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
                                                mt: 2,
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
                                    )}
                                </Collapse>
                            )}
                            {error && (
                                <Collapse in={open}>
                                    {open && (
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
                                                mt: 2,
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
                                    )}
                                </Collapse>
                            )}
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default CategoryDetail;
