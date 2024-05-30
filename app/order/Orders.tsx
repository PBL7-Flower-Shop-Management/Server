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
import { OrderTable } from "@/components/Order/OrderTable";
import NextLink from "next/link";
import { useLoadingContext } from "@/contexts/LoadingContext";
import UrlConfig from "@/config/UrlConfig";
import { FetchApi } from "@/utils/FetchApi";
import { showToast } from "@/components/Toast";
import { OrderSearch } from "@/components/Order/OrderSearch";

const Orders = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderData, setOrderData] = useState<any>({});
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
                let url = UrlConfig.order.deleteMultiple;
                let body: any = { orderIds: ids };
                if (!Array.isArray(ids)) {
                    url = UrlConfig.order.delete.replace("{id}", ids);
                    body = undefined;
                }

                const response = await FetchApi(url, "DELETE", true, body);

                if (response.canRefreshToken === false)
                    showToast(response.message, "warning");
                else if (response.succeeded) {
                    showToast(
                        response.message
                            ? response.message
                            : "Delete order successfully!",
                        "success"
                    );
                    alreadyRun.current = false;
                    setReload(!reload);
                    await getOrders();
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

    const getOrders = async () => {
        if (!alreadyRun.current) {
            alreadyRun.current = true;
            setLoading(true);
            const response = await FetchApi(
                UrlConfig.order.getAll +
                    `?keyword=${searchValue}&pageNumber=${
                        page + 1
                    }&pageSize=${rowsPerPage}`,
                "GET",
                true
            );

            if (response.canRefreshToken === false)
                showToast(response.message, "warning");
            else if (response.succeeded) {
                setOrderData(response);
            } else {
                showToast(response.message, "error");
            }
            setLoading(false);
            alreadyRun.current = false;
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        getOrders();
    }, [page, rowsPerPage, searchValue]);

    return (
        <>
            <Head>
                <title>Danh sách đơn hàng</title>
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
                                Danh sách đơn hàng
                            </Typography>
                            <div>
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    component={NextLink}
                                    href="/order/new-order"
                                    onClick={() => setLoading(true)}
                                    variant="contained"
                                >
                                    Thêm đơn hàng
                                </Button>
                            </div>
                        </Stack>
                        <OrderSearch onSearchChange={handleSearchChange} />
                        <OrderTable
                            count={orderData.total}
                            items={orderData.data}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onDeleteOrder={handleDelete}
                            reload={reload}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Orders;
