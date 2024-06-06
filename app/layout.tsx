"use client";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "./theme";
import { CssBaseline } from "@mui/material";
import { Layout } from "@/layouts/dashboard/layout";
import { usePathname } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import vi from "date-fns/locale/vi";
import { ConfigProvider } from "antd";
import viVN from "antd/lib/locale/vi_VN";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { zIndexLevel } from "@/utils/constants";
import Toast from "@/components/Toast";

export default function RootLayout({
    children,
    session,
}: Readonly<{
    children: React.ReactNode;
    session: any;
}>) {
    const theme = createTheme();
    const pathname = usePathname();

    return (
        <html lang="en">
            <head>
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/images/flower-icon.png"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
            </head>
            <body>
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                >
                    <ConfigProvider
                        locale={viVN}
                        theme={{
                            components: {
                                Image: {
                                    zIndexPopupBase: zIndexLevel.six,
                                },
                            },
                        }}
                    >
                        <SessionProvider session={session}>
                            <CookiesProvider>
                                <ThemeProvider theme={theme}>
                                    <CssBaseline />
                                    <Toast />
                                    <LoadingProvider>
                                        {pathname === "/login" ||
                                        pathname === "/api-doc" ||
                                        pathname === "/forgot-password" ||
                                        pathname === "/reset-password" ? (
                                            <main className="app">
                                                {children}
                                            </main>
                                        ) : (
                                            <Layout>
                                                <main className="app">
                                                    {children}
                                                </main>
                                            </Layout>
                                        )}
                                    </LoadingProvider>
                                </ThemeProvider>
                            </CookiesProvider>
                        </SessionProvider>
                    </ConfigProvider>
                </LocalizationProvider>
            </body>
        </html>
    );
}
