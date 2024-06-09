import PropTypes from "prop-types";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Chart } from "../chart";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "../Toast";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { generateRandomColor } from "@/utils/helper";

export const ProductPercentByCategory = (props: any) => {
    const useChartOptions = (labels: any) => {
        const theme = useTheme();

        return {
            chart: {
                background: "transparent",
            },
            colors:
                Object.keys(flowerStructure).length < 7
                    ? [
                          "#5ee173",
                          "#3a82ef",
                          "#ff495f",
                          "#ffb038",
                          "#f8dfd4",
                          "#ee3cd2",
                      ]
                    : labels.map(() => generateRandomColor()),
            dataLabels: {
                enabled: true,
                fontSize: 20,
                style: {
                    fontSize: "17",
                },
            },
            labels,
            legend: {
                show: true,
                position: "bottom" as any,
                fontSize: 20 as any,
                itemMargin: {
                    horizontal: 10,
                    vertical: 10,
                },
                onItemHover: {
                    highlightDataSeries: true,
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "50%",
                    },
                    expandOnClick: true,
                },
            },
            // states: {
            //   active: {
            //     filter: {
            //       type: "none",
            //     },
            //   },
            //   hover: {
            //     filter: {
            //       type: "none",
            //     },
            //   },
            // },

            // stroke: {
            //   width: 0,
            // },
            theme: {
                mode: theme.palette.mode,
            },
            tooltip: {
                fillSeriesColor: true,
                y: {
                    formatter: function (val: any) {
                        return val + "%";
                    },
                },
            },
        };
    };

    const { sx } = props;
    const [flowerStructure, setFlowerStructure] = useState([]);
    const { setLoading } = useLoadingContext();
    const chartOptions = useChartOptions(
        Object.entries(flowerStructure).map(([_, t]: any) => t.categoryName)
    );
    const chartSeries = Object.entries(flowerStructure).map(
        ([_, t]: any) => t.quantityPercent
    );

    const getFlowerProductStructure = async () => {
        const response = await FetchApi(
            UrlConfig.statistic.getFlowerProductStructure,
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            setFlowerStructure(response.data);
        } else {
            showToast(response.message, "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        getFlowerProductStructure();
    }, []);

    return (
        <Card sx={sx}>
            <CardContent
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    // alignItems: "center",
                }}
            >
                {chartSeries.length > 0 ? (
                    <Chart
                        height={1000}
                        options={chartOptions}
                        series={chartSeries}
                        type="donut"
                        width={"100%"}
                    />
                ) : (
                    <Typography
                        sx={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        Không có sản phẩm hoa nào
                    </Typography>
                )}
                <CardHeader
                    sx={{
                        padding: 0,
                        marginTop: 2,
                        textAlign: "center",
                    }}
                    title={`Cơ cấu sản phẩm hoa`}
                />
            </CardContent>
        </Card>
    );
};

ProductPercentByCategory.propTypes = {
    sx: PropTypes.object,
};
