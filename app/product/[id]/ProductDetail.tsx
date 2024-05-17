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
import ProductInformation from "@/components/Product/Detail/ProductInformation";
import ProductImages from "@/components/Product/Detail/ProductImages";

const ProductDetail = ({ params }: any) => {
    const [product, setProduct] = useState<any>(null);
    const [categories, setCategories] = useState<any>(null);
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonPicture, setLoadingButtonPicture] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const productId = params?.id;
    const productName = searchParams.get("name");
    const canEdit = searchParams.get("edit") === "1";
    const [open, setOpen] = useState(true);

    const getProduct = useCallback(async () => {
        setLoadingSkeleton(true);
        setError("");
        try {
            // const product = await productsApi.getProductById(
            //     productId,
            //     auth
            // );
            const product = {
                _id: "6630456bfc13ae1b64a24116",
                name: "Cheese - Brie, Triple Creme",
                habitat: "Garden",
                care: "Fusce consequat. Nulla nisl. Nunc nisl.",
                growthTime: "3 tháng",
                starsTotal: 4.6,
                feedbacksTotal: 786,
                unitPrice: 123,
                discount: 86,
                quantity: 459,
                soldQuantity: 270,
                imageVideoFiles: [
                    "https://th.bing.com/th/id/OIP.HSM7Z15cDV86T7YjP14MvQHaFF?pid=ImgDet&w=474&h=325&rs=1",
                    "https://th.bing.com/th/id/OIP.HSM7Z15cDV86T7YjP14MvQHaFF?pid=ImgDet&w=474&h=325&rs=1",
                ],
                description:
                    "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
                categoryId: [
                    "663047485c22d11402fcc6d3",
                    "663047485c22d11402fcc6da",
                ],
                status: "Available",
                createdAt: "2023-12-01T00:00:00Z",
                createdBy: "Tanny Aspital",
                updatedAt: "2024-04-01T00:00:00Z",
                updatedBy: "Queenie Houchen",
                isDeleted: true,
            };
            setProduct(product);
            console.log(product);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoadingSkeleton(false);
        }
    }, []);

    const getCategories = () => {
        setCategories([
            {
                _id: "663047485c22d11402fcc6d3",
                categoryName: "Hoa trồng vườn",
                image: "https://th.bing.com/th/id/OIP.f-FXUJ0aDZgeT7USzI7CUgHaKW?rs=1&pid=ImgDetMain",
                description:
                    "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
            },
            {
                _id: "663047485c22d11402fcc6d4",
                categoryName: "Hoa trưng bày",
                image: "https://th.bing.com/th/id/OIP.IDIBlRIRqoabOvqKdaToLgHaHg?rs=1&pid=ImgDetMain",
                description:
                    "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
            },
            {
                _id: "663047485c22d11402fcc6d8",
                categoryName: "Hoa tốt nghiệp",
                image: "https://file1.hutech.edu.vn/file/news/tot_nghiep_2-1561445014.png",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d6",
                categoryName: "Hoa khai trương",
                image: "https://juro.com.vn/wp-content/uploads/mau-phong-nen-khai-truong-3.jpg",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d7",
                categoryName: "Hoa cưới",
                image: "https://th.bing.com/th/id/R.94ced6306675d8e8950bc8dfebb6ba00?rik=9uxw5rY1bzM0kQ&pid=ImgRaw&r=0",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d5",
                categoryName: "Hoa sinh nhật",
                image: "https://th.bing.com/th/id/R.1110331de5a4c5a98db02fe00f876b4e?rik=IfafVIxyoYdnLw&riu=http%3a%2f%2fhinhnenhd.com%2fwp-content%2fuploads%2f2021%2f11%2fHinh-anh-chuc-mung-sinh-nhat-dep-y-nghia-23.jpg&ehk=NiCTn3VrqMORZ1cxUpmybo4zEekg4tQQ5ozNFUeqqTg%3d&risl=&pid=ImgRaw&r=0",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d9",
                categoryName: "Hoa tang lễ",
                image: "https://static.wixstatic.com/media/9d8ed5_63efad3fb2594010bd409d19d3ef8aa0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_90/9d8ed5_63efad3fb2594010bd409d19d3ef8aa0~mv2.jpg",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6da",
                categoryName: "Hoa chúc mừng",
                image: "https://media.istockphoto.com/vectors/party-popper-with-confetti-vector-id1125716911?k=6&m=1125716911&s=170667a&w=0&h=2QJzLxp2RFqt96beEhaWzdHHIrLUD6FOK2h3Ns4WH0s=",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
        ]);
    };

    useEffect(() => {
        getProduct();
        getCategories();
    }, []);

    const updateDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                const updatedProduct = {
                    id: productId, // dung params de truyen id
                    ...product,
                    ...updatedDetails,
                };

                const {
                    relatedCases,
                    charge,
                    isWantedProduct,
                    wantedProducts,
                    avatarLink,
                    ...updated
                } = updatedProduct;
                // console.log(updated);
                // await productsApi.editProduct(updated, auth);
                // getProduct();
                setSuccess("Cập nhật thông tin chi tiết tội phạm thành công.");
                setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [product]
    );

    const updateProductDetails = useCallback(
        async (updatedDetails: any) => {
            try {
                setLoadingButtonDetails(true);
                setProduct((prevProduct: any) => ({
                    ...prevProduct,
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
        [setProduct, updateDetails]
    );

    const uploadImage = useCallback(
        async (newImage: any) => {
            try {
                // const response = await imagesApi.uploadImage(newImage);
                // const updatedProduct = {
                //     id: productId,
                //     ...product,
                //     avatar: response[0].filePath,
                // };
                // const {
                //     relatedCases,
                //     charge,
                //     isWantedProduct,
                //     wantedProducts,
                //     avatarLink,
                //     ...updated
                // } = updatedProduct;
                // // console.log(updated);
                // // await productsApi.editProduct(updated, auth);
                // // getProduct();
                // setSuccess("Cập nhật ảnh đại diện tội phạm thành công.");
                // setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [product]
    );

    const updateProductPicture = useCallback(
        async (newImage: any) => {
            try {
                setLoadingButtonPicture(true);
                setProduct((prevProduct: any) => ({
                    ...prevProduct,
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
        [setProduct, uploadImage]
    );

    return (
        <>
            <Head>
                <title>Sản phẩm | {product?.name}</title>
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
                                        {product?.name}
                                    </Typography>
                                </Breadcrumbs>
                            )}
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={12} lg={12}>
                                    <ProductInformation
                                        product={product}
                                        initCategories={categories}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        handleSubmit={updateProductDetails}
                                        canEdit={canEdit}
                                    />
                                </Grid>
                                <Grid xs={12} md={12} lg={12}>
                                    <ProductImages
                                        productImages={product?.imageVideoFiles}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        loadingButtonPicture={
                                            loadingButtonPicture
                                        }
                                        onUpdate={updateProductPicture}
                                        success={success}
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

export default ProductDetail;
