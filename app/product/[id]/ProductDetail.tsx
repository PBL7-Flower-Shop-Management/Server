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
    Button,
    CardActions,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams } from "next/navigation";
import ProductInformation from "@/components/Product/Detail/ProductInformation";
import ProductImages from "@/components/Product/Detail/ProductImages";
import { useFormik } from "formik";
import * as yup from "yup";
import mongoose from "mongoose";
import {
    allowedImageExtensions,
    allowedVideoExtensions,
    MAX_SIZE_IMAGE,
    MAX_SIZE_VIDEO,
} from "@/utils/constants";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "@/components/Toast";
import { LoadingButton } from "@mui/lab";
import { appendJsonToFormData, getMimeType } from "@/utils/helper";

const ProductDetail = ({ params }: any) => {
    const [originalproduct, setOriginalProduct] = useState<any>();
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const searchParams = useSearchParams();
    const productId = params?.id;
    const canEdit = searchParams.get("edit") === "1";
    const { setLoading } = useLoadingContext();
    const [changesMade, setChangesMade] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);

    const formik = useFormik({
        initialValues: {} as any,
        validationSchema: yup.object({
            _id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid flower id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
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
                .min(0)
                .default(0),
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
                .default(0)
                .test(
                    "quantity-valid",
                    "quantity field can't be less than sold quantiy field",
                    function (value) {
                        if (
                            value === undefined ||
                            this.parent.soldQuantity === undefined
                        ) {
                            if (!value && this.parent.soldQuantity > 0)
                                return false;
                            return true;
                        }
                        return value >= this.parent.soldQuantity;
                    }
                ),
            soldQuantity: yup.number().integer().min(0).default(0),
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
                    function (value) {
                        if (value) {
                            return (
                                value.filter(
                                    (v) =>
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
                    function (value) {
                        if (value) {
                            return new Set(value).size === value.length;
                        }
                        return true;
                    }
                ),
        }),

        onSubmit: async (values, helpers: any) => {
            try {
                console.log(values);
                if (changesMade) {
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

    const getProduct = async () => {
        setLoading(true);
        setLoadingSkeleton(true);

        const response = await FetchApi(
            UrlConfig.flower.getById.replace("{id}", productId),
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            formik.setValues({
                ...response.data,
                category: [...response.data.category.map((c: any) => c._id)],
            });
            setOriginalProduct({
                ...response.data,
                category: [...response.data.category.map((c: any) => c._id)],
            });
            setLoadingSkeleton(false);
        } else {
            showToast(response.message, "error");
        }
        setLoading(false);
    };

    const handleAddImage = (file: any) => {
        formik.setValues({
            ...formik.values,
            imageVideoFiles: [...formik.values.imageVideoFiles, file],
        });
        setChangesMade(true);
    };

    const handleRemoveImage = async (file: any) => {
        try {
            formik.setValues({
                ...formik.values,
                imageVideoFiles: formik.values.imageVideoFiles.filter(
                    (media: any) =>
                        file.public_id
                            ? media.public_id !== file.public_id
                            : media.uid !== file.uid
                ),
            });
        } catch (e) {
            console.error(e);
        }
        setChangesMade(true);
    };

    const updateInformation = async () => {
        try {
            setIsFieldDisabled(true);
            setLoadingButtonDetails(true);
            const formData = new FormData();
            let isFormData = false;
            let listImageVideoUrl = [];
            if (formik.values.imageVideoFiles.length > 0) {
                for (const image of formik.values.imageVideoFiles) {
                    if (image instanceof File)
                        formData.append("imageVideoFiles", image);
                    else listImageVideoUrl.push(image);
                }
                isFormData = formData.get("imageVideoFiles") !== "null";
            }
            const response = await FetchApi(
                UrlConfig.flower.update,
                "PUT",
                true,
                isFormData
                    ? appendJsonToFormData(formData, {
                          ...formik.values,
                          imageVideoFiles: listImageVideoUrl,
                          status: undefined,
                          starsTotal: undefined,
                          feedbacksTotal: undefined,
                          unitPrice: Number(formik.values.unitPrice),
                          discount: Number(formik.values.discount),
                          quantity: Number(formik.values.quantity),
                      })
                    : {
                          ...formik.values,
                          imageVideoFiles: listImageVideoUrl,
                          status: undefined,
                          starsTotal: undefined,
                          feedbacksTotal: undefined,
                          unitPrice: Number(formik.values.unitPrice),
                          discount: Number(formik.values.discount),
                          quantity: Number(formik.values.quantity),
                      },
                isFormData
            );
            if (response.canRefreshToken === false) {
                setIsFieldDisabled(false);
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast("Cập nhật sản phẩm thành công.", "success");
                formik.setValues({
                    ...response.data,
                    // imageVideoFiles: formik.values.imageVideoFiles,
                });
                return true;
            } else {
                setIsFieldDisabled(false);
                showToast(response.message, "error");
                return false;
            }
        } catch (error: any) {
            setIsFieldDisabled(false);
            showToast(error.message ?? error, "error");
            return false;
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const handleChange = (name: string, value: any) => {
        formik.setFieldValue(name, value);
        setChangesMade(true);
    };

    const handleClick = () => {
        setOriginalProduct(formik.values);
        setIsFieldDisabled(false);
        setChangesMade(false);
    };

    const handleCancel = () => {
        formik.setValues(originalproduct);
        setIsFieldDisabled(true);
        setChangesMade(false);
    };

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => console.log(formik.errors), [formik.errors]);
    return (
        <>
            <Head>
                <title>Sản phẩm | {originalproduct?.name}</title>
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
                                                    backgroundColor: "divider",
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
                                        {originalproduct?.name}
                                    </Typography>
                                </Breadcrumbs>
                            )}
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={12} lg={12}>
                                    <ProductInformation
                                        formik={formik}
                                        handleChange={handleChange}
                                        loadingSkeleton={loadingSkeleton}
                                        isFieldDisabled={isFieldDisabled}
                                    />
                                </Grid>
                                <Grid xs={12} md={12} lg={12}>
                                    <ProductImages
                                        formik={formik}
                                        loadingSkeleton={loadingSkeleton}
                                        handleAddImage={handleAddImage}
                                        handleRemoveImage={handleRemoveImage}
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

export default ProductDetail;
