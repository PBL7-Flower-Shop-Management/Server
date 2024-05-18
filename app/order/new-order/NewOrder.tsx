"use client";

import Head from "next/head";
import {
    Alert,
    Box,
    Collapse,
    Container,
    IconButton,
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
import * as Yup from "yup";
import { useState, useCallback, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import NewOrderInformation from "@/components/Order/NewOrder/NewOrderInformation";
import NewOrderProducts from "@/components/Order/NewOrder/NewOrderProducts";
import _ from "lodash";

const NewOrder = () => {
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonPicture, setLoadingButtonPicture] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(true);
    const router = useRouter();
    const [products, setProducts] = useState<any>(null);

    const formik = useFormik<any>({
        initialValues: {
            _id: "",
            orderDate: new Date(),
            shipDate: new Date(),
            shipAddress: "",
            shipPrice: "",
            discount: "",
            totalPrice: "",
            status: "Processing",
            paymentMethod: "",
            note: "",
            username: "",
            orderDetails: [],
        },
        validationSchema: Yup.object({}),
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
        // submitData({
        //     ...caseDetail,
        //     criminals: criminalsDelete,
        //     wantedCriminalRequest: wantedsOfCase,
        // });
    };

    const handleSubmit = async () => {
        try {
            setIsFieldDisabled(true);
            setLoadingButtonDetails(true);
            // let { avatarLink, ...newCrimininal } = formik.values;
            // newCrimininal = {
            //     ...newCrimininal,
            //     birthday:
            //         newCrimininal.birthday &&
            //         format(newCrimininal.birthday, "dd/MM/yyyy"),
            //     fatherBirthday:
            //         newCrimininal.fatherBirthday &&
            //         format(newCrimininal.fatherBirthday, "dd/MM/yyyy"),
            //     motherBirthday:
            //         newCrimininal.motherBirthday &&
            //         format(newCrimininal.motherBirthday, "dd/MM/yyyy"),
            //     gender:
            //         newCrimininal.gender === true ||
            //         newCrimininal.gender === "true",
            //     releaseDate:
            //         newCrimininal.releaseDate &&
            //         format(newCrimininal.releaseDate, "dd/MM/yyyy"),
            //     status: Number(newCrimininal.status),
            // };
            // console.log(newCrimininal);
            // await ordersApi.addOrder(newCrimininal, auth);
            setSuccess("Thêm đơn hàng thành công.");
            setError("");
            setIsFieldDisabled(true);
            setButtonDisabled(true);
        } catch (error: any) {
            setIsFieldDisabled(false);
            setButtonDisabled(false);
            setSuccess("");
            setError(error.message);
            console.log(error);
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const uploadImage = useCallback(
        async (newImage: any) => {
            try {
                // const response = await imagesApi.uploadImage(newImage);
                // formik.setValues({
                //     ...formik.values,
                //     avatar: response[0].filePath,
                //     avatarLink: response[0].fileUrl,
                // });
                setSuccess("Thêm ảnh đại diện đơn hàng thành công.");
                setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [formik.values]
    );

    const updateAccountPicture = useCallback(
        async (newImage: any) => {
            try {
                setLoadingButtonPicture(true);
                await uploadImage(newImage);
                setOpen(true);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingButtonPicture(false);
            }
        },
        [uploadImage]
    );
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
        getProducts();
    }, []);

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
                                        />
                                    </Grid>
                                    <Grid xs={12} md={12} lg={12}>
                                        <NewOrderProducts
                                            productInfos={
                                                formik.values?.orderDetails
                                            }
                                            products={products}
                                            // handleSubmit = {() => {}}
                                            handleAddProduct={handleAddProduct}
                                            handleDeleteProduct={
                                                handleDeleteProduct
                                            }
                                            // isSubmitting = {}
                                        />
                                    </Grid>

                                    <Grid xs={12} md={12} lg={12}>
                                        <Stack
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            {formik.isSubmitting ||
                                            loadingButtonDetails ? (
                                                <>
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
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonPicture ||
                                                            loadingButtonDetails ||
                                                            buttonDisabled
                                                        }
                                                        variant="outlined"
                                                        component={NextLink}
                                                        href="/order"
                                                        sx={{
                                                            color: "neutral.500",
                                                            borderColor:
                                                                "neutral.500",
                                                        }}
                                                    >
                                                        Huỷ
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonPicture ||
                                                            buttonDisabled
                                                        }
                                                        type="submit"
                                                        variant="contained"
                                                    >
                                                        Thêm đơn hàng
                                                    </Button>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonPicture ||
                                                            loadingButtonDetails ||
                                                            buttonDisabled
                                                        }
                                                        variant="outlined"
                                                        component={NextLink}
                                                        href="/order"
                                                        sx={{
                                                            color: "neutral.500",
                                                            borderColor:
                                                                "neutral.500",
                                                            "&:hover": {
                                                                borderColor:
                                                                    "neutral.600",
                                                                backgroundColor:
                                                                    "neutral.100",
                                                            },
                                                        }}
                                                    >
                                                        Huỷ
                                                    </Button>
                                                </>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
                                {success && (
                                    <Collapse in={open}>
                                        <Alert
                                            variant="outlined"
                                            open={open}
                                            severity="success"
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        router.push("/order");
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
                                    </Collapse>
                                )}
                                {error && (
                                    <Collapse in={open}>
                                        <Alert
                                            variant="outlined"
                                            open={open}
                                            severity="error"
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        router.push("/order");
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
                                    </Collapse>
                                )}
                            </div>
                        </Stack>
                    </Container>
                </Box>
            </form>
        </>
    );
};

export default NewOrder;
