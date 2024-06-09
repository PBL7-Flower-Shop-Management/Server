import PropTypes from "prop-types";
import {
    Box,
    Card,
    CardHeader,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "../Toast";
import { useLoadingContext } from "@/contexts/LoadingContext";

export const SalesByCategory = (props: any) => {
    const { sx, minYear } = props;

    const year = new Date().getFullYear();

    const listYearOptions = Array.from(
        { length: year - minYear + 1 },
        (_, i) => i + minYear
    );

    listYearOptions.unshift("Tất cả");

    const [selectedYear, setSelectedYear] = useState<any>(year);
    const [salesByCategory, setSalesByCategory] = useState<any>([]);
    const { setLoading } = useLoadingContext();

    const getSalesByCategory = async (selectedYear: string) => {
        const response = await FetchApi(
            UrlConfig.statistic.getRevenueByCategory +
                (selectedYear !== "Tất cả" ? `?year=${selectedYear}` : ""),
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            setSalesByCategory(response.data);
        } else {
            showToast(response.message, "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedYear !== null && selectedYear !== undefined) {
            setLoading(true);
            getSalesByCategory(selectedYear);
        }
    }, [selectedYear]);

    return (
        <Card sx={sx}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                }}
            >
                <Box>
                    <TextField
                        label={"Năm"}
                        onChange={(e: any) => {
                            setSelectedYear(e.target.value);
                        }}
                        value={selectedYear}
                        select={true}
                        SelectProps={{ native: true }}
                        sx={{
                            "& .MuiInputBase-input": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            },
                        }}
                    >
                        {Object.entries(listYearOptions).map(
                            ([value, label]) => (
                                <option key={value} value={label}>
                                    {label}
                                </option>
                            )
                        )}
                    </TextField>
                </Box>
                <Box
                    sx={{
                        height: sx.tableHeight,
                        overflowY: "scroll",
                        padding: "16px",
                        bgcolor: "background.paper",
                    }}
                >
                    {salesByCategory.map((item: any, index: number) => (
                        <Stack key={index}>
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                            >
                                <Stack direction={"row"} width={"50%"}>
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            position: "relative",
                                            alignSelf: "center",
                                        }}
                                    >
                                        <Image
                                            src={item.avatarUrl}
                                            alt="avatar"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <Stack sx={{ ml: 1, width: "70%" }}>
                                        <Typography
                                            fontFamily={"sans-serif"}
                                            color={"gray"}
                                        >
                                            Category:
                                        </Typography>
                                        <Typography
                                            fontFamily={"sans-serif"}
                                            fontWeight={500}
                                            fontSize={18}
                                            sx={{
                                                lineHeight: 1,
                                            }}
                                        >
                                            {item.categoryName}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ width: "20%" }}>
                                    <Typography
                                        fontFamily={"sans-serif"}
                                        color={"gray"}
                                    >
                                        Sales:
                                    </Typography>
                                    <Typography
                                        fontFamily={"sans-serif"}
                                        fontWeight={500}
                                        fontSize={18}
                                        sx={{
                                            lineHeight: 1,
                                        }}
                                    >
                                        ${item.totalSales}
                                    </Typography>
                                </Stack>
                                <Stack sx={{ width: "20%" }}>
                                    <Typography
                                        fontFamily={"sans-serif"}
                                        color={"gray"}
                                    >
                                        Sold flowers:
                                    </Typography>
                                    <Typography
                                        fontFamily={"sans-serif"}
                                        fontWeight={500}
                                        fontSize={18}
                                        sx={{
                                            lineHeight: 1,
                                        }}
                                    >
                                        {item.totalSoldQuantity}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                        </Stack>
                    ))}
                </Box>
                <CardHeader
                    sx={{ padding: 0, alignSelf: "center", marginTop: 5 }}
                    title={`Doanh thu sản phẩm theo hạng mục${
                        selectedYear !== "Tất cả"
                            ? ` trong năm ${selectedYear}`
                            : ""
                    }`}
                />
            </Box>
        </Card>
    );
};

SalesByCategory.propTypes = {
    sx: PropTypes.object,
    minYear: PropTypes.number,
};
