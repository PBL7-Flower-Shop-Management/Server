"use client";
import Head from "next/head";
import NextLink from "next/link";
import { useState, useEffect, useRef } from "react";
import {
    Box,
    Breadcrumbs,
    Container,
    Skeleton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Link,
    Button,
    CardActions,
    Divider,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import AccountInformation from "@/components/Account/Detail/AccountInformation";
import { AccountAvatar } from "@/components/Account/Detail/AccountAvatar";
import { appendJsonToFormData } from "@/utils/helper";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "@/components/Toast";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useFormik } from "formik";
import * as yup from "yup";
import mongoose from "mongoose";
import { LoadingButton } from "@mui/lab";
import { useSession } from "next-auth/react";
import { roleMap } from "@/utils/constants";

const AccountDetail = ({ params }: any) => {
    const [originalAccount, setOriginalAccount] = useState<any>();
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const alreadyRun = useRef(false);
    const { setLoading } = useLoadingContext();
    const [changesMade, setChangesMade] = useState(false);

    const searchParams = useSearchParams();
    const accountId = params?.id;
    const canEdit = searchParams.get("edit") === "1";
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);
    const [isEmployee, setIsEmployee] = useState(true);
    const { data: session } = useSession();

    const formik = useFormik({
        initialValues: {} as any,
        validationSchema: yup.object({
            _id: yup
                .string()
                .trim()
                .required()
                .test("is-objectid", "Invalid account id format", (value) =>
                    mongoose.Types.ObjectId.isValid(value)
                ),
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
            avatarUrl: yup.string().trim().nullable(),
            // isActived: yup.boolean().nullable().default(false),
            role: yup
                .string()
                .trim()
                .nullable()
                .oneOf(["Admin", "Employee", "Customer"], "Invalid role")
                .default("Customer"),
            file: yup
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
                if (
                    changesMade ||
                    formik.values.file ||
                    formik.values.file === null
                ) {
                    setIsFieldDisabled(true);
                    const res = await updateInformation();
                    setIsFieldDisabled(res);
                } else setIsFieldDisabled(true);
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const getAccount = async () => {
        setLoading(true);
        setLoadingSkeleton(true);

        const response = await FetchApi(
            UrlConfig.account.getById.replace("{id}", accountId),
            "GET",
            true
        );

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            formik.setValues(response.data);
            setOriginalAccount(response.data);
            setLoadingSkeleton(false);
        } else {
            showToast(response.message, "error");
        }
        setLoading(false);
    };

    const updateInformation = async () => {
        try {
            setLoadingButtonDetails(true);
            const formData = new FormData();
            let isFormData = false;
            if (formik.values.file || formik.values.file === null) {
                formData.set("avatar", formik.values.file);
                isFormData = true;
            }

            const response = await FetchApi(
                UrlConfig.account.update,
                "PUT",
                true,
                isFormData
                    ? appendJsonToFormData(formData, {
                          ...formik.values,
                          username: undefined,
                          isActived: undefined,
                          avatarUrl: undefined,
                          file: undefined,
                      })
                    : {
                          ...formik.values,
                          username: undefined,
                          isActived: undefined,
                          file: undefined,
                      },
                isFormData
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast(
                    "Cập nhật thông tin chi tiết tài khoản thành công.",
                    "success"
                );
                formik.setValues(response.data);
                return true;
            } else {
                showToast(response.message, "error");
                return false;
            }
        } catch (error: any) {
            showToast(error.message, "error");
            return false;
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const unlockLockAccount = async () => {
        try {
            setLoadingButtonDetails(true);
            const response = await FetchApi(
                UrlConfig.account.lockUnlock,
                "PATCH",
                true,
                { _id: accountId, isActived: !formik.values.isActived }
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast(
                    `${
                        !formik.values.isActived ? "Mở khoá" : "khoá"
                    } tài khoản thành công!`,
                    "success"
                );
                formik.setFieldValue("isActived", response.data);
                setOriginalAccount((prevAccount: any) => ({
                    ...prevAccount,
                    isActived: response.data,
                }));
                return true;
            } else {
                showToast(response.message, "error");
                return false;
            }
        } catch (error: any) {
            showToast(error.message, "error");
            return false;
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const resetPassword = async () => {
        try {
            setLoadingButtonDetails(true);
            const response = await FetchApi(
                UrlConfig.account.resetPassword,
                "PATCH",
                true,
                { _id: accountId }
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast("Đặt lại mật khẩu thành công.", "success");
                return true;
            } else {
                showToast(response.message, "error");
                return false;
            }
        } catch (error: any) {
            showToast(error.message, "error");
            return false;
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const handleChange = (e: any) => {
        formik.handleChange(e);
        setChangesMade(true);
    };

    const handleClick = () => {
        setOriginalAccount(formik.values);
        setIsFieldDisabled(false);
        setChangesMade(false);
    };

    const handleCancel = () => {
        formik.setValues(originalAccount);
        setIsFieldDisabled(true);
        setChangesMade(false);
    };

    useEffect(() => {
        if (!alreadyRun.current) {
            alreadyRun.current = true;
            getAccount();
        }
    }, []);
    useEffect(() => {
        if (session?.user) {
            setIsEmployee(session?.user.role === roleMap.Employee);
        }
    }, [session?.user]);

    return (
        <>
            <Head>
                <title>Tài khoản | {originalAccount?.name}</title>
            </Head>
            <Box
                sx={{
                    flexGrow: 1,
                    mb: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={0}>
                        <div>
                            {loadingSkeleton || !formik.values ? (
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
                                                    backgroundColor: "divider",
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
                                        {originalAccount?.name}
                                    </Typography>
                                </Breadcrumbs>
                            )}
                        </div>
                        <Grid container spacing={3}>
                            <Grid xs={12} md={6} lg={4}>
                                <AccountAvatar
                                    formik={formik}
                                    loadingSkeleton={loadingSkeleton}
                                    loadingButtonDetails={loadingButtonDetails}
                                    isFieldDisabled={isFieldDisabled}
                                />
                            </Grid>
                            <Grid xs={12} md={6} lg={8}>
                                <AccountInformation
                                    formik={formik}
                                    handleChange={handleChange}
                                    loadingSkeleton={loadingSkeleton}
                                    isFieldDisabled={isFieldDisabled}
                                />
                                <Divider />
                                {canEdit && (
                                    <CardActions
                                        sx={{
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        {loadingSkeleton ? (
                                            <>
                                                <Skeleton
                                                    height={40}
                                                    width={170}
                                                    variant="rounded"
                                                ></Skeleton>
                                                {!isEmployee && (
                                                    <Skeleton
                                                        height={40}
                                                        width={170}
                                                        variant="rounded"
                                                    ></Skeleton>
                                                )}
                                                <Skeleton
                                                    height={40}
                                                    width={170}
                                                    variant="rounded"
                                                ></Skeleton>
                                            </>
                                        ) : loadingButtonDetails ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color={
                                                        formik.values?.isActived
                                                            ? "error"
                                                            : "success"
                                                    }
                                                    disabled={
                                                        loadingButtonDetails
                                                    }
                                                >
                                                    {formik.values?.isActived
                                                        ? "Khoá tài khoản"
                                                        : "Mở khoá tài khoản"}
                                                </Button>
                                                {!isEmployee && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        disabled={
                                                            loadingButtonDetails
                                                        }
                                                    >
                                                        Đặt lại mật khẩu
                                                    </Button>
                                                )}
                                                <LoadingButton
                                                    disabled
                                                    loading={
                                                        loadingButtonDetails
                                                    }
                                                    size="medium"
                                                    variant="contained"
                                                >
                                                    Chỉnh sửa thông tin
                                                </LoadingButton>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color={
                                                        formik.values?.isActived
                                                            ? "error"
                                                            : "success"
                                                    }
                                                    onClick={async () => {
                                                        const oldValue =
                                                            isFieldDisabled;
                                                        setIsFieldDisabled(
                                                            true
                                                        );
                                                        await unlockLockAccount();
                                                        setIsFieldDisabled(
                                                            oldValue
                                                        );
                                                    }}
                                                    disabled={
                                                        loadingButtonDetails
                                                    }
                                                >
                                                    {formik.values?.isActived
                                                        ? "Khoá tài khoản"
                                                        : "Mở khoá tài khoản"}
                                                </Button>
                                                {!isEmployee && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={async () => {
                                                            const oldValue =
                                                                isFieldDisabled;
                                                            setIsFieldDisabled(
                                                                true
                                                            );
                                                            await resetPassword();
                                                            setIsFieldDisabled(
                                                                oldValue
                                                            );
                                                        }}
                                                        disabled={
                                                            loadingButtonDetails
                                                        }
                                                    >
                                                        Đặt lại mật khẩu
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        if (isFieldDisabled)
                                                            handleClick();
                                                        else
                                                            formik.handleSubmit();
                                                    }}
                                                    disabled={
                                                        loadingButtonDetails
                                                    }
                                                >
                                                    {isFieldDisabled
                                                        ? "Chỉnh sửa thông tin"
                                                        : "Cập nhật thông tin"}
                                                </Button>
                                                {!isFieldDisabled && (
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleCancel}
                                                        disabled={
                                                            loadingButtonDetails
                                                        }
                                                    >
                                                        Hủy
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </CardActions>
                                )}
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default AccountDetail;
