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
import OrderInformation from "@/components/Order/Detail/OrderInformation";
import { OrderAvatar } from "@/components/Order/Detail/OrderAvatar";

const OrderDetail = ({ params }: any) => {
    const [order, setOrder] = useState<any>(null);
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonPicture, setLoadingButtonPicture] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const orderId = params?.id;
    const orderName = searchParams.get("name");
    const canEdit = searchParams.get("edit") === "1";
    const [open, setOpen] = useState(true);

    const getOrder = useCallback(async () => {
        setLoadingSkeleton(true);
        setError("");
        try {
            // const order = await ordersApi.getOrderById(
            //     orderId,
            //     auth
            // );
            const order = {
                _id: "6159f6a23603a45f08268eb9",
                orderDate: "2024-04-29T12:00:00Z",
                shipDate: "2024-07-30T12:00:00Z",
                shipAddress: "456 Elm St",
                shipPrice: 15,
                discount: 0,
                totalPrice: 200,
                status: "Shipped",
                paymentMethod: "PayPal",
                note: "Customer requested fast shipping",
                username: "DangHoan",
                orderDetails: [
                    {
                        _id: "663854104a2729c881f9d18f",
                        name: "Lobster - Tail 6 Oz",
                        unitPrice: 13,
                        discount: 3,
                        numberOfFlowers: 10,
                        image: "https://happyflower.vn/app/uploads/2019/12/RoseMixBaby-1024x1024.jpg",
                    },
                    {
                        _id: "663052f124e3cdd3e58c1e73",
                        name: "Fenngreek Seed",
                        unitPrice: 30,
                        discount: 0,
                        numberOfFlowers: 20,
                        image: "https://th.bing.com/th/id/R.f852bb117e8734ca0d7507781d76ad2e?rik=VtL1rYEsidWJsA&pid=ImgRaw&r=0",
                    },
                ],
            };
            setOrder(order);
            console.log(order);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoadingSkeleton(false);
        }
    }, []);

    useEffect(() => {
        getOrder();
    }, []);

    const updateDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                const updatedOrder = {
                    id: orderId, // dung params de truyen id
                    ...order,
                    ...updatedDetails,
                };

                const {
                    relatedCases,
                    charge,
                    isWantedOrder,
                    wantedOrders,
                    avatarLink,
                    ...updated
                } = updatedOrder;
                // console.log(updated);
                // await ordersApi.editOrder(updated, auth);
                // getOrder();
                setSuccess("Cập nhật thông tin chi tiết tội phạm thành công.");
                setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [order]
    );

    const updateOrderDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                setLoadingButtonDetails(true);
                setOrder((prevOrder: any) => ({
                    ...prevOrder,
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
        [setOrder, updateDetails]
    );

    const uploadImage = useCallback(
        async (newImage: any) => {
            try {
                // const response = await imagesApi.uploadImage(newImage);
                // const updatedOrder = {
                //     id: orderId,
                //     ...order,
                //     avatar: response[0].filePath,
                // };
                // const {
                //     relatedCases,
                //     charge,
                //     isWantedOrder,
                //     wantedOrders,
                //     avatarLink,
                //     ...updated
                // } = updatedOrder;
                // // console.log(updated);
                // // await ordersApi.editOrder(updated, auth);
                // // getOrder();
                // setSuccess("Cập nhật ảnh đại diện tội phạm thành công.");
                // setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [order]
    );

    const updateOrderPicture = useCallback(
        async (newImage: any) => {
            try {
                setLoadingButtonPicture(true);
                setOrder((prevOrder: any) => ({
                    ...prevOrder,
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
        [setOrder, uploadImage]
    );

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
                                    {/* <OrderAvatar
                                        imageLink={order?.imageVideoFiles[0]}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        onUpdate={updateOrderPicture}
                                        success={success}
                                    /> */}
                                </Grid>

                                <Grid xs={12} md={12} lg={12}>
                                    <OrderInformation
                                        order={order}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        handleSubmit={updateOrderDetails}
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

export default OrderDetail;
