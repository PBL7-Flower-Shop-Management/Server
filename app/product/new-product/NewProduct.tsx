"use client";
import Head from "next/head";
import {
    Alert,
    Box,
    Collapse,
    Container,
    IconButton,
    Skeleton,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Breadcrumbs,
    Link,
    Button,
    Snackbar,
} from "@mui/material";
import NextLink from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useCallback, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import NewProductInformation from "@/components/Product/NewProduct/NewProductInformation";
import NewProductImages from "@/components/Product/NewProduct/NewProductImages";

const NewProduct = () => {
    const [categories, setCategories] = useState<any>([]);
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [loadingButtonPicture, setLoadingButtonPicture] = useState(false);
    const [loadingButtonDetails, setLoadingButtonDetails] = useState(false);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(true);

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: "",
            categoryId: [],
            habitat: "",
            care: "",
            starsTotal: "",
            feedbacksTotal: "",
            unitPrice: "",
            discount: "",
            quantity: "",
            soldQuantity: "",
            imageVideoFiles: [],
            description: "",
            status: "Available",
            createdAt: new Date(),
            createdBy: "",
            updatedAt: new Date(),
            updatedBy: "",
            isDeleted: false,
            growthTime: "",
        },
        validationSchema: Yup.object({
            // name: Yup.string()
            //     .max(100, messages.LIMIT_NAME)
            //     .required(messages.REQUIRED_NAME)
            //     .matches(
            //         /^[ '\p{L}]+$/u,
            //         messages.NAME_CONTAINS_VALID_CHARACTER
            //     ),
            // anotherName: Yup.string()
            //     .max(100, messages.LIMIT_ANOTHER_NAME)
            //     .required(messages.REQUIRED_ANOTHER_NAME)
            //     .matches(
            //         /^[ '\p{L}]+$/u,
            //         messages.ANOTHER_NAME_CONTAINS_VALID_CHARACTER
            //     ),
            // citizenId: Yup.string()
            //     .max(12, messages.LIMIT_CITIZEN_ID)
            //     .required(messages.REQUIRED_CITIZEN_ID)
            //     .matches(/^[0-9]+$/u, messages.CITIZEN_ID_VALID_CHARACTER),
            // phoneNumber: Yup.string()
            //     .matches(
            //         /^(?:\+84|84|0)(3|5|7|8|9|1[2689])([0-9]{8,10})\b$/,
            //         messages.INVALID_PHONE_NUMBER
            //     )
            //     .max(15, messages.LIMIT_PHONENUMBER)
            //     .required(messages.REQUIRED_PHONENUMBER),
            // careerAndWorkplace: Yup.string()
            //     .max(300, messages.LIMIT_CAREER_AND_WORKPLACE)
            //     .required(messages.REQUIRED_CAREER_AND_WORKPLACE)
            //     .matches(
            //         /^[\p{L}0-9,.: -]+$/u,
            //         messages.CAREER_AND_WORKPLACE_VALID_CHARACTER
            //     ),
            // characteristics: Yup.string()
            //     .max(500, messages.LIMIT_CHARACTERISTICS)
            //     .required(messages.REQUIRED_CHARACTERISTICS)
            //     .matches(
            //         /^[\p{L}, ]+$/u,
            //         messages.CHARACTERISTICS_VALID_CHARACTER
            //     ),
            // homeTown: Yup.string()
            //     .max(200, messages.LIMIT_HOME_TOWN)
            //     .required(messages.REQUIRED_HOME_TOWN)
            //     .matches(
            //         /^[\p{L}0-9,. ]+$/u,
            //         messages.HOME_TOWN_VALID_CHARACTER
            //     ),
            // ethnicity: Yup.string()
            //     .max(50, messages.LIMIT_ETHNICITY)
            //     .required(messages.REQUIRED_ETHNICITY)
            //     .matches(/^[\p{L} ]+$/u, messages.ETHNICITY_VALID_CHARACTER),
            // religion: Yup.string()
            //     .max(50, messages.LIMIT_RELIGION)
            //     .matches(/^[\p{L} ]+$/u, messages.RELIGION_VALID_CHARACTER),
            // nationality: Yup.string()
            //     .max(50, messages.LIMIT_NATIONALITY)
            //     .required(messages.REQUIRED_NATIONALITY)
            //     .matches(/^[\p{L} ]+$/u, messages.NATIONALITY_VALID_CHARACTER),
            // fatherName: Yup.string()
            //     .max(100, messages.LIMIT_FATHER_NAME)
            //     .required(messages.REQUIRED_FATHER_NAME)
            //     .matches(
            //         /^[\p{L} ']+$/u,
            //         messages.NAME_CONTAINS_VALID_CHARACTER
            //     ),
            // fatherCitizenId: Yup.string()
            //     .max(12, messages.LIMIT_FATHER_CITIZEN_ID)
            //     .required(messages.REQUIRED_FATHER_CITIZEN_ID)
            //     .matches(/^[0-9]+$/u, messages.CITIZEN_ID_VALID_CHARACTER),
            // motherName: Yup.string()
            //     .max(100, messages.LIMIT_MOTHER_NAME)
            //     .required(messages.REQUIRED_MOTHER_NAME)
            //     .matches(
            //         /^[\p{L} ']+$/u,
            //         messages.NAME_CONTAINS_VALID_CHARACTER
            //     ),
            // motherCitizenId: Yup.string()
            //     .max(12, messages.LIMIT_MOTHER_CITIZEN_ID)
            //     .required(messages.REQUIRED_MOTHER_CITIZEN_ID)
            //     .matches(/^[0-9]+$/u, messages.CITIZEN_ID_VALID_CHARACTER),
            // permanentResidence: Yup.string()
            //     .max(200, messages.LIMIT_PERMANENT_RESIDENCE)
            //     .required(messages.REQUIRED_PERMANENT_RESIDENCE)
            //     .matches(
            //         /^[\p{L}0-9,. ]+$/u,
            //         messages.PERMANENT_RESIDENCE_VALID_CHARACTER
            //     ),
            // currentAccommodation: Yup.string()
            //     .max(200, messages.LIMIT_CURRENT_ACCOMMODATION)
            //     .required(messages.REQUIRED_CURRENT_ACCOMMODATION)
            //     .matches(
            //         /^[\p{L}0-9,. ]+$/u,
            //         messages.CURRENT_ACCOMMODATION_VALID_CHARACTER
            //     ),
            // phoneModel: Yup.string()
            //     .max(100, messages.LIMIT_PHONE_MODEL)
            //     .required(messages.REQUIRED_PHONE_MODEL)
            //     .matches(
            //         /^[\p{L}0-9 ]+$/u,
            //         messages.PHONE_MODE_VALID_CHARACTER
            //     ),
            // entryAndExitInformation: Yup.string()
            //     .max(500, messages.LIMIT_ENTRY_AND_EXIT_INFORMATION)
            //     .matches(
            //         /^[\p{L}0-9,.: -]+$/u,
            //         messages.ENTRY_AND_EXIT_INFORMATION_VALID_CHARACTER
            //     ),
            // facebook: Yup.string()
            //     .max(100, messages.LIMIT_FACEBOOK)
            //     .matches(
            //         /^[\p{L}0-9,.: -]+$/u,
            //         messages.FACEBOOK_VALID_CHARACTER
            //     ),
            // zalo: Yup.string()
            //     .max(100, messages.LIMIT_ZALO)
            //     .matches(/^[0-9]+$/u, messages.ZALO_VALID_CHARACTER),
            // otherSocialNetworks: Yup.string().max(
            //     300,
            //     messages.LIMIT_OTHER_SOCIAL_NETWORKS
            // ),
            // gameAccount: Yup.string().max(100, messages.LIMIT_GAME_ACCOUNT),
            // bankAccount: Yup.string()
            //     .nullable()
            //     .max(30, messages.LIMIT_BANK_ACCOUNT)
            //     .matches(
            //         /^[\p{L}0-9 ]+$/u,
            //         messages.BANK_ACCOUNT_VALID_CHARACTER
            //     ),
            // vehicles: Yup.string()
            //     .nullable()
            //     .max(100, messages.LIMIT_VEHICLES)
            //     .matches(
            //         /^[\p{L}0-9,.: -]+$/u,
            //         messages.VEHICLES_VALID_CHARACTER
            //     ),
            // dangerousLevel: Yup.string()
            //     .nullable()
            //     .max(200, messages.LIMIT_DANGEROUS_LEVEL)
            //     .matches(
            //         /^[\p{L}0-9,.: -]+$/u,
            //         messages.DANGEROUS_LEVEL_VALID_CHARACTER
            //     ),
            // otherInformation: Yup.string()
            //     .nullable()
            //     .max(500, messages.LIMIT_OTHER_INFORMATION),
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
            setLoadingButtonDetails(true);
            // let { image, ...newProduct } = formik.values;
            // newProduct = {
            //     ...newProduct,
            //     birthday:
            //         newProduct.birthday &&
            //         format(newProduct.birthday, "dd/MM/yyyy"),
            //     fatherBirthday:
            //         newProduct.fatherBirthday &&
            //         format(newProduct.fatherBirthday, "dd/MM/yyyy"),
            //     motherBirthday:
            //         newProduct.motherBirthday &&
            //         format(newProduct.motherBirthday, "dd/MM/yyyy"),
            //     gender:
            //         newProduct.gender === true || newProduct.gender === "true",
            //     releaseDate:
            //         newProduct.releaseDate &&
            //         format(newProduct.releaseDate, "dd/MM/yyyy"),
            //     status: Number(newProduct.status),
            // };
            // console.log(newProduct);
            // await productsApi.addProduct(newProduct, auth);
            setSuccess("Thêm sản phẩm thành công.");
            setError("");
            setIsFieldDisabled(true);
            setButtonDisabled(true);
        } catch (error: any) {
            setIsFieldDisabled(false);
            setButtonDisabled(false);
            setSuccess("");
            setError(error.message);
            console.log(error);
        } finally {
            setLoadingButtonDetails(false);
        }
    };

    const uploadImage = useCallback(
        async (newImage: any) => {
            try {
                // const response = await imagesApi.uploadImage(newImage);
                // formik.setValues({
                //     ...formik.values,
                //     // avatar: response[0].filePath,
                //     avatarLink: response[0].fileUrl,
                // });
                setSuccess("Thêm ảnh đại diện sản phẩm thành công.");
                setError("");
            } catch (error: any) {
                setError(error.message);
                setSuccess("");
                console.log(error);
            }
        },
        [formik.values]
    );

    const updateAccountPicture = useCallback(
        async (newImage: any) => {
            try {
                setLoadingButtonPicture(true);
                await uploadImage(newImage);
                setOpen(true);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingButtonPicture(false);
            }
        },
        [uploadImage]
    );

    const getCategories = () => {
        setCategories([
            {
                _id: "663047485c22d11402fcc6d3",
                categoryName: "Hoa trồng vườn",
                image: "https://th.bing.com/th/id/OIP.f-FXUJ0aDZgeT7USzI7CUgHaKW?rs=1&pid=ImgDetMain",
                description:
                    "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
            },
            {
                _id: "663047485c22d11402fcc6d4",
                categoryName: "Hoa trưng bày",
                image: "https://th.bing.com/th/id/OIP.IDIBlRIRqoabOvqKdaToLgHaHg?rs=1&pid=ImgDetMain",
                description:
                    "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
            },
            {
                _id: "663047485c22d11402fcc6d8",
                categoryName: "Hoa tốt nghiệp",
                image: "https://file1.hutech.edu.vn/file/news/tot_nghiep_2-1561445014.png",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d6",
                categoryName: "Hoa khai trương",
                image: "https://juro.com.vn/wp-content/uploads/mau-phong-nen-khai-truong-3.jpg",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d7",
                categoryName: "Hoa cưới",
                image: "https://th.bing.com/th/id/R.94ced6306675d8e8950bc8dfebb6ba00?rik=9uxw5rY1bzM0kQ&pid=ImgRaw&r=0",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d5",
                categoryName: "Hoa sinh nhật",
                image: "https://th.bing.com/th/id/R.1110331de5a4c5a98db02fe00f876b4e?rik=IfafVIxyoYdnLw&riu=http%3a%2f%2fhinhnenhd.com%2fwp-content%2fuploads%2f2021%2f11%2fHinh-anh-chuc-mung-sinh-nhat-dep-y-nghia-23.jpg&ehk=NiCTn3VrqMORZ1cxUpmybo4zEekg4tQQ5ozNFUeqqTg%3d&risl=&pid=ImgRaw&r=0",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6d9",
                categoryName: "Hoa tang lễ",
                image: "https://static.wixstatic.com/media/9d8ed5_63efad3fb2594010bd409d19d3ef8aa0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_90/9d8ed5_63efad3fb2594010bd409d19d3ef8aa0~mv2.jpg",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
            {
                _id: "663047485c22d11402fcc6da",
                categoryName: "Hoa chúc mừng",
                image: "https://media.istockphoto.com/vectors/party-popper-with-confetti-vector-id1125716911?k=6&m=1125716911&s=170667a&w=0&h=2QJzLxp2RFqt96beEhaWzdHHIrLUD6FOK2h3Ns4WH0s=",
                description:
                    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
            },
        ]);
    };

    useEffect(() => getCategories(), []);

    return (
        <>
            <Head>
                <title>Sản phẩm | Thêm sản phẩm </title>
            </Head>
            <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        flexGrow: 1,
                        mb: 2,
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack spacing={0} pb={1}>
                            <div>
                                {loadingSkeleton ? (
                                    <Skeleton variant="rounded">
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                mb: 2.5,
                                            }}
                                        >
                                            Sản phẩm
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
                                            href="/product"
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
                                                Sản phẩm
                                            </Typography>
                                        </Link>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: "primary.main",
                                            }}
                                        >
                                            Thêm sản phẩm
                                        </Typography>
                                    </Breadcrumbs>
                                )}
                            </div>
                            <div>
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={12} lg={12}>
                                        <NewProductInformation
                                            formik={formik}
                                            initCategories={categories}
                                            loadingSkeleton={loadingSkeleton}
                                            isFieldDisabled={isFieldDisabled}
                                        />
                                    </Grid>

                                    <Grid xs={12} md={12} lg={12}>
                                        <NewProductImages
                                            formik={formik}
                                            loadingSkeleton={loadingSkeleton}
                                            loadingButtonDetails={
                                                loadingButtonDetails
                                            }
                                            loadingButtonPicture={
                                                loadingButtonPicture
                                            }
                                            // onUpdate={updateProductPicture}
                                            success={success}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={12} lg={12}>
                                        <Stack
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            {formik.isSubmitting ||
                                            loadingButtonDetails ? (
                                                <>
                                                    <LoadingButton
                                                        disabled
                                                        loading={
                                                            formik.isSubmitting ||
                                                            loadingButtonDetails
                                                        }
                                                        size="medium"
                                                        variant="contained"
                                                    >
                                                        Thêm sản phẩm
                                                    </LoadingButton>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonPicture ||
                                                            loadingButtonDetails ||
                                                            buttonDisabled
                                                        }
                                                        variant="outlined"
                                                        component={NextLink}
                                                        href="/product"
                                                        sx={{
                                                            color: "neutral.500",
                                                            borderColor:
                                                                "neutral.500",
                                                        }}
                                                    >
                                                        Huỷ
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonPicture ||
                                                            buttonDisabled
                                                        }
                                                        type="submit"
                                                        variant="contained"
                                                    >
                                                        Thêm sản phẩm
                                                    </Button>
                                                    <Button
                                                        disabled={
                                                            formik.isSubmitting ||
                                                            loadingButtonPicture ||
                                                            loadingButtonDetails ||
                                                            buttonDisabled
                                                        }
                                                        variant="outlined"
                                                        component={NextLink}
                                                        href="/product"
                                                        sx={{
                                                            color: "neutral.500",
                                                            borderColor:
                                                                "neutral.500",
                                                            "&:hover": {
                                                                borderColor:
                                                                    "neutral.600",
                                                                backgroundColor:
                                                                    "neutral.100",
                                                            },
                                                        }}
                                                    >
                                                        Huỷ
                                                    </Button>
                                                </>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
                                {success && (
                                    <Collapse in={open}>
                                        <Snackbar
                                            open={open}
                                            autoHideDuration={6000}
                                            onClose={() => setOpen(false)}
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "center",
                                            }}
                                        >
                                            <Alert
                                                variant="outlined"
                                                severity="success"
                                                action={
                                                    <IconButton
                                                        aria-label="close"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => {
                                                            setOpen(false);
                                                            router.push(
                                                                "/product"
                                                            );
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="inherit" />
                                                    </IconButton>
                                                }
                                                sx={{
                                                    mt: 2,
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <Typography
                                                    color="success"
                                                    variant="subtitle2"
                                                >
                                                    {success}
                                                </Typography>
                                            </Alert>
                                        </Snackbar>
                                    </Collapse>
                                )}
                                {error && (
                                    <Collapse in={open}>
                                        <Snackbar
                                            open={open}
                                            autoHideDuration={6000}
                                            onClose={() => setOpen(false)}
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "center",
                                            }}
                                        >
                                            <Alert
                                                variant="outlined"
                                                severity="error"
                                                action={
                                                    <IconButton
                                                        aria-label="close"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => {
                                                            setOpen(false);
                                                            router.push(
                                                                "/product"
                                                            );
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="inherit" />
                                                    </IconButton>
                                                }
                                                sx={{
                                                    mt: 2,
                                                    borderRadius: "12px",
                                                }}
                                            >
                                                <Typography
                                                    color="error"
                                                    variant="subtitle2"
                                                >
                                                    {error}
                                                </Typography>
                                            </Alert>
                                        </Snackbar>
                                    </Collapse>
                                )}
                            </div>
                        </Stack>
                    </Container>
                </Box>
            </form>
        </>
    );
};

export default NewProduct;
