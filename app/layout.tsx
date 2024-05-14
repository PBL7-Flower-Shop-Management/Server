"use client";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "./theme";
import { CssBaseline } from "@mui/material";
import { Layout } from "@/layouts/dashboard/layout";
import { usePathname } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import vi from "date-fns/locale/vi";
import { ConfigProvider } from "antd";
import viVN from "antd/lib/locale/vi_VN";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
    session,
}: Readonly<{
    children: React.ReactNode;
    session: any;
}>) {
    const theme = createTheme();
    const isLoginPage = usePathname() === "/login";

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/assets/images/logo.svg" />
            </head>
            <body className={inter.className}>
                <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                >
                    <ConfigProvider
                        locale={viVN}
                        theme={{
                            components: {
                                Image: {
                                    zIndexPopupBase: 1300,
                                },
                            },
                        }}
                    >
                        <SessionProvider session={session}>
                            <CookiesProvider>
                                <ThemeProvider theme={theme}>
                                    <CssBaseline />
                                    {isLoginPage ? (
                                        <main className="app">{children}</main>
                                    ) : (
                                        <Layout>
                                            <main className="app">
                                                {children}
                                            </main>
                                        </Layout>
                                    )}
                                </ThemeProvider>
                            </CookiesProvider>
                        </SessionProvider>
                    </ConfigProvider>
                </LocalizationProvider>
            </body>
        </html>
    );
}
