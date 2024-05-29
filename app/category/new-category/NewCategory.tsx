"use client";
import Head from "next/head";
import {
    Box,
    Container,
    Skeleton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Breadcrumbs,
    Link,
    Button,
} from "@mui/material";
import NextLink from "next/link";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import NewCategoryInformation from "@/components/Category/NewCategory/NewCategoryInformation";
import { NewCategoryAvatar } from "@/components/Category/NewCategory/NewCategoryImages";
import * as yup from "yup";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { appendJsonToFormData } from "@/utils/helper";
import { showToast } from "@/components/Toast";

const NewCategory = () => {
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { setLoading } = useLoadingContext();

    const formik = useFormik({
        initialValues: {
            categoryName: "",
            description: "",
            avatar: null,
        },
        validationSchema: yup.object({
            categoryName: yup
                .string()
                .trim()
                .required("Category name field is required")
                .matches(
                    /^[\p{L}\d\s\/\-]+$/u,
                    "Category name only contains characters, number, space, slash and dash!"
                ),
            avatar: yup
                .mixed()
                .required("Category avatar field is required!")
                .test(
                    "fileFormat",
                    "Ảnh tải lên không hợp lệ!",
                    (value: any) => {
                        if (value && value.type) {
                            return value.type.startsWith("image/");
                        }
                        return true;
                    }
                ),
            description: yup.string().trim().nullable(),
        }),
        onSubmit: async (values, helpers: any) => {
            try {
                handleSubmit();
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const handleSubmit = async () => {
        try {
            setIsFieldDisabled(true);
            setButtonDisabled(true);
            setLoadingButtonDetails(true);
            const formData = new FormData();
            let isFormData = false;
            if (formik.values.avatar) {
                formData.set("avatar", formik.values.avatar);
                isFormData = true;
            }
            const response = await FetchApi(
                UrlConfig.category.create,
                "POST",
                true,
                isFormData
                    ? appendJsonToFormData(formData, {
                          ...formik.values,
                          avatar: undefined,
                      })
                    : {
                          ...formik.values,
                          avatar: undefined,
                      },
                isFormData
            );
            if (response.canRefreshToken === false) {
                setIsFieldDisabled(false);
                setButtonDisabled(false);
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast("Thêm hạng mục mới thành công.", "success");
                formik.setValues({
                    ...response.data,
                    avatar: formik.values.avatar,
                });
                return true;
            } else {
                setIsFieldDisabled(false);
                setButtonDisabled(false);
                showToast(response.message, "error");
                return false;
            }
        } catch (error: any) {
            setIsFieldDisabled(false);
            setButtonDisabled(false);
            showToast(error.message ?? error, "error");
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const uploadImage = async (newImage: any) => {
        try {
            formik.setValues({
                ...formik.values,
                avatar: newImage,
            });
        } catch (error: any) {
            showToast(error.message ?? error, "error");
        }
    };

    const handleAddOtherCategory = (e: any) => {
        setButtonDisabled(false);
        setIsFieldDisabled(false);
        formik.handleReset(e);
    };

    useEffect(() => setLoading(false), []);

    return (
        <>
            <Head>
                <title>Hạng mục | Thêm hạng mục </title>
            </Head>
            <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
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
                                                        backgroundColor:
                                                            "divider",
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
                                            Thêm hạng mục
                                        </Typography>
                                    </Breadcrumbs>
                                )}
                            </div>
                            <div>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={12} lg={12}>
                                        <NewCategoryAvatar
                                            loadingSkeleton={loadingSkeleton}
                                            loadingButtonDetails={
                                                loadingButtonDetails
                                            }
                                            error={
                                                formik.touched.avatar &&
                                                formik.errors.avatar
                                            }
                                            onUpdate={uploadImage}
                                            isFieldDisabled={isFieldDisabled}
                                            buttonDisabled={buttonDisabled}
                                            reset={!formik.values.avatar}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={12} lg={12}>
                                        <NewCategoryInformation
                                            formik={formik}
                                            loadingSkeleton={loadingSkeleton}
                                            isFieldDisabled={isFieldDisabled}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={12} lg={12}>
                                        <Stack
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            {buttonDisabled ? (
                                                <>
                                                    <LoadingButton
                                                        loading={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails
                                                        }
                                                        onClick={(e) =>
                                                            handleAddOtherCategory(
                                                                e
                                                            )
                                                        }
                                                        size="medium"
                                                        variant="contained"
                                                    >
                                                        Thêm hạng mục khác
                                                    </LoadingButton>
                                                </>
                                            ) : formik.isSubmitting ||
                                              loadingButtonDetails ? (
                                                <>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails ||
                                                            buttonDisabled
                                                        }
                                                        variant="outlined"
                                                        color="error"
                                                    >
                                                        Khôi phục biểu mẫu
                                                    </Button>
                                                    <LoadingButton
                                                        disabled
                                                        loading={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails
                                                        }
                                                        size="medium"
                                                        variant="contained"
                                                    >
                                                        Thêm hạng mục
                                                    </LoadingButton>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails ||
                                                            buttonDisabled
                                                        }
                                                        variant="outlined"
                                                        onClick={
                                                            formik.handleReset
                                                        }
                                                        color="error"
                                                    >
                                                        Khôi phục biểu mẫu
                                                    </Button>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            buttonDisabled
                                                        }
                                                        type="submit"
                                                        variant="contained"
                                                    >
                                                        Thêm hạng mục
                                                    </Button>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails ||
                                                            buttonDisabled
                                                        }
                                                        variant="outlined"
                                                        component={NextLink}
                                                        onClick={() =>
                                                            setLoading(true)
                                                        }
                                                        href="/category"
                                                    >
                                                        Huỷ
                                                    </Button>
                                                </>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </div>
                        </Stack>
                    </Container>
                </Box>
            </form>
        </>
    );
};

export default NewCategory;
