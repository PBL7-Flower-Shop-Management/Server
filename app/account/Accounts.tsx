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
import { AccountTable } from "@/components/Account/AccountTable";
import NextLink from "next/link";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { AccountSearch } from "@/components/Account/AccountSearch";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { showToast } from "@/components/Toast";

const Accounts = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [accountData, setAccountData] = useState<any>({});
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
                let url = UrlConfig.account.deleteMultiple;
                let body: any = { accountIds: ids };
                if (!Array.isArray(ids)) {
                    url = UrlConfig.account.delete.replace("{id}", ids);
                    body = undefined;
                }

                const response = await FetchApi(url, "DELETE", true, body);

                if (response.canRefreshToken === false)
                    showToast(response.message, "warning");
                else if (response.succeeded) {
                    showToast("Delete account successfully!", "success");
                    alreadyRun.current = false;
                    setReload(!reload);
                    await getAccounts();
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
    const getAccounts = async () => {
        if (!alreadyRun.current) {
            alreadyRun.current = true;
            setLoading(true);
            const response = await FetchApi(
                UrlConfig.account.getAll +
                    `?keyword=${searchValue}&pageNumber=${
                        page + 1
                    }&pageSize=${rowsPerPage}`,
                "GET",
                true
            );

            if (response.canRefreshToken === false)
                showToast(response.message, "warning");
            else if (response.succeeded) {
                setAccountData(response);
            } else {
                showToast(response.message, "error");
            }
            setLoading(false);
            alreadyRun.current = false;
        }
    };

    useEffect(() => {
        getAccounts();
    }, []);

    useEffect(() => {
        getAccounts();
    }, [page, rowsPerPage, searchValue]);

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
                        <AccountSearch onSearchChange={handleSearchChange} />
                        <AccountTable
                            count={accountData.total}
                            items={accountData.data}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onDeleteAccount={handleDelete}
                            reload={reload}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
};
export default Accounts;
