"use client";
import Head from "next/head";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import {
    Box,
    Breadcrumbs,
    Container,
    Skeleton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Link,
    Divider,
    CardActions,
    Button,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import OrderInformation from "@/components/Order/Detail/OrderInformation";
import OrderProducts from "@/components/Order/Detail/OrderProducts";
import _ from "lodash";
import { useLoadingContext } from "@/contexts/LoadingContext";
import UrlConfig from "@/config/UrlConfig";
import { FetchApi } from "@/utils/FetchApi";
import { showToast } from "@/components/Toast";
import * as yup from "yup";
import { isIntegerNumber, isNumberic, stripSeconds } from "@/utils/helper";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { orderStatusMap } from "@/utils/constants";

const OrderDetail = ({ params }: any) => {
    const [order, setOrder] = useState<any>(null);
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const { setLoading } = useLoadingContext();
    const searchParams = useSearchParams();
    const orderId = params?.id;
    const canEdit = searchParams.get("edit") === "1";
    const [changesMade, setChangesMade] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);
    const router = useRouter();

    const formik = useFormik<any>({
        initialValues: {} as any,
        validationSchema: yup.object({
            username: yup
                .string()
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
                            .required("Product information is required"),
                        quantity: yup.number(),
                        soldQuantity: yup.number(),
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
                            .test(
                                "numberOfFlowers-maxvalue valid",
                                "Number of flowers must be less than remain quantity of product",
                                function (value) {
                                    return (
                                        Number(value) <=
                                        this.parent.quantity -
                                            this.parent.soldQuantity
                                    );
                                }
                            )
                            .required("Number of flowers is required"),
                    })
                )
                .min(1, "Order must have at least one product"),
        }),
        onSubmit: async (values, helpers: any) => {
            try {
                console.log(changesMade);
                if (changesMade) {
                    setIsFieldDisabled(true);
                    const res = await handleSubmit();
                    setIsFieldDisabled(res);
                } else setIsFieldDisabled(true);
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
                UrlConfig.order.update,
                "PUT",
                true,
                {
                    ...formik.values,
                    createdAt: undefined,
                    updatedAt: undefined,
                    createdBy: undefined,
                    updatedBy: undefined,
                    isDeleted: undefined,
                    __v: undefined,
                    username: undefined,
                    orderUserId: undefined,
                    discount: parseInt(formik.values.discount, 10),
                    shipPrice: parseFloat(formik.values.shipPrice),
                }
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
                setIsFieldDisabled(false);
                return false;
            } else if (response.succeeded) {
                showToast("Update order successfully!", "success");
                formik.setValues({
                    ...response.data,
                    shipDate: new Date(response.data.shipDate),
                    orderDate: new Date(response.data.orderDate),
                });
                return true;
            } else {
                showToast(response.message, "error");
                setIsFieldDisabled(false);
                return false;
            }
        } catch (error: any) {
            showToast(error.message, "error");
            setIsFieldDisabled(false);
            console.log(error);
            return false;
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const getOrder = async () => {
        setLoadingSkeleton(true);
        try {
            const response = await FetchApi(
                UrlConfig.order.getById.replace("{id}", orderId),
                "GET",
                true
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
            } else if (response.succeeded) {
                formik.setValues({
                    ...response.data,
                    shipDate: new Date(response.data.shipDate),
                    orderDate: new Date(response.data.orderDate),
                    orderDetails: response.data.orderDetails.map(
                        (o: any, index: number) => {
                            return { ...o, key: index };
                        }
                    ),
                });
                setOrder({
                    ...response.data,
                    shipDate: new Date(response.data.shipDate),
                    orderDate: new Date(response.data.orderDate),
                    orderDetails: response.data.orderDetails.map(
                        (o: any, index: number) => {
                            return { ...o, key: index };
                        }
                    ),
                });
            } else {
                showToast(response.message, "error");
            }
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setLoadingSkeleton(false);
            setLoading(false);
        }
    };

    const handleChange = (name: string, value: any) => {
        formik.setFieldValue(name, value);
        setChangesMade(true);
    };

    const handleClick = () => {
        setOrder(formik.values);
        setIsFieldDisabled(false);
        setChangesMade(false);
    };

    const handleCancel = () => {
        formik.setValues(order);
        setIsFieldDisabled(true);
        setChangesMade(false);
    };

    useEffect(() => {
        setLoading(true);
        getOrder();
    }, []);

    useEffect(() => {
        if (canEdit) {
            if (order)
                if (order.status === orderStatusMap.Delivered) {
                    showToast(
                        "Order that has been delivered cannot be edited!",
                        "error"
                    );
                    setIsFieldDisabled(true);
                    router.push("/order/" + orderId);
                }
        }
    }, [canEdit, order]);

    useEffect(() => {
        if (formik.values) {
            const totalProductPrice = formik.values.orderDetails?.reduce(
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
                (totalProductPrice + parseFloat(formik.values.shipPrice)) *
                (1 - formik.values.discount / 100);

            formik.setFieldValue(
                "totalPrice",
                parseFloat(totalPrice.toFixed(2))
            );
        }
    }, [
        formik.values.discount,
        formik.values.shipPrice,
        formik.values.orderDetails,
    ]);

    return (
        <>
            <Head>
                <title>Đơn hàng | {order?.name}</title>
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
                                                    backgroundColor: "divider",
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
                                        {order?._id}
                                    </Typography>
                                </Breadcrumbs>
                            )}
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={12} lg={12}>
                                    <OrderInformation
                                        formik={formik}
                                        handleChange={handleChange}
                                        loadingSkeleton={loadingSkeleton}
                                        isFieldDisabled={isFieldDisabled}
                                    />
                                </Grid>
                                <Grid xs={12} md={12} lg={12}>
                                    <OrderProducts
                                        formik={formik}
                                        handleChange={() =>
                                            setChangesMade(true)
                                        }
                                        loadingSkeleton={loadingSkeleton}
                                        handleAddProduct={handleAddProduct}
                                        handleDeleteProduct={
                                            handleDeleteProduct
                                        }
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

export default OrderDetail;
