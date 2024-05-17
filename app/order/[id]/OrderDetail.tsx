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
import OrderProducts from "@/components/Order/Detail/OrderProducts";
import _ from "lodash";

const OrderDetail = ({ params }: any) => {
    const [order, setOrder] = useState<any>(null);
    const [products, setProducts] = useState<any>(null);
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
                        _id: "6630456bfc13ae1b64a24111",
                        name: "Lobster - Tail 6 Oz",
                        unitPrice: 13,
                        discount: 3,
                        care: "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
                        createdAt: "2023-12-01T00:00:00Z",
                        createdBy: "Kathye Catterall",
                        description: "Mauris lacinia sapien quis libero.",
                        feedbacksTotal: 307,
                        habitat: "Outdoor",
                        quantity: 512,
                        soldQuantity: 322,
                        starsTotal: 3.6,
                        status: "Available",
                        numberOfFlowers: 10,
                        image: "https://happyflower.vn/app/uploads/2019/12/RoseMixBaby-1024x1024.jpg",
                    },
                    {
                        _id: "6630456bfc13ae1b64a24222",
                        name: "Fenngreek Seed",
                        unitPrice: 30,
                        discount: 0,
                        care: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
                        createdAt: "2023-12-01T00:00:00Z",
                        createdBy: "Tomas Gilkes",
                        description:
                            "Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.",
                        feedbacksTotal: 285,
                        habitat: "Garden",
                        quantity: 616,
                        soldQuantity: 616,
                        starsTotal: 0.8,
                        status: "Out of stock",
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

    const getProducts = () => {
        setProducts([
            {
                _id: "6630456bfc13ae1b64a24116",
                name: "Cheese - Brie, Triple Creme",
                habitat: "Garden",
                care: "Fusce consequat. Nulla nisl. Nunc nisl.",
                starsTotal: 4.6,
                feedbacksTotal: 786,
                unitPrice: 123,
                discount: 86,
                quantity: 459,
                soldQuantity: 270,
                image: "https://th.bing.com/th/id/OIP.HSM7Z15cDV86T7YjP14MvQHaFF?pid=ImgDet&w=474&h=325&rs=1",
                description:
                    "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
                status: "Available",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Tanny Aspital",
            },
            {
                _id: "6630456bfc13ae1b64a24111",
                name: "Lobster - Tail 6 Oz",
                habitat: "Outdoor",
                care: "Vestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
                starsTotal: 3.6,
                feedbacksTotal: 307,
                unitPrice: 234,
                discount: 42,
                quantity: 512,
                soldQuantity: 322,
                image: "https://happyflower.vn/app/uploads/2019/12/RoseMixBaby-1024x1024.jpg",
                description: "Mauris lacinia sapien quis libero.",
                status: "Available",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Kathye Catterall",
            },
            {
                _id: "6630456bfc13ae1b64a24222",
                name: "Fenngreek Seed",
                habitat: "Garden",
                care: "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.\n\nInteger tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
                starsTotal: 0.8,
                feedbacksTotal: 285,
                unitPrice: 341,
                discount: 34,
                quantity: 616,
                soldQuantity: 616,
                image: "https://th.bing.com/th/id/R.f852bb117e8734ca0d7507781d76ad2e?rik=VtL1rYEsidWJsA&pid=ImgRaw&r=0",
                description:
                    "Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.",
                status: "Out of stock",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Tomas Gilkes",
            },
            {
                _id: "66304519fc13ae1c4ca24110",
                name: "Sobe - Orange Carrot",
                habitat: "Garden",
                care: "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
                starsTotal: 1.9,
                feedbacksTotal: 527,
                unitPrice: 12,
                discount: 99,
                quantity: 147,
                soldQuantity: 82,
                image: "https://kenh14cdn.com/203336854389633024/2022/6/24/28819457758119662555006784473793327460682657n-16560409210941971678623.jpeg",
                description:
                    "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy.",
                status: "Available",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Gretel Hune",
            },
            {
                _id: "6630456bfc13ae1b64a24114",
                name: "Soup - Campbells Chili Veg",
                habitat: "Outdoor",
                care: "Sed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.\n\nQuisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
                starsTotal: 2.9,
                feedbacksTotal: 405,
                unitPrice: 100,
                discount: 41,
                quantity: 499,
                soldQuantity: 499,
                image: "https://th.bing.com/th/id/R.457063810526b38ec9be488a3e4f82b7?rik=ClllxYWMdKyCbw&pid=ImgRaw&r=0",
                description:
                    "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.",
                status: "Out of stock",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Matthias Inkpen",
            },
            {
                _id: "6630b7a9ab6bbcc0cc10be20",
                name: "Hoa đẹp cho khai trương",
                habitat: "Thoáng mát, tránh ánh nắng mặt trời",
                care: "Sed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.\n\nQuisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
                starsTotal: 2.9,
                feedbacksTotal: 405,
                unitPrice: 100,
                discount: 41,
                quantity: 499,
                soldQuantity: 499,
                image: "https://th.bing.com/th/id/R.76f43775a11bfc3923c3cf2742a2e34e?rik=lCE4wtCIaWpwIg&pid=ImgRaw&r=0",
                description:
                    "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.",
                status: "Out of stock",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Matthias Inkpen",
            },
            {
                _id: "6630b7e7ab6bbcc0cc10be22",
                name: "Hoa huệ trưng bày",
                habitat: "Thoáng mát, tránh ánh nắng mặt trời",
                care: "Sed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.\n\nQuisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.",
                starsTotal: 2.9,
                feedbacksTotal: 405,
                unitPrice: 100,
                discount: 41,
                quantity: 499,
                soldQuantity: 499,
                image: "https://th.bing.com/th/id/OIP.iJhafhQFYopOv4bZc7QOsAHaFh?rs=1&pid=ImgDetMain",
                description:
                    "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.",
                status: "Out of stock",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Matthias Inkpen",
            },
            {
                _id: "6630ba23ab6bbcc0cc10be2c",
                name: "Hoa mai trang trí nhà cửa",
                habitat: "Thoáng mát, tránh ánh nắng mặt trời",
                care: "Tưới nước ấm thường xuyên",
                starsTotal: 3,
                feedbacksTotal: 405,
                unitPrice: 100,
                discount: 50,
                quantity: 499,
                soldQuantity: 499,
                image: "https://product.hstatic.net/1000075734/product/z2263784349173_217f043c2489235a996b35d1222a4071_e69a60258edf485398d296858a85e2de_master.jpg",
                description:
                    "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.",
                status: "Out of stock",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Matthias Inkpen",
            },
        ]);
    };

    useEffect(() => {
        getOrder();
        getProducts();
    }, []);

    const handleAddProduct = () => {
        const currentProducts = order.orderDetails || [];
        const productsAdd = _.cloneDeep(currentProducts);

        productsAdd.push({
            key:
                productsAdd.length > 0
                    ? productsAdd[productsAdd.length - 1].key + 1
                    : 1,
            _id: null,
            numberOfFlower: "",
        });
        setOrder({ ...order, orderDetails: productsAdd });
    };

    const handleDeleteProduct = (index: string) => {
        const currentProducts = order.orderDetails || [];
        let productsDelete = _.cloneDeep(currentProducts);

        productsDelete.splice(index, 1);
        setOrder({
            ...order,
            orderDetails: productsDelete,
        });
        // submitData({
        //     ...caseDetail,
        //     criminals: criminalsDelete,
        //     wantedCriminalRequest: wantedsOfCase,
        // });
    };

    const updateDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                const updatedOrder = {
                    id: orderId, // dung params de truyen id
                    ...order,
                    ...updatedDetails,
                };

                const {
                    relatedOrders,
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
                //     relatedOrders,
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
                                <Grid xs={12} md={12} lg={12}>
                                    <OrderProducts
                                        productInfos={order?.orderDetails}
                                        products={products}
                                        // handleSubmit = {() => {}}
                                        handleAddProduct={handleAddProduct}
                                        handleDeleteProduct={
                                            handleDeleteProduct
                                        }
                                        canEdit={canEdit}
                                        // isSubmitting = {}
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
