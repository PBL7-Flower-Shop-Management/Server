"use client";

import { useLoadingContext } from "@/contexts/LoadingContext";
import {
    Typography,
    Card,
    CardContent,
    Stack,
    Container,
    ButtonBase,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import UserPhoto from "@/public/images/user.png";
import ProductsPhoto from "@/public/images/products.png";
import RemainProductsPhoto from "@/public/images/remain_product.png";
import SalesPhoto from "@/public/images/sales.png";
import { SalesByMonth } from "@/components/Overview/SalesByMonth";
import { SalesByCategory } from "@/components/Overview/SalesByCategory";
import { ProductPercentByCategory } from "@/components/Overview/ProductPercentByCategory";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "@/components/Toast";

const Statistic = () => {
    const [statistics, setStatistics] = useState<any>(null);
    const [minShipDateYear, setMinShipDateYear] = useState<any>(null);
    const { setLoading } = useLoadingContext();

    const getStatistics = async () => {
        const response = await FetchApi(
            UrlConfig.statistic.getOverview,
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            setStatistics(response.data);
        } else {
            showToast(response.message, "error");
        }
        // setLoading(false);
    };

    const getMinShipDateYear = async () => {
        const response = await FetchApi(
            UrlConfig.statistic.getMinShipDateYear,
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            setMinShipDateYear(
                response.data ? response.data : new Date().getFullYear() - 10
            );
        } else {
            showToast(response.message, "error");
        }
    };

    useEffect(() => {
        setLoading(true);
        getStatistics();
        getMinShipDateYear();
    }, []);

    return (
        <Container sx={{ px: 10 }}>
            <Stack direction={"row"} justifyContent={"space-evenly"}>
                <ButtonBase
                    sx={{
                        display: "block",
                        textAlign: "initial",
                        borderRadius: "20px",
                        "&:hover .MuiCard-root": {
                            backgroundColor: "#1064ac",
                        },
                        width: "23%",
                    }}
                    href="/account"
                >
                    <Card sx={{ bgcolor: "#118eef", height: "100%" }}>
                        <CardContent
                            sx={{
                                p: 2,
                                mb: 2,
                                mt: 3,
                                position: "relative",
                            }}
                        >
                            <Stack>
                                <Stack
                                    direction={"row"}
                                    gap={1}
                                    padding={1}
                                    justifyContent={"space-between"}
                                >
                                    <Stack>
                                        <Typography
                                            fontFamily={"sans-serif"}
                                            fontSize={18}
                                        >
                                            NGƯỜI DÙNG
                                        </Typography>
                                        <Typography variant="h5" fontSize={20}>
                                            {statistics?.totalAccounts}
                                        </Typography>
                                    </Stack>
                                    <Image
                                        src={UserPhoto}
                                        alt={"Product image"}
                                        width={32}
                                    />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </ButtonBase>
                <ButtonBase
                    sx={{
                        display: "block",
                        textAlign: "initial",
                        borderRadius: "20px",
                        "&:hover .MuiCard-root": {
                            backgroundColor: "#2aa49a",
                        },
                        width: "23%",
                    }}
                    href="/product"
                >
                    <Card sx={{ bgcolor: "#2dcebf", height: "100%" }}>
                        <CardContent
                            sx={{
                                p: 2,
                                px: 2,
                                mb: 3,
                                mt: 3,
                            }}
                        >
                            <Stack>
                                <Stack
                                    direction={"row"}
                                    gap={1}
                                    padding={1}
                                    justifyContent={"space-between"}
                                >
                                    <Stack>
                                        <Typography
                                            fontFamily={"sans-serif"}
                                            fontSize={18}
                                        >
                                            TỔNG SẢN PHẨM
                                        </Typography>
                                        <Typography variant="h5" fontSize={20}>
                                            {statistics?.totalProducts}
                                        </Typography>
                                    </Stack>
                                    <Image
                                        src={ProductsPhoto}
                                        alt={"Product image"}
                                        width={32}
                                    />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </ButtonBase>
                <ButtonBase
                    sx={{
                        display: "block",
                        textAlign: "initial",
                        borderRadius: "20px",
                        "&:hover .MuiCard-root": {
                            backgroundColor: "#c2443c",
                        },
                        width: "23%",
                    }}
                    href="/product"
                >
                    <Card sx={{ bgcolor: "#f55242", height: "100%" }}>
                        <CardContent
                            sx={{
                                p: 2,
                                px: 2,
                                mb: 3,
                                mt: 3,
                            }}
                        >
                            <Stack>
                                <Stack
                                    direction={"row"}
                                    gap={1}
                                    padding={1}
                                    justifyContent={"space-between"}
                                >
                                    <Stack>
                                        <Typography
                                            fontFamily={"sans-serif"}
                                            fontSize={18}
                                        >
                                            SẢN PHẨM CÒN LẠI
                                        </Typography>
                                        <Typography variant="h5" fontSize={20}>
                                            {statistics?.remainProducts}
                                        </Typography>
                                    </Stack>
                                    <Image
                                        src={RemainProductsPhoto}
                                        alt={"Product image"}
                                        width={32}
                                    />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </ButtonBase>
                <ButtonBase
                    sx={{
                        display: "block",
                        textAlign: "initial",
                        borderRadius: "20px",
                        "&:hover .MuiCard-root": {
                            backgroundColor: "#dc8130",
                        },
                        width: "23%",
                    }}
                    href="/order"
                >
                    <Card sx={{ bgcolor: "#fb9840", height: "100%" }}>
                        <CardContent
                            sx={{
                                p: 2,
                                px: 2,
                                mb: 3,
                                mt: 3,
                            }}
                        >
                            <Stack>
                                <Stack
                                    direction={"row"}
                                    gap={1}
                                    padding={1}
                                    justifyContent={"space-between"}
                                >
                                    <Stack>
                                        <Typography
                                            fontFamily={"sans-serif"}
                                            fontSize={18}
                                        >
                                            TỔNG DOANH THU
                                        </Typography>
                                        <Typography variant="h5" fontSize={20}>
                                            {statistics?.totalSales} $
                                        </Typography>
                                    </Stack>
                                    <Image
                                        src={SalesPhoto}
                                        alt={"Product image"}
                                        width={32}
                                    />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </ButtonBase>
            </Stack>
            {minShipDateYear && (
                <>
                    <SalesByMonth sx={{ mt: 5 }} minYear={minShipDateYear} />
                    <Stack direction={"row"} gap={3}>
                        <SalesByCategory
                            sx={{
                                mt: 5,
                                width: "60%",
                                tableHeight: "400px",
                                height: "550px",
                            }}
                            minYear={minShipDateYear}
                        />
                        <ProductPercentByCategory
                            sx={{
                                mt: 5,
                                flexGrow: 1,
                            }}
                        />
                    </Stack>
                </>
            )}
        </Container>
    );
};

export default Statistic;
