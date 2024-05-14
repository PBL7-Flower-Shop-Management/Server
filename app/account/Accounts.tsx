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
import { AccountTable } from "@/components/Account/AccountTable";
// import { AccountsSearch } from "src/sections/Accounts/Accounts-search";
import NextLink from "next/link";

const Accounts = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [accountData, setAccountData] = useState([
        {
            userId: "66304519fc13ae1c4ca24111",
            isActived: false,
            username: "twoollacott1",
            name: "Alice Smith",
            citizenId: "98765432109876543210",
            email: "alice@example.com",
            phoneNumber: "9876543210",
            role: "Employee",
            avatar: "avatar2.jpg",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "66304519fc13ae1c4ca24112",
            isActived: true,
            username: "mcund2",
            name: "Emily Johnson",
            citizenId: "54321678905432167890",
            email: "emily@example.com",
            phoneNumber: "5432167890",
            role: "Admin",
            avatar: "avatar3.jpg",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "66304519fc13ae1c4ca24110",
            isActived: true,
            username: "gfillimore0",
            name: "John Doe",
            citizenId: "12345678901234567890",
            email: "john@example.com",
            phoneNumber: "1234567890",
            role: "Customer",
            avatar: "avatar1.jpg",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "663f20c026cc6a0b75bfca9b",
            isActived: true,
            username: "string",
            name: "string",
            citizenId: "6789",
            email: "string@gmail.com",
            phoneNumber: "45678",
            role: "Customer",
            avatar: "string",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "663f218b26cc6a0b75bfcaab",
            isActived: true,
            username: "danghoan",
            name: "string",
            citizenId: "6789",
            email: "string2@gmail.com",
            phoneNumber: "45678",
            role: "Customer",
            avatar: "string",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "663f222a26cc6a0b75bfcabb",
            isActived: true,
            username: "danghoan2",
            name: "string",
            citizenId: "6789",
            email: "string3@gmail.com",
            phoneNumber: "45678",
            role: "Customer",
            avatar: "string",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "663f22c826cc6a0b75bfcac7",
            isActived: true,
            username: "danghoan3",
            email: "string4@gmail.com",
            phoneNumber: "45678",
            role: "Customer",
            avatar: "string",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "663f253c26cc6a0b75bfcad7",
            isActived: true,
            username: "string4",
            name: "string",
            citizenId: "53454353",
            email: "strireng@gmail.com",
            phoneNumber: "5345435",
            role: "Customer",
            avatar: "string",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
        },
        {
            userId: "663f3e3680056378c19e8957",
            isActived: true,
            username: "danghoann",
            name: "Dang Hoan",
            citizenId: "456789",
            email: "danghoan77777@gmail.com",
            phoneNumber: "98765",
            role: "Customer",
            avatar: "https://th.bing.com/th/id/OIP.ebPexDgG2kic7e_ubIhaqgHaEK?rs=1&pid=ImgDetMain",
            createdAt: "2024-04-30T10:00:00Z",
            createdBy: "Admin",
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

    const getAccount = async () => {
        setLoading(true);
        setError(null);

        try {
            // const Accounts = await AccountsApi.getAllAccounts(
            //     searchValue,
            //     filter,
            //     auth
            // );
            const Accounts: never[] = [];
            setAccountData(Accounts);
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
            // await AccountsApi.deleteAccount(id, auth);
            getAccount();
        } catch (error: any) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Danh sách tài khoản</title>
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
                                Danh sách tài khoản
                            </Typography>
                            <div>
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    component={NextLink}
                                    href="/account/new-account"
                                    variant="contained"
                                >
                                    Thêm tài khoản
                                </Button>
                            </div>
                        </Stack>
                        {/* <AccountsSearch
                            onSearchChange={handleSearchChange}
                            onFilterChange={handleFilterChange}
                            onSearchButtonClick={handleSearchButtonClick}
                        /> */}
                        <AccountTable
                            count={accountData.length}
                            items={accountData.slice(
                                page * rowsPerPage,
                                (page + 1) * rowsPerPage
                            )}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onDeleteAccount={handleDelete}
                            isFetching={loading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Accounts;
