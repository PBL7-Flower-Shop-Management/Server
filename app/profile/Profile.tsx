"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Divider,
    CardActions,
    Skeleton,
    Button,
} from "@mui/material";
import { ProfileAvatar } from "@/components/Profile/ProfileAvatar";
import ProfileDetail from "@/components/Profile/ProfileDetail";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useFormik } from "formik";
import * as yup from "yup";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "@/components/Toast";
import { appendJsonToFormData } from "@/utils/helper";
import { LoadingButton } from "@mui/lab";
import { ChangePwdDialog } from "@/components/Profile/ChangePwdDialog";
import { useTopBarInfoContext } from "@/contexts/TopBarInfoContext";

const Profile = () => {
    const [profile, setProfile] = useState<any>();
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const alreadyRun = useRef(false);
    const { setLoading } = useLoadingContext();
    const [changesMade, setChangesMade] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(true);
    const [openChangePwdDialog, setOpenChangePwdDialog] = useState(false);
    const { setUserInfo } = useTopBarInfoContext();

    const formik = useFormik({
        initialValues: {} as any,
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
            avatarUrl: yup.string().trim().nullable(),
            // isActived: yup.boolean().nullable().default(false),
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

    const getProfile = async () => {
        setLoading(true);
        setLoadingSkeleton(true);

        const response = await FetchApi(UrlConfig.user.getProfile, "GET", true);

        if (response.canRefreshToken === false)
            showToast(response.message, "warning");
        else if (response.succeeded) {
            formik.setValues(response.data);
            setProfile(response.data);
            setUserInfo(response.data);
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
                UrlConfig.user.updateProfile,
                "PUT",
                true,
                isFormData
                    ? appendJsonToFormData(formData, {
                          ...formik.values,
                          _id: undefined,
                          username: undefined,
                          isActived: undefined,
                          avatarUrl: undefined,
                          file: undefined,
                          role: undefined,
                      })
                    : {
                          ...formik.values,
                          _id: undefined,
                          username: undefined,
                          isActived: undefined,
                          file: undefined,
                          role: undefined,
                      },
                isFormData
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
                return false;
            } else if (response.succeeded) {
                showToast("Cập nhật thông tin cá nhân thành công.", "success");
                formik.setValues(response.data);
                setUserInfo(response.data);
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
        setProfile(formik.values);
        setIsFieldDisabled(false);
        setChangesMade(false);
    };

    const handleCancel = () => {
        formik.setValues(profile);
        setIsFieldDisabled(true);
        setChangesMade(false);
    };

    useEffect(() => {
        if (!alreadyRun.current) {
            alreadyRun.current = true;
            getProfile();
        }
    }, []);

    return (
        <>
            <Head>
                <title>Thông tin cá nhân</title>
            </Head>
            <Box
                sx={{
                    flexGrow: 1,
                    mt: 0.5,
                    mb: 1,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={2}>
                        <div>
                            <Typography variant="h4">
                                Thông tin cá nhân
                            </Typography>
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6} lg={4}>
                                    <ProfileAvatar
                                        formik={formik}
                                        loadingSkeleton={loadingSkeleton}
                                        loadingButtonDetails={
                                            loadingButtonDetails
                                        }
                                        isFieldDisabled={isFieldDisabled}
                                    />
                                </Grid>
                                <Grid xs={12} md={6} lg={8}>
                                    <ProfileDetail
                                        formik={formik}
                                        handleChange={handleChange}
                                        loadingSkeleton={loadingSkeleton}
                                        isFieldDisabled={isFieldDisabled}
                                    />
                                    <Divider />
                                    <CardActions
                                        sx={{ justifyContent: "flex-end" }}
                                    >
                                        {loadingSkeleton ? (
                                            <>
                                                <Skeleton
                                                    height={40}
                                                    width={170}
                                                    variant="rounded"
                                                ></Skeleton>
                                                <Skeleton
                                                    height={40}
                                                    width={170}
                                                    variant="rounded"
                                                ></Skeleton>
                                            </>
                                        ) : loadingButtonDetails ? (
                                            <>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={
                                                        loadingButtonDetails
                                                    }
                                                    onClick={() =>
                                                        setOpenChangePwdDialog(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Đổi mật khẩu
                                                </Button>
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
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={
                                                        loadingButtonDetails
                                                    }
                                                    onClick={() =>
                                                        setOpenChangePwdDialog(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Đổi mật khẩu
                                                </Button>
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
                                                    >
                                                        Hủy
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </CardActions>
                                </Grid>
                            </Grid>
                        </div>
                    </Stack>
                </Container>
            </Box>
            <ChangePwdDialog
                open={openChangePwdDialog}
                onClose={() => setOpenChangePwdDialog(false)}
            />
        </>
    );
};

export default Profile;
