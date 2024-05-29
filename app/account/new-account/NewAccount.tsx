"use client";
import Head from "next/head";
import {
    Box,
    Container,
    Skeleton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Breadcrumbs,
    Link,
    Button,
} from "@mui/material";
import NextLink from "next/link";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { NewAccountAvatar } from "@/components/Account/NewAccount/NewAccountAvatar";
import { NewAccountInformation } from "@/components/Account/NewAccount/NewAccountInformation";
import { showToast } from "@/components/Toast";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { appendJsonToFormData } from "@/utils/helper";
import * as yup from "yup";
import { useLoadingContext } from "@/contexts/LoadingContext";

const NewAccount = () => {
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { setLoading } = useLoadingContext();

    const formik = useFormik({
        initialValues: {
            username: "",
            name: "",
            citizenId: "",
            email: "",
            phoneNumber: "",
            isActived: false,
            role: "Customer",
            avatar: null,
        },
        validationSchema: yup.object({
            name: yup
                .string()
                .trim()
                .required("Name is required")
                .matches(
                    /^[ \p{L}]+$/u,
                    "Name field only contains unicode characters or spaces!"
                ),
            citizenId: yup
                .string()
                .trim()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .matches(/^[0-9]*$/u, "CitizenId field only contains numbers!"),
            email: yup
                .string()
                .trim()
                .required("Email is required")
                .email("Please provide a valid email!"),
            phoneNumber: yup
                .string()
                .trim()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .matches(
                    /^[0-9]*$/u,
                    "Phone number field only contains numbers!"
                ),
            isActived: yup.boolean().nullable().default(false),
            role: yup
                .string()
                .trim()
                .transform((curr, orig) => (orig === "" ? null : curr))
                .nullable()
                .oneOf(["Admin", "Employee", "Customer"], "Invalid role")
                .default("Customer"),
            avatar: yup
                .mixed()
                .nullable()
                .test(
                    "fileFormat",
                    "Ảnh tải lên không hợp lệ!",
                    (value: any) => {
                        if (value && value.type) {
                            return value.type.startsWith("image/");
                        }
                        return true;
                    }
                ),
        }),

        onSubmit: async (values, helpers: any) => {
            try {
                handleSubmit();
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const handleSubmit = async () => {
        try {
            setIsFieldDisabled(true);
            setButtonDisabled(true);
            setLoadingButtonDetails(true);
            const formData = new FormData();
            let isFormData = false;
            if (formik.values.avatar) {
                formData.set("avatar", formik.values.avatar);
                isFormData = true;
            }
            const response = await FetchApi(
                UrlConfig.account.create,
                "POST",
                true,
                isFormData
                    ? appendJsonToFormData(formData, {
                          ...formik.values,
                          username: undefined,
                          avatar: undefined,
                      })
                    : {
                          ...formik.values,
                          username: undefined,
                          avatar: undefined,
                      },
                isFormData
            );
            if (response.canRefreshToken === false) {
                setIsFieldDisabled(false);
                setButtonDisabled(false);
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast("Thêm tài khoản mới thành công.", "success");
                formik.setValues({
                    ...response.data,
                    avatar: formik.values.avatar,
                });
                return true;
            } else {
                setIsFieldDisabled(false);
                setButtonDisabled(false);
                showToast(response.message, "error");
                return false;
            }
        } catch (error: any) {
            setIsFieldDisabled(false);
            setButtonDisabled(false);
            showToast(error.message ?? error, "error");
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const uploadImage = async (newImage: any) => {
        try {
            formik.setValues({
                ...formik.values,
                avatar: newImage,
            });
        } catch (error: any) {
            showToast(error.message ?? error, "error");
        }
    };

    const handleAddOtherAccount = (e: any) => {
        setButtonDisabled(false);
        setIsFieldDisabled(false);
        formik.handleReset(e);
    };

    useEffect(() => setLoading(false), []);

    return (
        <>
            <Head>
                <title>Tài khoản | Thêm tài khoản</title>
            </Head>
            <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        flexGrow: 1,
                        mb: 2,
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack spacing={0}>
                            <div>
                                {loadingSkeleton ? (
                                    <Skeleton variant="rounded">
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                mb: 2.5,
                                            }}
                                        >
                                            Tài khoản
                                        </Typography>
                                    </Skeleton>
                                ) : (
                                    <Breadcrumbs
                                        sx={{
                                            mb: 1.5,
                                        }}
                                        separator="›"
                                        aria-label="breadcrumb"
                                    >
                                        <Link
                                            component={NextLink}
                                            underline="none"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                            href="/account"
                                            onClick={() => setLoading(true)}
                                            color="text.primary"
                                        >
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    marginLeft: "-8px",
                                                    marginRight: "-8px",
                                                    padding: "6px 8px",
                                                    "&:hover": {
                                                        transition:
                                                            "0.2s all ease-in-out",
                                                        backgroundColor:
                                                            "divider",
                                                        padding: "6px 8px",
                                                        borderRadius: "8px",
                                                    },
                                                }}
                                            >
                                                Tài khoản
                                            </Typography>
                                        </Link>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: "primary.main",
                                            }}
                                        >
                                            Thêm tài khoản
                                        </Typography>
                                    </Breadcrumbs>
                                )}
                            </div>
                            <div>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={6} lg={4}>
                                        <NewAccountAvatar
                                            loadingSkeleton={loadingSkeleton}
                                            loadingButtonDetails={
                                                loadingButtonDetails
                                            }
                                            error={formik.errors.avatar}
                                            onUpdate={uploadImage}
                                            isFieldDisabled={isFieldDisabled}
                                            buttonDisabled={buttonDisabled}
                                            reset={!formik.values.avatar}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={6} lg={8}>
                                        <>
                                            <NewAccountInformation
                                                formik={formik}
                                                loadingSkeleton={
                                                    loadingSkeleton
                                                }
                                                isFieldDisabled={
                                                    isFieldDisabled
                                                }
                                            />
                                            <Stack
                                                direction="row"
                                                justifyContent="flex-end"
                                                alignItems="center"
                                                spacing={1}
                                                sx={{
                                                    mt: 2,
                                                }}
                                            >
                                                {buttonDisabled ? (
                                                    <>
                                                        <LoadingButton
                                                            loading={
                                                                formik.isSubmitting ||
                                                                loadingButtonDetails
                                                            }
                                                            onClick={(e) =>
                                                                handleAddOtherAccount(
                                                                    e
                                                                )
                                                            }
                                                            size="medium"
                                                            variant="contained"
                                                        >
                                                            Thêm tài khoản khác
                                                        </LoadingButton>
                                                    </>
                                                ) : formik.isSubmitting ||
                                                  loadingButtonDetails ? (
                                                    <>
                                                        <Button
                                                            disabled={
                                                                formik.isSubmitting ||
                                                                loadingButtonDetails ||
                                                                buttonDisabled
                                                            }
                                                            variant="outlined"
                                                            color="error"
                                                        >
                                                            Khôi phục biểu mẫu
                                                        </Button>
                                                        <LoadingButton
                                                            disabled
                                                            loading={
                                                                formik.isSubmitting ||
                                                                loadingButtonDetails
                                                            }
                                                            size="medium"
                                                            variant="contained"
                                                        >
                                                            Thêm tài khoản
                                                        </LoadingButton>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            disabled={
                                                                formik.isSubmitting ||
                                                                loadingButtonDetails ||
                                                                buttonDisabled
                                                            }
                                                            variant="outlined"
                                                            onClick={
                                                                formik.handleReset
                                                            }
                                                            color="error"
                                                        >
                                                            Khôi phục biểu mẫu
                                                        </Button>
                                                        <Button
                                                            disabled={
                                                                formik.isSubmitting ||
                                                                buttonDisabled
                                                            }
                                                            type="submit"
                                                            variant="contained"
                                                        >
                                                            Thêm tài khoản
                                                        </Button>
                                                        <Button
                                                            disabled={
                                                                formik.isSubmitting ||
                                                                loadingButtonDetails ||
                                                                buttonDisabled
                                                            }
                                                            variant="outlined"
                                                            component={NextLink}
                                                            onClick={() =>
                                                                setLoading(true)
                                                            }
                                                            href="/account"
                                                        >
                                                            Huỷ
                                                        </Button>
                                                    </>
                                                )}
                                            </Stack>
                                        </>
                                    </Grid>
                                </Grid>
                            </div>
                        </Stack>
                    </Container>
                </Box>
            </form>
        </>
    );
};

export default NewAccount;
