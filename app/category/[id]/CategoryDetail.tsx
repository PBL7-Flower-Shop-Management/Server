"use client";
import Head from "next/head";
import NextLink from "next/link";
import { useState, useEffect, useRef } from "react";
import {
    Box,
    Breadcrumbs,
    Container,
    Skeleton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Link,
    Button,
    CardActions,
    Divider,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import CategoryInformation from "@/components/Category/Detail/CategoryInformation";
import { CategoryAvatar } from "@/components/Category/Detail/CategoryAvatar";
import { appendJsonToFormData } from "@/utils/helper";
import * as yup from "yup";
import { useLoadingContext } from "@/contexts/LoadingContext";
import mongoose from "mongoose";
import { useFormik } from "formik";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "@/components/Toast";
import { LoadingButton } from "@mui/lab";

const CategoryDetail = ({ params }: any) => {
    const [originalCategory, setOriginalCategory] = useState<any>();
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const alreadyRun = useRef(false);
    const { setLoading } = useLoadingContext();
    const [changesMade, setChangesMade] = useState(false);

    const searchParams = useSearchParams();
    const categoryId = params?.id;
    const canEdit = searchParams.get("edit") === "1";
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);

    const formik = useFormik({
        initialValues: {} as any,
        validationSchema: yup.object({
            _id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid category id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
            categoryName: yup
                .string()
                .trim()
                .required("Category name field is required")
                .matches(
                    /^[\p{L}\d\s\/\-]+$/u,
                    "Category name only contains characters, number, space, slash and dash!"
                ),
            avatarUrl: yup.string().trim().nullable(),
            description: yup.string().trim().nullable(),
            avatar: yup
                .mixed()
                .nullable()
                .test(
                    "fileFormat",
                    "Ảnh tải lên không hợp lệ!",
                    (value: any) => {
                        if (value && value.type) {
                            return value.type.startsWith("image/");
                        }
                        return true;
                    }
                )
                .test(
                    "require_avatar",
                    "Category avatar field is required!",
                    (value) => {
                        if (value || value === undefined) return true;
                        return false;
                    }
                ),
        }),

        onSubmit: async (values, helpers: any) => {
            try {
                console.log(values);
                if (changesMade || formik.values.avatar) {
                    setIsFieldDisabled(true);
                    const res = await updateInformation();
                    setIsFieldDisabled(res);
                } else setIsFieldDisabled(true);
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const getCategory = async () => {
        setLoading(true);
        setLoadingSkeleton(true);

        const response = await FetchApi(
            UrlConfig.category.getById.replace("{id}", categoryId),
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            formik.setValues(response.data);
            setOriginalCategory(response.data);
            setLoadingSkeleton(false);
        } else {
            showToast(response.message, "error");
        }
        setLoading(false);
    };

    const updateInformation = async () => {
        try {
            setLoadingButtonDetails(true);
            const formData = new FormData();
            let isFormData = false;
            if (formik.values.avatar || formik.values.avatar === null) {
                formData.set("avatar", formik.values.avatar);
                isFormData = true;
            }

            const response = await FetchApi(
                UrlConfig.category.update,
                "PUT",
                true,
                isFormData
                    ? appendJsonToFormData(formData, {
                          ...formik.values,
                          avatarUrl: undefined,
                          avatar: undefined,
                      })
                    : {
                          ...formik.values,
                          avatar: undefined,
                      },
                isFormData
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast(
                    "Cập nhật thông tin chi tiết tài khoản thành công.",
                    "success"
                );
                formik.setValues(response.data);
                setOriginalCategory({
                    ...originalCategory,
                    categoryName: response.data.categoryName,
                });
                return true;
            } else {
                showToast(response.message, "error");
                return false;
            }
        } catch (error: any) {
            showToast(error.message, "error");
            return false;
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const handleChange = (e: any) => {
        formik.handleChange(e);
        setChangesMade(true);
    };

    const handleClick = () => {
        setOriginalCategory(formik.values);
        setIsFieldDisabled(false);
        setChangesMade(false);
    };

    const handleCancel = () => {
        formik.setValues(originalCategory);
        setIsFieldDisabled(true);
        setChangesMade(false);
    };

    useEffect(() => {
        if (!alreadyRun.current) {
            alreadyRun.current = true;
            getCategory();
        }
    }, []);

    return (
        <>
            <Head>
                <title>Hạng mục | {originalCategory?.categoryName}</title>
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
                                        onClick={() => setLoading(true)}
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
                                        {originalCategory?.categoryName}
                                    </Typography>
                                </Breadcrumbs>
                            )}
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={12} lg={12}>
                                    <CategoryAvatar
                                        formik={formik}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        isFieldDisabled={isFieldDisabled}
                                    />
                                </Grid>

                                <Grid xs={12} md={12} lg={12}>
                                    <CategoryInformation
                                        formik={formik}
                                        handleChange={handleChange}
                                        loadingSkeleton={loadingSkeleton}
                                        isFieldDisabled={isFieldDisabled}
                                    />
                                    <Divider />
                                    {canEdit && (
                                        <CardActions
                                            sx={{
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            {loadingSkeleton ? (
                                                <>
                                                    <Skeleton
                                                        height={40}
                                                        width={170}
                                                        variant="rounded"
                                                    ></Skeleton>
                                                    <Skeleton
                                                        height={40}
                                                        width={170}
                                                        variant="rounded"
                                                    ></Skeleton>
                                                </>
                                            ) : loadingButtonDetails ? (
                                                <>
                                                    <LoadingButton
                                                        disabled
                                                        loading={
                                                            loadingButtonDetails
                                                        }
                                                        size="medium"
                                                        variant="contained"
                                                    >
                                                        Chỉnh sửa thông tin
                                                    </LoadingButton>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            if (isFieldDisabled)
                                                                handleClick();
                                                            else
                                                                formik.handleSubmit();
                                                        }}
                                                        disabled={
                                                            loadingButtonDetails
                                                        }
                                                    >
                                                        {isFieldDisabled
                                                            ? "Chỉnh sửa thông tin"
                                                            : "Cập nhật thông tin"}
                                                    </Button>
                                                    {!isFieldDisabled && (
                                                        <Button
                                                            variant="outlined"
                                                            onClick={
                                                                handleCancel
                                                            }
                                                            disabled={
                                                                loadingButtonDetails
                                                            }
                                                        >
                                                            Hủy
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </CardActions>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default CategoryDetail;
