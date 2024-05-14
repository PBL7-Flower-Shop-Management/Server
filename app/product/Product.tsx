"use client";
import { useState } from "react";
import Head from "next/head";
import PlusIcon from "@mui/icons-material/Add";
import {
    Box,
    Button,
    Container,
    Stack,
    SvgIcon,
    Typography,
} from "@mui/material";
import { ProductTable } from "@/components/Product/ProductTable";
// import { ProductsSearch } from "src/sections/products/products-search";
import NextLink from "next/link";

const Product = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [productData, setProductData] = useState([
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filter, setFilter] = useState({});
    const [searchButtonClicked, setSearchButtonClicked] = useState(true);

    const handlePageChange = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when the number of rows per page changes
    };

    const getProduct = async () => {
        setLoading(true);
        setError(null);

        try {
            // const products = await productsApi.getAllProducts(
            //     searchValue,
            //     filter,
            //     auth
            // );
            const products: never[] = [];
            setProductData(products);
            setLoading(false);
        } catch (error: any) {
            setError(error.message);
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            console.log(id);
            // await productsApi.deleteProduct(id, auth);
            getProduct();
        } catch (error: any) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Danh sách sản phẩm</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3,
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Typography variant="h4">
                                Danh sách sản phẩm
                            </Typography>
                            <div>
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    component={NextLink}
                                    href="/product/new-product"
                                    variant="contained"
                                >
                                    Thêm sản phẩm
                                </Button>
                            </div>
                        </Stack>
                        {/* <ProductsSearch
                            onSearchChange={handleSearchChange}
                            onFilterChange={handleFilterChange}
                            onSearchButtonClick={handleSearchButtonClick}
                        /> */}
                        <ProductTable
                            count={productData.length}
                            items={productData.slice(
                                page * rowsPerPage,
                                (page + 1) * rowsPerPage
                            )}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onDeleteProduct={handleDelete}
                            isFetching={loading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Product;
