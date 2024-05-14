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
import { OrderTable } from "@/components/Order/OrderTable";
// import { OrdersSearch } from "src/sections/orders/orders-search";
import NextLink from "next/link";

const Orders = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderData, setOrderData] = useState([
        {
            _id: "6159f6a23603a45f08268ebb",
            username: "twoollacott1",
            orderDate: "2024-04-28T12:00:00Z",
            shipAddress: "789 Oak St",
            shipPrice: 20,
            discount: 10,
            totalPrice: 150,
            status: "Delivered",
            paymentMethod: "Bank Transfer",
            note: "",
            createdAt: "2024-04-28T10:00:00Z",
            createdBy: "Admin",
            shipDate: "2024-07-30T12:00:00Z",
        },
        {
            _id: "6159f6a23603a45f08268eb7",
            username: "string4",
            orderDate: "2024-04-30T12:00:00Z",
            shipAddress: "123 Main St",
            shipPrice: 10,
            discount: 5,
            totalPrice: 100,
            status: "Processing",
            paymentMethod: "Credit Card",
            note: "Please deliver before 5 PM",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
            shipDate: "2024-07-30T12:00:00Z",
        },
        {
            _id: "6159f6a23603a45f08268eb9",
            username: "danghoann",
            orderDate: "2024-04-29T12:00:00Z",
            shipAddress: "456 Elm St",
            shipPrice: 15,
            discount: 0,
            totalPrice: 200,
            status: "Shipped",
            paymentMethod: "PayPal",
            note: "Customer requested fast shipping",
            createdAt: "2024-04-29T10:00:00Z",
            createdBy: "Admin",
            shipDate: "2024-07-30T12:00:00Z",
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

    const getOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            // const orders = await ordersApi.getAllOrders(
            //     searchValue,
            //     filter,
            //     auth
            // );
            const orders: never[] = [];
            setOrderData(orders);
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
            // await ordersApi.deleteOrder(id, auth);
            getOrder();
        } catch (error: any) {
            setError(error.message);
        }
        setLoading(false);
    };

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
                                    variant="contained"
                                >
                                    Thêm đơn hàng
                                </Button>
                            </div>
                        </Stack>
                        {/* <OrdersSearch
                            onSearchChange={handleSearchChange}
                            onFilterChange={handleFilterChange}
                            onSearchButtonClick={handleSearchButtonClick}
                        /> */}
                        <OrderTable
                            count={orderData.length}
                            items={orderData.slice(
                                page * rowsPerPage,
                                (page + 1) * rowsPerPage
                            )}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onDeleteOrder={handleDelete}
                            isFetching={loading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Orders;
