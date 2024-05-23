import {
    Unstable_Grid2 as Grid,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Divider,
    Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Skeleton from "@mui/material/Skeleton";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format, parse } from "date-fns";
import { useState, useEffect } from "react";
import moment from "moment-timezone";

const OrderInformation = (props: any) => {
    const {
        order,
        loading,
        loadingButtonDetails,
        loadingButtonPicture,
        handleSubmit,
        canEdit,
    } = props;
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);
    const [isClicked, setIsClicked] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [changesMade, setChangesMade] = useState(false);

    useEffect(() => {
        if (!loadingButtonDetails && hasSubmitted) {
            setIsClicked(false);
            setHasSubmitted(false);
        }
    }, [loadingButtonDetails, hasSubmitted]);

    const handleEditGeneral = () => {
        setIsFieldDisabled(false);
        setIsClicked(false);
        setChangesMade(false);
    };

    const handleSubmitGeneral = () => {
        setIsFieldDisabled(true);
        setIsClicked(true);
        setHasSubmitted(true);
        if (changesMade)
            handleSubmit({
                ...formik.values,
                birthday:
                    formik.values.birthday &&
                    format(formik.values.birthday, "dd/MM/yyyy"),
                fatherBirthday:
                    formik.values.fatherBirthday &&
                    format(formik.values.fatherBirthday, "dd/MM/yyyy"),
                motherBirthday:
                    formik.values.motherBirthday &&
                    format(formik.values.motherBirthday, "dd/MM/yyyy"),
                gender:
                    formik.values.gender === true ||
                    formik.values.gender === "true",
            });
    };

    const handleCancelGeneral = () => {
        setIsClicked(false);
        setIsFieldDisabled(true);
        formik.setValues({
            ...order,
            birthday: parse(order.birthday, "dd/MM/yyyy", new Date()),
            fatherBirthday: parse(
                order.fatherBirthday,
                "dd/MM/yyyy",
                new Date()
            ),
            motherBirthday: parse(
                order.motherBirthday,
                "dd/MM/yyyy",
                new Date()
            ),
        });
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: order
            ? {
                  ...order,
                  birthday:
                      order.birthday &&
                      parse(order.birthday, "dd/MM/yyyy", new Date()),
                  fatherBirthday:
                      order.fatherBirthday &&
                      parse(order.fatherBirthday, "dd/MM/yyyy", new Date()),
                  motherBirthday:
                      order.motherBirthday &&
                      parse(order.motherBirthday, "dd/MM/yyyy", new Date()),
              }
            : null,
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
        }),
        onSubmit: async (values: any, helpers: any) => {
            try {
                handleSubmitGeneral();
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
            <Card
                sx={{
                    p: 0,
                }}
            >
                <CardContent>
                    <Box sx={{ fontWeight: 700, marginBottom: 1 }}>
                        Thông tin chung
                    </Box>
                    <Grid container spacing={3}>
                        {[
                            {
                                label: "Mã đơn hàng",
                                name: "_id",
                                md: 6,
                                disabled: true,
                            },
                            {
                                label: "Người đặt hàng",
                                name: "username",
                                md: 6,
                                disabled: true,
                            },
                            {
                                label: "Ngày đặt hàng",
                                name: "orderDate",
                                md: 6,
                            },
                            {
                                label: "Ngày giao hàng",
                                name: "shipDate",
                                md: 6,
                            },
                            {
                                label: "Địa chỉ giao hàng",
                                name: "shipAddress",
                                textArea: true,
                                md: 12,
                            },
                            {
                                label: "Đơn giá ($)",
                                name: "unitPrice",
                                md: 3,
                            },
                            {
                                label: "Giảm giá (%)",
                                name: "discount",
                                md: 3,
                            },
                            {
                                label: "Phí ship",
                                name: "shipPrice",
                                md: 3,
                            },
                            {
                                label: "Tổng tiền",
                                name: "totalPrice",
                                md: 3,
                            },
                            {
                                label: "Phương thức thanh toán",
                                name: "paymentMethod",
                                md: 8,
                            },
                            {
                                label: "Trạng thái",
                                name: "status",
                                md: 4,
                            },
                            {
                                label: "Ghi chú",
                                name: "note",
                                textArea: true,
                                md: 12,
                            },
                        ].map((field: any) => (
                            <Grid key={field.name} xs={12} md={field.md || 12}>
                                {loading || formik.values === null ? (
                                    <Skeleton variant="rounded">
                                        <TextField fullWidth />
                                    </Skeleton>
                                ) : field.datePicker ? (
                                    <DatePicker
                                        // error={
                                        //     !!(
                                        //         formik.touched[field.name] &&
                                        //         formik.errors[field.name]
                                        //     )
                                        // }
                                        // fullWidth
                                        // helperText={
                                        //     formik.touched[field.name] &&
                                        //     formik.errors[field.name]
                                        // }
                                        label={field.label}
                                        name={field.name}
                                        // onBlur={formik.handleBlur}
                                        onChange={(date: any) => {
                                            setChangesMade(true);
                                            formik.setFieldValue(
                                                field.name,
                                                date
                                            );
                                        }}
                                        // type={field.name}
                                        value={formik.values[field.name]}
                                        disabled={
                                            isFieldDisabled || field.disabled
                                        }
                                        // renderInput={(params: any) => (
                                        //     <TextField
                                        //         {...params}
                                        //         fullWidth
                                        //         InputLabelProps={{
                                        //             shrink: true,
                                        //         }}
                                        //         required={
                                        //             field.required || false
                                        //         }
                                        //         onKeyDown={(e) =>
                                        //             e.preventDefault()
                                        //         }
                                        //     />
                                        // )}
                                        // maxDate={new Date()} // Assuming current date is the maximum allowed
                                    />
                                ) : (
                                    <TextField
                                        error={
                                            !!(
                                                formik.touched[field.name] &&
                                                formik.errors[field.name]
                                            )
                                        }
                                        fullWidth
                                        // helperText={
                                        //     formik.touched[field.name] &&
                                        //     formik.errors[field.name]
                                        // }
                                        label={field.label}
                                        name={field.name}
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            setChangesMade(true);
                                            formik.handleChange(e);
                                        }}
                                        type={field.name}
                                        value={formik.values[field.name]}
                                        multiline={field.textArea || false}
                                        disabled={
                                            isFieldDisabled || field.disabled
                                        }
                                        required={field.required || false}
                                        select={field.select}
                                        SelectProps={
                                            field.select
                                                ? { native: true }
                                                : undefined
                                        }
                                        sx={{
                                            "& .MuiInputBase-input": {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            },
                                        }}
                                    >
                                        {field.select &&
                                            field.selectProps &&
                                            Object.entries(
                                                field.selectProps
                                            ).map(([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label as any}
                                                </option>
                                            ))}
                                    </TextField>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
                <Divider />
                {canEdit && (
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                        {isClicked ? (
                            loadingButtonDetails && (
                                <LoadingButton
                                    disabled
                                    loading={loadingButtonDetails}
                                    size="medium"
                                    variant="contained"
                                >
                                    Lưu
                                </LoadingButton>
                            )
                        ) : (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (isFieldDisabled)
                                            handleEditGeneral();
                                        else formik.handleSubmit();
                                    }}
                                    disabled={loadingButtonPicture}
                                >
                                    Cập nhật thông tin
                                </Button>
                                {!isFieldDisabled && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancelGeneral}
                                    >
                                        Hủy
                                    </Button>
                                )}
                            </>
                        )}
                    </CardActions>
                )}
            </Card>
        </form>
    );
};

export default OrderInformation;
