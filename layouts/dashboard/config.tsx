import OverviewIcon from "@mui/icons-material/LeaderboardOutlined";
import ChartBarIcon from "@mui/icons-material/TroubleshootOutlined";
import ProductIcon from "@mui/icons-material/LocalFloristOutlined";
import OrderIcon from "@mui/icons-material/BallotOutlined";
import UsersIcon from "@mui/icons-material/GroupOutlined";
import { SvgIcon } from "@mui/material";

export const items = [
    {
        title: "Tổng quan",
        path: "/",
        icon: (
            <SvgIcon fontSize="small">
                <OverviewIcon />
            </SvgIcon>
        ),
    },
    {
        title: "Danh sách tài khoản",
        path: "/account",
        icon: (
            <SvgIcon fontSize="small">
                <UsersIcon />
            </SvgIcon>
        ),
    },
    {
        title: "Danh sách sản phẩm",
        path: "/product",
        icon: (
            <SvgIcon fontSize="small">
                <ProductIcon />
            </SvgIcon>
        ),
    },
    {
        title: "Danh sách hoá đơn",
        path: "/order",
        icon: (
            <SvgIcon fontSize="small">
                <OrderIcon />
            </SvgIcon>
        ),
    },
    {
        title: "Thống kê",
        path: "/statistic",
        icon: (
            <SvgIcon fontSize="small">
                <ChartBarIcon />
            </SvgIcon>
        ),
    },
];
