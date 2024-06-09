"use client";
import {
    Button,
    Card,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    Link,
    Snackbar,
    Stack,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoginPhoto from "@/public/images/login1.jpg";
import ShowPwdPhoto from "@/public/images/showPwd.png";
import HidePwdPhoto from "@/public/images/hidePwd.png";
import Image from "next/image";
import useResponsive from "@/hooks/useResponsive";
import { saveToken } from "@/utils/auth";
import { zIndexLevel } from "@/utils/constants";
import { showToast } from "@/components/Toast";

const StyledRoot = styled("div")(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

const StyledSection = styled(Card)(({ theme }) => ({
    width: "100%",
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: theme.spacing(2, 0, 2, 2),
    borderRadius: 15,
    position: "relative",
}));

const StyledContent = styled("form")(({ theme }) => ({
    maxWidth: 480,
    margin: "auto",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(12, 0),
}));

const Login = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const { snack, setSnack } = useSnackbar();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
    const [isShowPwd, setIsShowPwd] = useState(false);

    const login = async () => {
        if (username.trim() === "" || password.trim() === "") {
            showToast("Username or password can't be empty!", "warning");
            return;
        }
        if (password.length < 8) {
            showToast("Password length can't be less than 8!", "warning");
            return;
        }
        setIsSubmitting(true);
        const res = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
        });
        if (res && res.error) showToast(res.error, "error");

        setIsSubmitting(false);
    };

    const googleLogin = async () => {
        setIsGoogleSubmitting(true);
        try {
            const res = await signIn("google", { redirect: false });
            if (res && res.error) {
                showToast(res.error, "error");
            }
        } catch (error: any) {
            showToast(error.message || "An error occurred", "error");
        } finally {
            setIsGoogleSubmitting(false);
        }
    };

    const mdUp = useResponsive("up", "md");

    useEffect(() => {
        if (session) {
            if (session.user?.error) {
                showToast(session.user?.error, "error");
                signOut({ redirect: false });
            } else {
                saveToken(session);
                router.push("/account");
            }
        }
    }, [session, router]);

    useEffect(() => {
        if (error) showToast(error, "error");
    }, []);

    return (
        <>
            <Head>
                <title>Sign in</title>
            </Head>
            <Snackbar />
            <StyledRoot>
                {mdUp && (
                    <StyledSection>
                        <Image
                            src={LoginPhoto}
                            alt="login"
                            layout="fill"
                            objectFit="cover"
                        />
                    </StyledSection>
                )}
                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textTransform: "uppercase",
                            }}
                        >
                            {/* {t("signIn")} */}
                            Sign In
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                name="username"
                                // label={t("username")}
                                label={"Username"}
                                autoComplete="username"
                                required
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />

                            <Stack direction={"row"} position={"relative"}>
                                <TextField
                                    name="password"
                                    // label={t("password")}
                                    label={"Password"}
                                    type={isShowPwd ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    sx={{ width: "100%" }}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            login();
                                        }
                                    }}
                                />
                                <Button
                                    sx={{
                                        position: "absolute",
                                        zIndex: zIndexLevel.one,
                                        right: 2,
                                        alignSelf: "center",
                                        borderRadius: 100,
                                    }}
                                    onClick={() => setIsShowPwd(!isShowPwd)}
                                >
                                    <Image
                                        src={
                                            isShowPwd
                                                ? ShowPwdPhoto
                                                : HidePwdPhoto
                                        }
                                        alt="Show/hide"
                                        width={24}
                                        height={8}
                                    />
                                </Button>
                            </Stack>
                        </Stack>

                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ my: 2 }}
                        >
                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                // label={t("rememberMe")}
                                label="Remember Me"
                            />
                            <Link
                                variant="subtitle2"
                                underline="hover"
                                href="/forgot-password"
                                sx={{
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                {/* {t("forgotPassword")}? */}
                                Forgot Password?
                            </Link>
                        </Stack>
                        <LoadingButton
                            fullWidth
                            color="secondary"
                            size="medium"
                            // type="submit"
                            variant="text"
                            loading={isSubmitting}
                            loadingIndicator={
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: "white",
                                    }}
                                />
                            }
                            onClick={() => login()}
                            sx={{
                                bgcolor: "black",
                                "&:hover": {
                                    bgcolor: "gray", // Change border color on hover if needed
                                },
                                color: "white",
                                mb: 2,
                            }}
                        >
                            {/* {t("login")} */}
                            Login
                        </LoadingButton>
                        <LoadingButton
                            size="medium"
                            variant="outlined"
                            loading={isGoogleSubmitting}
                            onClick={() => googleLogin()}
                            sx={{
                                bgcolor: "white",
                                color: "black",
                                borderColor: "black",
                                "&:hover": {
                                    bgcolor: "#e8e8e8", // Change border color on hover if needed
                                    borderColor: "black", // Change border color on hover if needed
                                },
                                mb: 2,
                            }}
                        >
                            Login with Google
                        </LoadingButton>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
};

export default Login;
