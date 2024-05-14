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
import { CategoryTable } from "@/components/Category/CategoryTable";
// import { CategoriesSearch } from "src/sections/categorys/categorys-search";
import NextLink from "next/link";

const Categories = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [categoryData, setCategoryData] = useState([
        {
            _id: "663047485c22d11402fcc6d3",
            categoryName: "Hoa trồng vườn",
            image: "https://th.bing.com/th/id/OIP.f-FXUJ0aDZgeT7USzI7CUgHaKW?rs=1&pid=ImgDetMain",
            description:
                "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Merl",
        },
        {
            _id: "663047485c22d11402fcc6d4",
            categoryName: "Hoa trưng bày",
            image: "https://th.bing.com/th/id/OIP.IDIBlRIRqoabOvqKdaToLgHaHg?rs=1&pid=ImgDetMain",
            description:
                "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Catlee",
        },
        {
            _id: "663047485c22d11402fcc6d8",
            categoryName: "Hoa tốt nghiệp",
            image: "https://file1.hutech.edu.vn/file/news/tot_nghiep_2-1561445014.png",
            description:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Christie",
        },
        {
            _id: "663047485c22d11402fcc6d6",
            categoryName: "Hoa khai trương",
            image: "https://juro.com.vn/wp-content/uploads/mau-phong-nen-khai-truong-3.jpg",
            description:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Christie",
        },
        {
            _id: "663047485c22d11402fcc6d7",
            categoryName: "Hoa cưới",
            image: "https://th.bing.com/th/id/R.94ced6306675d8e8950bc8dfebb6ba00?rik=9uxw5rY1bzM0kQ&pid=ImgRaw&r=0",
            description:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Christie",
        },
        {
            _id: "663047485c22d11402fcc6d5",
            categoryName: "Hoa sinh nhật",
            image: "https://th.bing.com/th/id/R.1110331de5a4c5a98db02fe00f876b4e?rik=IfafVIxyoYdnLw&riu=http%3a%2f%2fhinhnenhd.com%2fwp-content%2fuploads%2f2021%2f11%2fHinh-anh-chuc-mung-sinh-nhat-dep-y-nghia-23.jpg&ehk=NiCTn3VrqMORZ1cxUpmybo4zEekg4tQQ5ozNFUeqqTg%3d&risl=&pid=ImgRaw&r=0",
            description:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Christie",
        },
        {
            _id: "663047485c22d11402fcc6d9",
            categoryName: "Hoa tang lễ",
            image: "https://static.wixstatic.com/media/9d8ed5_63efad3fb2594010bd409d19d3ef8aa0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_90/9d8ed5_63efad3fb2594010bd409d19d3ef8aa0~mv2.jpg",
            description:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Christie",
        },
        {
            _id: "663047485c22d11402fcc6da",
            categoryName: "Hoa chúc mừng",
            image: "https://media.istockphoto.com/vectors/party-popper-with-confetti-vector-id1125716911?k=6&m=1125716911&s=170667a&w=0&h=2QJzLxp2RFqt96beEhaWzdHHIrLUD6FOK2h3Ns4WH0s=",
            description:
                "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            createdAt: "2024-04-01T00:00:00Z",
            createdBy: "Christie",
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

    const getCategory = async () => {
        setLoading(true);
        setError(null);

        try {
            // const categorys = await categorysApi.getAllCategories(
            //     searchValue,
            //     filter,
            //     auth
            // );
            const categorys: never[] = [];
            setCategoryData(categorys);
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
            // await categorysApi.deleteCategory(id, auth);
            getCategory();
        } catch (error: any) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Danh sách hạng mục</title>
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
                                Danh sách hạng mục
                            </Typography>
                            <div>
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    component={NextLink}
                                    href="/category/new-category"
                                    variant="contained"
                                >
                                    Thêm hạng mục
                                </Button>
                            </div>
                        </Stack>
                        {/* <CategoriesSearch
                            onSearchChange={handleSearchChange}
                            onFilterChange={handleFilterChange}
                            onSearchButtonClick={handleSearchButtonClick}
                        /> */}
                        <CategoryTable
                            count={categoryData.length}
                            items={categoryData.slice(
                                page * rowsPerPage,
                                (page + 1) * rowsPerPage
                            )}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onDeleteCategory={handleDelete}
                            isFetching={loading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Categories;
