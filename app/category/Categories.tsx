"use client";
import { useEffect, useRef, useState } from "react";
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
import NextLink from "next/link";
import UrlConfig from "@/config/UrlConfig";
import { FetchApi } from "@/utils/FetchApi";
import { showToast } from "@/components/Toast";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { CategorySearch } from "@/components/Category/CategorySearch";

const Categories = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [categoryData, setCategoryData] = useState<any>({});
    const { setLoading } = useLoadingContext();
    const alreadyRun = useRef(false);
    const [searchValue, setSearchValue] = useState("");
    const [reload, setReload] = useState(false);
    // const [filter, setFilter] = useState({});

    const handleSearchChange = (searchValue: string) => {
        setSearchValue(searchValue);
    };

    const handlePageChange = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when the number of rows per page changes
    };

    const handleDelete = async (ids: any) => {
        if (!alreadyRun.current) {
            alreadyRun.current = true;
            setLoading(true);
            try {
                let url = UrlConfig.category.deleteMultiple;
                let body: any = { categoryIds: ids };
                if (!Array.isArray(ids)) {
                    url = UrlConfig.category.delete.replace("{id}", ids);
                    body = undefined;
                }

                const response = await FetchApi(url, "DELETE", true, body);

                if (response.canRefreshToken === false)
                    showToast(response.message, "warning");
                else if (response.succeeded) {
                    showToast("Delete category successfully!", "success");
                    alreadyRun.current = false;
                    setReload(!reload);
                    await getCategories();
                } else {
                    showToast(response.message, "error");
                }
            } catch (error: any) {
                showToast(error.message, "error");
            }
            setLoading(false);
            alreadyRun.current = false;
        }
    };

    const getCategories = async () => {
        if (!alreadyRun.current) {
            alreadyRun.current = true;
            setLoading(true);
            const response = await FetchApi(
                UrlConfig.category.getAll +
                    `?keyword=${searchValue}&pageNumber=${
                        page + 1
                    }&pageSize=${rowsPerPage}`,
                "GET",
                true
            );

            if (response.canRefreshToken === false)
                showToast(response.message, "warning");
            else if (response.succeeded) {
                setCategoryData(response);
            } else {
                showToast(response.message, "error");
            }
            setLoading(false);
            alreadyRun.current = false;
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        getCategories();
    }, [page, rowsPerPage, searchValue]);

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
                                    onClick={() => setLoading(true)}
                                    variant="contained"
                                >
                                    Thêm hạng mục
                                </Button>
                            </div>
                        </Stack>
                        <CategorySearch onSearchChange={handleSearchChange} />
                        <CategoryTable
                            count={categoryData.total}
                            items={categoryData.data}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onDeleteCategory={handleDelete}
                            reload={reload}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Categories;
