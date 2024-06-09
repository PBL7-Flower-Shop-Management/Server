import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, Stack, useMediaQuery } from "@mui/material";
import Logo from "@/public/images/login2.jpg";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import Image from "next/image";
import ScrollBar from "react-perfect-scrollbar";
import { roleMap, zIndexLevel } from "@/utils/constants";
import { useSession } from "next-auth/react";
// import { useAuth } from "src/hooks/use-auth";

export const SideNav = (props: any) => {
    const { open, onClose } = props;
    const pathname = usePathname();
    const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
    const { data: session } = useSession();

    let visibleItems =
        session?.user?.role === roleMap.Admin
            ? items
            : items.filter((item: any) => item.path !== "/statistic");

    const content = (
        <ScrollBar
            style={{
                height: "100%",
                // "& .simplebar-content": {
                //     height: "100%",
                // },
                // "& .simplebar-scrollbar:before": {
                //     background: "neutral.400",
                // },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        component={NextLink}
                        href="/"
                        sx={{
                            display: "flex",
                            height: 160,
                            width: 160,
                            justifyContent: "center",
                            borderRadius: "50%",
                            overflow: "hidden",
                            borderColor: "white",
                        }}
                    >
                        <Image src={Logo} alt="Shop avatar" />
                    </Box>
                </Box>
                <Divider sx={{ borderColor: "gray" }} />
                <Box
                    component="nav"
                    sx={{
                        flexGrow: 1,
                        px: 2,
                        py: 2,
                    }}
                >
                    <Stack
                        component="ul"
                        spacing={0.5}
                        sx={{
                            listStyle: "none",
                            p: 0,
                            m: 0,
                        }}
                    >
                        {visibleItems.map((item: any) => {
                            const itemPath = item.path || "/";
                            const active =
                                pathname === itemPath ||
                                (itemPath !== "/" &&
                                    pathname.startsWith(`${itemPath}/`));

                            return (
                                <SideNavItem
                                    active={active}
                                    disabled={item.disabled}
                                    external={item.external}
                                    icon={item.icon}
                                    key={item.title}
                                    path={item.path}
                                    title={item.title}
                                />
                            );
                        })}
                    </Stack>
                </Box>
            </Box>
        </ScrollBar>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: "neutral.800",
                        color: "common.white",
                        width: 280,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: "neutral.800",
                    color: "common.white",
                    width: 280,
                },
            }}
            // sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            sx={{ zIndex: zIndexLevel.four }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

SideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
