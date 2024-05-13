import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { Scrollbar } from "@/components/Scrollbar";

const SIDE_NAV_WIDTH = 280;

const ScrollableContainer = styled(Scrollbar)({
    overflowY: "auto",
    maxHeight: "100vh",
    // zIndex: 9999,
});

const LayoutRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    [theme.breakpoints.up("lg")]: {
        paddingLeft: SIDE_NAV_WIDTH,
    },
}));

const LayoutContainer = styled("div")({
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    width: "100%",
});

export const Layout = (props: any) => {
    const { children } = props;
    const pathname = usePathname();
    const [openNav, setOpenNav] = useState(false);

    const handlePathnameChange = useCallback(() => {
        if (openNav) {
            setOpenNav(false);
        }
    }, [openNav]);

    useEffect(() => {
        handlePathnameChange();
    }, [pathname]);

    return (
        <>
            <SideNav onClose={() => setOpenNav(false)} open={openNav} />
            <ScrollableContainer>
                <TopNav onNavOpen={() => setOpenNav(true)} />
                <LayoutRoot>
                    <LayoutContainer>{children}</LayoutContainer>
                </LayoutRoot>
            </ScrollableContainer>
        </>
    );
};
