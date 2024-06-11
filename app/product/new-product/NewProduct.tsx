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
import * as yup from "yup";
import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import NewProductInformation from "@/components/Product/NewProduct/NewProductInformation";
import NewProductImages from "@/components/Product/NewProduct/NewProductImages";
import { useLoadingContext } from "@/contexts/LoadingContext";
import mongoose from "mongoose";
import UrlConfig from "@/config/UrlConfig";
import { FetchApi } from "@/utils/FetchApi";
import { appendJsonToFormData } from "@/utils/helper";
import { showToast } from "@/components/Toast";
import {
    allowedImageExtensions,
    allowedVideoExtensions,
    MAX_SIZE_IMAGE,
    MAX_SIZE_VIDEO,
    productStatus,
} from "@/utils/constants";

const NewProduct = () => {
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [reset, setReset] = useState(false);
    const { setLoading } = useLoadingContext();

    const formik = useFormik({
        initialValues: {
            name: "",
            category: [],
            habitat: "",
            care: "",
            unitPrice: "",
            discount: "",
            quantity: "",
            imageVideoFiles: [] as any,
            description: "",
            status: productStatus["Out of stock"],
            growthTime: "",
        },
        validationSchema: yup.object({
            name: yup
                .string()
                .trim()
                .required("Flower name field is required")
                .matches(
                    /^[\p{L} _-]+$/u,
                    "Flower name only contains characters, number, space, slash and dash!"
                ),
            habitat: yup.string().trim().nullable(),
            growthTime: yup.string().trim().nullable(),
            care: yup.string().trim().nullable(),
            unitPrice: yup
                .number()
                .typeError("unitPrice must be a number")
                .required("unitPrice is required")
                .positive("unitPrice must greater than 0")
                .typeError("unitPrice must be a number"),
            discount: yup
                .number()
                .typeError("discount must be a number")
                .min(0)
                .max(100)
                .default(0),
            quantity: yup
                .number()
                .typeError("quantity must be a number")
                .integer()
                .min(0)
                .default(0),
            imageVideoFiles: yup
                .array()
                .nullable()
                .test(
                    "imageVideo-valid",
                    "File is not an image or video",
                    function (value: any) {
                        if (value) {
                            return (
                                value.filter(
                                    (v: any) =>
                                        v.type &&
                                        !v.type.startsWith("image") &&
                                        !v.type.startsWith("video")
                                ).length === 0
                            );
                        }
                        return true;
                    }
                )
                .test(
                    "imageVideo-valid2",
                    `File format not allowed, only allow (${allowedImageExtensions.join(
                        ", "
                    )}, ${allowedVideoExtensions.join(", ")})`,
                    function (value: any) {
                        if (value) {
                            return (
                                value.filter(
                                    (v: any) =>
                                        v.type &&
                                        !(
                                            (v.type.startsWith("image") &&
                                                allowedImageExtensions.includes(
                                                    v.type.split("/")[1]
                                                )) ||
                                            (v.type.startsWith("video") &&
                                                allowedVideoExtensions.includes(
                                                    v.type.split("/")[1]
                                                ))
                                        )
                                ).length === 0
                            );
                        }
                        return true;
                    }
                )
                .test(
                    "imageVideo-valid",
                    "File size exceeds the allowable limit",
                    function (value: any) {
                        if (value) {
                            return (
                                value.filter(
                                    (v: any) =>
                                        v.type &&
                                        !(
                                            (v.type.startsWith("image") &&
                                                v.size <= MAX_SIZE_IMAGE) ||
                                            (v.type.startsWith("video") &&
                                                v.size <= MAX_SIZE_VIDEO)
                                        )
                                ).length === 0
                            );
                        }
                        return true;
                    }
                ),
            description: yup.string().trim().nullable(),
            category: yup
                .array()
                .nullable()
                .test(
                    "categoryIds-valid",
                    "Invalid category id format in list of category ids",
                    function (value: any) {
                        if (value) {
                            return (
                                value.filter(
                                    (v: any) =>
                                        typeof v !== "string" ||
                                        v.trim() === "" ||
                                        !mongoose.Types.ObjectId.isValid(v)
                                ).length === 0
                            );
                        }
                        return true;
                    }
                )
                .test(
                    "categoryIds-distinct",
                    "There can't be two categories that overlap",
                    function (value: any) {
                        if (value) {
                            return new Set(value).size === value.length;
                        }
                        return true;
                    }
                ),
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

    const handleAddImage = (file: any) => {
        formik.setValues({
            ...formik.values,
            imageVideoFiles: [...formik.values.imageVideoFiles, file],
        });
    };

    const handleRemoveImage = async (file: any) => {
        try {
            formik.setValues({
                ...formik.values,
                imageVideoFiles: formik.values.imageVideoFiles.filter(
                    (media: any) => media.uid !== file.uid
                ),
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async () => {
        console.log(formik.values);
        try {
            setIsFieldDisabled(true);
            setButtonDisabled(true);
            setLoadingButtonDetails(true);
            const formData = new FormData();
            let isFormData = false;
            if (formik.values.imageVideoFiles.length > 0) {
                for (const image of formik.values.imageVideoFiles)
                    formData.append("imageVideoFiles", image);
                isFormData = true;
            }
            const response = await FetchApi(
                UrlConfig.flower.create,
                "POST",
                true,
                isFormData
                    ? appendJsonToFormData(formData, {
                          ...formik.values,
                          imageVideoFiles: undefined,
                          status: undefined,
                          unitPrice: Number(formik.values.unitPrice),
                          discount: Number(formik.values.discount),
                          quantity: Number(formik.values.quantity),
                      })
                    : {
                          ...formik.values,
                          imageVideoFiles: [],
                          status: undefined,
                          unitPrice: Number(formik.values.unitPrice),
                          discount: Number(formik.values.discount),
                          quantity: Number(formik.values.quantity),
                      },
                isFormData
            );
            if (response.canRefreshToken === false) {
                setIsFieldDisabled(false);
                setButtonDisabled(false);
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                setReset(!reset);
                showToast("Thêm sản phẩm mới thành công.", "success");
                formik.setValues({
                    ...response.data,
                    // imageVideoFiles: formik.values.imageVideoFiles,
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

    const handleAddOtherProduct = (e: any) => {
        setButtonDisabled(false);
        setIsFieldDisabled(false);
        formik.handleReset(e);
    };

    useEffect(() => setLoading(false), []);

    useEffect(() => console.log(formik.errors), [formik.errors]);

    return (
        <>
            <Head>
                <title>Sản phẩm | Thêm sản phẩm </title>
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
                                            Sản phẩm
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
                                            href="/product"
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
                                                Sản phẩm
                                            </Typography>
                                        </Link>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: "primary.main",
                                            }}
                                        >
                                            Thêm sản phẩm
                                        </Typography>
                                    </Breadcrumbs>
                                )}
                            </div>
                            <div>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={12} lg={12}>
                                        <NewProductInformation
                                            formik={formik}
                                            loadingSkeleton={loadingSkeleton}
                                            isFieldDisabled={isFieldDisabled}
                                            reset={reset}
                                        />
                                    </Grid>

                                    <Grid xs={12} md={12} lg={12}>
                                        <NewProductImages
                                            formik={formik}
                                            loadingSkeleton={loadingSkeleton}
                                            handleAddImage={handleAddImage}
                                            handleRemoveImage={
                                                handleRemoveImage
                                            }
                                            isFieldDisabled={isFieldDisabled}
                                            reset={reset}
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
                                                        onClick={(e) => {
                                                            handleAddOtherProduct(
                                                                e
                                                            );
                                                            setReset(!reset);
                                                        }}
                                                        size="medium"
                                                        variant="contained"
                                                    >
                                                        Thêm sản phẩm khác
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
                                                        Thêm sản phẩm
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
                                                        onClick={(e) => {
                                                            setReset(!reset);
                                                            formik.handleReset(
                                                                e
                                                            );
                                                        }}
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
                                                        Thêm sản phẩm
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
                                                        href="/product"
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

export default NewProduct;
