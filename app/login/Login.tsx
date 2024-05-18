"use client";
import {
    Button,
    Card,
    Checkbox,
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
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import LoginPhoto from "@/public/images/login1.jpg";
import ShowPwdPhoto from "@/public/images/showPwd.png";
import HidePwdPhoto from "@/public/images/hidePwd.png";
import Image from "next/image";
import useResponsive from "@/hooks/useResponsive";

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
    const { data: session, status } = useSession();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const { snack, setSnack } = useSnackbar();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isShowPwd, setIsShowPwd] = useState(false);

    const login = async () => {
        if (username === "" || password === "") {
            // setSnack({
            //     open: true,
            //     type: "error",
            //     message: t("pleaseFillOutAllFields"),
            // });
            return;
        }
        setIsSubmitting(true);
        const res = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
        });
        if (res && res.error) console.log("error", res.error);

        setIsSubmitting(false);
    };

    const mdUp = useResponsive("up", "md");
    if (session) {
        router.push("/");
    }
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
                                        zIndex: 10,
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
                                href="/forgotpassword"
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
                            size="large"
                            // type="submit"
                            variant="text"
                            loading={isSubmitting}
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
                        {/* <Stack id="loginDiv" sx={{ mb: 2 }}>
                            Login with Google
                        </Stack> */}
                        <Button
                            onClick={() => signIn()}
                            sx={{
                                bgcolor: "white",
                                borderColor: "black",
                                borderWidth: 1,
                                color: "black",
                                mb: 2,
                            }}
                        >
                            Login with Google
                        </Button>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
};

export default Login;
