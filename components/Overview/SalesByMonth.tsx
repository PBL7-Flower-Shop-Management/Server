import PropTypes from "prop-types";
import { Box, Card, CardHeader, TextField } from "@mui/material";
import { Chart } from "../chart";
import { useState, useEffect } from "react";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "../Toast";
import { useLoadingContext } from "@/contexts/LoadingContext";

export const SalesByMonth = (props: any) => {
    const { sx, minYear } = props;

    const year = new Date().getFullYear();

    const listYearOptions = Array.from(
        { length: year - minYear + 1 },
        (_, i) => i + minYear
    );

    listYearOptions.unshift("Tất cả");

    const [selectedYear, setSelectedYear] = useState<any>(year);
    const [salesByMonth, setSalesByMonth] = useState(Array(12).fill(0));
    const [soldQuantityByMonth, setSoldQuantityByMonth] = useState(
        Array(12).fill(0)
    );
    const { setLoading } = useLoadingContext();

    const getStatistics = async (selectedYear: string) => {
        const response = await FetchApi(
            UrlConfig.statistic.getEvolutionOfRevenue +
                (selectedYear !== "Tất cả" ? `?year=${selectedYear}` : ""),
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            const data = response.data;
            let salesByMonth = Array(12).fill(0);
            let soldQuantityByMonth = Array(12).fill(0);
            data.map((d: any) => {
                salesByMonth[d._id - 1] = d.totalSalesByMonth;
                soldQuantityByMonth[d._id - 1] = d.totalSoldQuantity;
            });
            setSalesByMonth(salesByMonth);
            setSoldQuantityByMonth(soldQuantityByMonth);
        } else {
            showToast(response.message, "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedYear !== null && selectedYear !== undefined) {
            setLoading(true);
            getStatistics(selectedYear);
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
                <Chart
                    height={500}
                    type="line"
                    stacked={false}
                    series={[
                        {
                            name: "Doanh thu",
                            type: "area",
                            data: salesByMonth,
                        },
                        {
                            name: "Số hoa đã bán",
                            type: "line",
                            data: soldQuantityByMonth,
                        },
                    ]}
                    options={{
                        chart: {
                            height: 350,
                            type: "line",
                        },
                        stroke: {
                            curve: "smooth",
                        },
                        fill: {
                            type: "solid",
                            opacity: [0.35, 1],
                        },
                        labels: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "June",
                            "July",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                        ],
                        markers: {
                            size: 0,
                        },
                        yaxis: [
                            {
                                title: {
                                    text: "Doanh thu ($)",
                                },
                            },
                            {
                                opposite: true,
                                title: {
                                    text: "Số hoa đã bán (sản phẩm)",
                                },
                            },
                        ],
                        tooltip: {
                            shared: true,
                            intersect: false,
                            y: {
                                formatter: function (y, opts) {
                                    if (typeof y !== "undefined") {
                                        return (
                                            y.toFixed(0) +
                                            (opts.seriesIndex === 0
                                                ? " $"
                                                : " sản phẩm")
                                        );
                                    }
                                    return y;
                                },
                            },
                        },
                    }}
                    width="100%"
                />
                <CardHeader
                    sx={{ padding: 0, alignSelf: "center" }}
                    title={`Diễn biến tình hình doanh thu qua ${
                        selectedYear !== "Tất cả"
                            ? `các tháng trong năm ${selectedYear}`
                            : "các năm"
                    } `}
                />
            </Box>
        </Card>
    );
};

SalesByMonth.propTypes = {
    sx: PropTypes.object,
    minYear: PropTypes.number,
};
