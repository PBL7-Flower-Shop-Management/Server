"use client";
import {
    Card,
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
        // if (email !== "") {
        fetch(
            process.env.NEXT_PUBLIC_SERVER_API_BASE + "/user/forgot-password",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    resetPasswordPageUrl:
                        process.env.NEXT_PUBLIC_RESET_PWD_PAGE_URL,
                }),
            }
        )
            .then(async (res) => {
                if (!res.ok) {
                    alert((await res.json()).message);
                } else return res.json();
            })
            .then((response) => {
                if (response) {
                    console.log(response);
                    saveData(email, "reset_email");
                    alert(
                        "We sent reset password link to your email! Please check email and follow by instruction!"
                    );
                }
            })
            .catch((error) => {
                alert("Error, check console to view!");
                console.log(error);
            });
        // }
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
