import PropTypes from "prop-types";
// import BellIcon from "@heroicons/react/24/solid/BellIcon";
// import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import BarsIcon from "@mui/icons-material/DensityMediumOutlined";
// import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
    Avatar,
    Badge,
    Box,
    Button,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { usePopover } from "@/hooks/usePopover";
import { AccountPopover } from "./account-popover";
import { zIndexLevel } from "@/utils/constants";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props: any) => {
    const { onNavOpen } = props;
    const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
    const accountPopover = usePopover();
    // const user = JSON.parse(localStorage.getItem("user"));
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <>
            <Box
                component="header"
                sx={{
                    backdropFilter: "blur(6px)",
                    backgroundColor: (theme) =>
                        alpha(theme.palette.background.default, 0.8),
                    position: "sticky",
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`,
                    },
                    top: 0,
                    width: {
                        lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
                    },
                    // zIndex: (theme) => theme.zIndex.appBar,
                    zIndex: zIndexLevel.two,
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{
                        minHeight: TOP_NAV_HEIGHT,
                        px: 3,
                    }}
                >
                    <Stack alignItems="center" direction="row" spacing={1}>
                        {!lgUp && (
                            <IconButton onClick={onNavOpen}>
                                <SvgIcon fontSize="small">
                                    <BarsIcon />
                                </SvgIcon>
                            </IconButton>
                        )}
                    </Stack>

                    <Button
                        onClick={accountPopover.handleOpen}
                        ref={accountPopover.anchorRef}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={1.2}
                        >
                            <Typography sx={{ color: "black" }}>
                                {user?.name ?? user?.email}
                            </Typography>
                            <Avatar
                                sx={{
                                    cursor: "pointer",
                                    height: 40,
                                    width: 40,
                                }}
                                src={user?.avatar}
                                alt={"Avatar"}
                            />
                        </Box>
                    </Button>
                </Stack>
            </Box>
            <AccountPopover
                user={user}
                anchorEl={accountPopover.anchorRef.current}
                open={accountPopover.open}
                onClose={accountPopover.handleClose}
            />
        </>
    );
};

TopNav.propTypes = {
    onNavOpen: PropTypes.func,
};
