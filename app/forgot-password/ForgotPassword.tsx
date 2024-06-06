"use client";
import {
    Card,
    CircularProgress,
    Container,
    Snackbar,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { saveData } from "@/utils/auth";
import UrlConfig from "@/config/UrlConfig";
import { FetchApi } from "@/utils/FetchApi";
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

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    // const { snack, setSnack } = useSnackbar();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ResetPassword = async () => {
        if (email.trim() === "") {
            showToast("Email is required!", "warning");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast("Email format is invalid!", "warning");
            return;
        }
        setIsSubmitting(true);
        const response = await FetchApi(
            UrlConfig.user.forgotPassword,
            "PATCH",
            false,
            {
                email: email,
                resetPasswordPageUrl:
                    process.env.NEXT_PUBLIC_HOST_URL + "/reset-password",
            }
        );
        setIsSubmitting(false);
        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            saveData(email, "reset_email");
            showToast(
                "We sent reset password link to your email! Please check email and follow by instruction!",
                "success"
            );
        } else {
            showToast(response.message, "error");
        }
    };

    return (
        <>
            <Head>
                <title>Forgot password</title>
            </Head>
            <Snackbar />
            <StyledRoot>
                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textTransform: "uppercase",
                                textAlign: "center",
                            }}
                        >
                            {/* {t("signIn")} */}
                            Forgot password
                        </Typography>
                        <Typography
                            sx={{ fontStyle: "italic", fontFamily: "initial" }}
                        >
                            {"Enter your account's email to reset password!"}
                        </Typography>
                        <TextField
                            name="email"
                            // label={t("username")}
                            label={"Email"}
                            // autoComplete="email"
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />

                        <LoadingButton
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
                            sx={{
                                bgcolor: "black",
                                "&:hover": {
                                    bgcolor: "gray", // Change border color on hover if needed
                                },
                                color: "white",
                                mb: 1,
                                mt: 2,
                            }}
                            onClick={() => ResetPassword()}
                        >
                            {/* {t("ForgotPassword")} */}
                            Reset password
                        </LoadingButton>

                        <LoadingButton
                            size="medium"
                            variant="outlined"
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
                            onClick={() => router.back()}
                        >
                            Back
                        </LoadingButton>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
};

export default ForgotPassword;
