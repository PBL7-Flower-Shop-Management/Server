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
import NewOrderInformation from "@/components/Order/NewOrder/NewOrderInformation";
import NewOrderProducts from "@/components/Order/NewOrder/NewOrderProducts";
import _ from "lodash";
import { useLoadingContext } from "@/contexts/LoadingContext";
import UrlConfig from "@/config/UrlConfig";
import { FetchApi } from "@/utils/FetchApi";
import { isIntegerNumber, isNumberic, stripSeconds } from "@/utils/helper";
import { showToast } from "@/components/Toast";
import * as yup from "yup";

const NewOrder = () => {
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [reset, setReset] = useState(false);
    const { setLoading } = useLoadingContext();

    const formik = useFormik<any>({
        initialValues: {
            _id: "",
            orderDate: new Date(),
            shipDate: new Date(),
            shipAddress: "",
            shipPrice: 0,
            discount: 0,
            totalPrice: 0,
            status: "Processing",
            paymentMethod: "",
            note: "",
            username: "",
            orderUserId: "",
            orderDetails: [],
        },
        validationSchema: yup.object({
            username: yup
                .string()
                .trim()
                .nullable()
                .test(
                    "username-valid",
                    "order user is required!",
                    function (value) {
                        return (
                            (this.parent.orderUserId !== null &&
                                this.parent.orderUserId !== undefined &&
                                this.parent.orderUserId.trim() !== "") ||
                            (value !== null &&
                                value !== undefined &&
                                value.trim() !== "")
                        );
                    }
                ),
            orderDate: yup.date().nullable(),
            shipDate: yup
                .date()
                .nullable()
                .test(
                    "is-greater",
                    "Ship date must be greater than order date",
                    function (value) {
                        const { orderDate } = this.parent;
                        if (!orderDate || !value) {
                            return true;
                        }

                        const strippedOrderDate = stripSeconds(orderDate);
                        const strippedShipDate = stripSeconds(value);
                        return strippedShipDate > strippedOrderDate;
                    }
                ),
            shipAddress: yup
                .string()
                .trim()
                .nullable()
                .max(200)
                .matches(
                    /^[\p{L}\d\s\/\-]*$/u,
                    "Ship address only contains characters, number, space, slash and dash!"
                ),
            discount: yup.number().min(0).max(100).default(0),
            shipPrice: yup.number().min(0).default(0),
            paymentMethod: yup.string().trim().nullable(),
            status: yup
                .string()
                .trim()
                .nullable()
                .oneOf(
                    [
                        "Pending payment processing",
                        "Processing",
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                    ],
                    "Invalid order status"
                )
                .default("Processing"),
            note: yup.string().trim().nullable(),
            orderDetails: yup
                .array()
                .of(
                    yup.object({
                        key: yup.number(),
                        _id: yup
                            .string()
                            .trim()
                            .required("Product information is required"),
                        numberOfFlowers: yup
                            .mixed()
                            .test(
                                "numberOfFlowers-valid",
                                "Invalid number of flowers' number format",
                                (value) =>
                                    typeof value === "number" &&
                                    isIntegerNumber(value)
                            )
                            .test(
                                "numberOfFlowers-value valid",
                                "Number of flowers must be greater than 0",
                                (value) => Number(value) > 0
                            )
                            .required("Number of flowers is required"),
                    })
                )
                .min(1, "Order must have at least one product"),
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

    const handleAddProduct = () => {
        const currentProducts = formik.values.orderDetails || [];
        const productsAdd = _.cloneDeep(currentProducts);

        productsAdd.push({
            key:
                productsAdd.length > 0
                    ? productsAdd[productsAdd.length - 1].key + 1
                    : 1,
            _id: null,
            numberOfFlower: "",
        });
        formik.setValues({ ...formik.values, orderDetails: productsAdd });
    };

    const handleDeleteProduct = (index: string) => {
        const currentProducts = formik.values.orderDetails || [];
        let productsDelete = _.cloneDeep(currentProducts);

        productsDelete.splice(index, 1);
        formik.setValues({
            ...formik.values,
            orderDetails: productsDelete,
        });
    };

    const handleSubmit = async () => {
        try {
            setIsFieldDisabled(true);
            setLoadingButtonDetails(true);
            const response = await FetchApi(
                UrlConfig.order.create,
                "POST",
                true,
                {
                    ...formik.values,
                    createdAt: undefined,
                    createdBy: undefined,
                    isDeleted: undefined,
                    id: undefined,
                    _id: undefined,
                    __v: undefined,
                    username:
                        `${formik.values.username}`.trim() !== ""
                            ? formik.values.username
                            : undefined,
                    orderUserId:
                        `${formik.values.orderUserId}`.trim() !== ""
                            ? formik.values.orderUserId
                            : undefined,
                    discount: parseInt(formik.values.discount, 10),
                }
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
                setIsFieldDisabled(false);
            } else if (response.succeeded) {
                showToast("Add new order successfully!", "success");
                formik.setValues({
                    ...response.data,
                    shipDate: new Date(response.data.shipDate),
                    orderDate: new Date(response.data.orderDate),
                });
                setButtonDisabled(true);
            } else {
                showToast(response.message, "error");
                setIsFieldDisabled(false);
            }
        } catch (error: any) {
            showToast(error.message, "error");
            setIsFieldDisabled(false);
            console.log(error);
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const handleAddOtherOrder = () => {
        setButtonDisabled(false);
        setIsFieldDisabled(false);
    };

    const handleReset = (e: any) => {
        formik.handleReset(e);
        setReset(!reset);
        formik.setErrors({});
        formik.setTouched({}, false);
    };

    useEffect(() => {
        const totalProductPrice = formik.values.orderDetails.reduce(
            (acc: number, val: any) => {
                const validNumberOfFlowers = isNumberic(val.numberOfFlowers)
                    ? val.numberOfFlowers
                    : `${val.numberOfFlowers}`.trim() === ""
                    ? 0
                    : NaN;

                const itemTotal = val._id
                    ? val.unitPrice *
                      (1 - val.discount / 100) *
                      validNumberOfFlowers
                    : 0;

                return acc + itemTotal;
            },
            0
        );

        const totalPrice =
            (totalProductPrice + formik.values.shipPrice) *
            (1 - formik.values.discount / 100);

        formik.setFieldValue("totalPrice", parseFloat(totalPrice.toFixed(2)));
    }, [
        formik.values.discount,
        formik.values.shipPrice,
        formik.values.orderDetails,
    ]);

    return (
        <>
            <Head>
                <title>Đơn hàng | Thêm đơn hàng </title>
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
                                            Đơn hàng
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
                                            href="/order"
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
                                                Đơn hàng
                                            </Typography>
                                        </Link>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: "primary.main",
                                            }}
                                        >
                                            Thêm đơn hàng
                                        </Typography>
                                    </Breadcrumbs>
                                )}
                            </div>
                            <div>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={12} lg={12}>
                                        <NewOrderInformation
                                            formik={formik}
                                            loadingSkeleton={loadingSkeleton}
                                            isFieldDisabled={isFieldDisabled}
                                            reset={reset}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={12} lg={12}>
                                        <NewOrderProducts
                                            formik={formik}
                                            loadingSkeleton={loadingSkeleton}
                                            handleAddProduct={handleAddProduct}
                                            handleDeleteProduct={
                                                handleDeleteProduct
                                            }
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
                                                        onClick={(e) => {
                                                            handleReset(e);
                                                            handleAddOtherOrder();
                                                        }}
                                                        size="medium"
                                                        variant="contained"
                                                    >
                                                        Thêm đơn hàng khác
                                                    </LoadingButton>
                                                </>
                                            ) : formik.isSubmitting ||
                                              loadingButtonDetails ? (
                                                <>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails
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
                                                        Thêm đơn hàng
                                                    </LoadingButton>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails
                                                        }
                                                        variant="outlined"
                                                        onClick={(e) => {
                                                            handleReset(e);
                                                        }}
                                                        color="error"
                                                    >
                                                        Khôi phục biểu mẫu
                                                    </Button>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting
                                                        }
                                                        type="submit"
                                                        variant="contained"
                                                    >
                                                        Thêm đơn hàng
                                                    </Button>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails
                                                        }
                                                        variant="outlined"
                                                        component={NextLink}
                                                        onClick={() =>
                                                            setLoading(true)
                                                        }
                                                        href="/order"
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

export default NewOrder;
