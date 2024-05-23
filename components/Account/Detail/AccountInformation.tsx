import React, { useState } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    TextField,
    Unstable_Grid2 as Grid,
    Skeleton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parse } from "date-fns";
import { isActive, role } from "@/utils/constants";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialState = {
    isFieldDisabled: true,
    changesMade: false,
};

// const reducer = (state, action) => {
//     switch (action.type) {
//         case "ENABLE_EDIT":
//             return {
//                 ...state,
//                 isFieldDisabled: false,
//                 changesMade: false,
//             };

//         case "CANCEL_EDIT":
//             return {
//                 ...state,
//                 isFieldDisabled: true,
//                 changesMade: false,
//             };

//         case "UPDATE_ACCOUNT":
//             return {
//                 ...state,
//                 changesMade: true,
//             };
//         case "SUBMIT_FORM":
//             return { ...state, isFieldDisabled: true, changesMade: false };

//         default:
//             return state;
//     }
// };

const AccountInformation = (props: any) => {
    const {
        account,
        loading,
        loadingSkeleton,
        loadingButtonDetails,
        loadingButtonPicture,
        // handleSubmit,
        canEdit,
    } = props;
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);
    const [isClicked, setIsClicked] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [changesMade, setChangesMade] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: account
            ? {
                  ...account,
                  birthday:
                      account.birthday &&
                      parse(account.birthday, "dd/MM/yyyy", new Date()),
                  fatherBirthday:
                      account.fatherBirthday &&
                      parse(account.fatherBirthday, "dd/MM/yyyy", new Date()),
                  motherBirthday:
                      account.motherBirthday &&
                      parse(account.motherBirthday, "dd/MM/yyyy", new Date()),
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
                // handleSubmitGeneral();
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const handleToggleActivation = () => {
        // dispatch({ type: "UPDATE_ACCOUNT" });
        formik.setValues({
            ...formik.values,
            isActive: !formik.values?.isActived,
        });
        formik.handleSubmit();
    };

    const handleChange = (e: any) => {
        // dispatch({ type: "UPDATE_ACCOUNT" });
        formik.handleChange(e);
    };

    const handleSubmit = () => {
        // if (state.changesMade) {
        //     onUpdate({
        //         ...formik.values,
        //         birthday: format(formik.values.birthday, "dd/MM/yyyy"),
        //         gender:
        //             formik.values.gender === true ||
        //             formik.values.gender === "true",
        //         role: parseInt(formik.values.role, 10),
        //         isActive: formik.values?.isActived,
        //     });
        // }
        // dispatch({ type: "SUBMIT_FORM" });
    };

    const handleClick = () => {
        // dispatch({ type: "ENABLE_EDIT" });
        // setOriginalAccount(formik.values);
    };

    const handleCancel = () => {
        // dispatch({ type: "CANCEL_EDIT" });
        // formik.setValues(originalAccount);
    };

    return (
        <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        {[
                            {
                                label: "Tên đăng nhập",
                                name: "username",
                                md: 4,
                                disabled: true,
                            },
                            {
                                label: "Họ và tên",
                                name: "name",
                                required: true,
                                md: 8,
                            },
                            {
                                label: "Căn cước công dân",
                                name: "citizenId",
                                md: 4,
                            },
                            {
                                label: "Email",
                                name: "email",
                                required: true,
                                md: 4,
                            },
                            {
                                label: "Số điện thoại",
                                name: "phoneNumber",
                                textArea: true,
                                md: 4,
                            },
                            {
                                label: "Chức vụ",
                                name: "role",
                                select: true,
                                selectProps: role,
                                md: 6,
                            },
                            {
                                label: "Trạng thái",
                                name: "isActived",
                                md: 6,
                                selectProps: isActive,
                                disabled: true,
                            },
                        ].map((field: any) => (
                            <Grid key={field.name} xs={12} md={field.md || 12}>
                                {loading ||
                                formik.values === null ||
                                formik.values.name === undefined ? (
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
                                        disabled={
                                            isFieldDisabled || field.disabled
                                        }
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
                                        maxDate={new Date()} // Assuming current date is the maximum allowed
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
                                        disabled={
                                            isFieldDisabled || field.disabled
                                        }
                                        label={field.label}
                                        name={field.name}
                                        onBlur={formik.handleBlur}
                                        onChange={handleChange}
                                        type={field.name}
                                        value={
                                            !field.select && field.selectProps
                                                ? field.selectProps[
                                                      formik.values[field.name]
                                                  ]
                                                : formik.values[field.name]
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
                                color={
                                    formik.values?.isActived
                                        ? "error"
                                        : "success"
                                }
                                onClick={handleToggleActivation}
                                disabled={
                                    loadingButtonPicture || loadingButtonDetails
                                }
                            >
                                {formik.values?.isActived
                                    ? "Khoá tài khoản"
                                    : "Mở khoá tài khoản"}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {}}
                                disabled={
                                    loadingButtonPicture || loadingButtonDetails
                                }
                            >
                                Đặt lại mật khẩu
                            </Button>
                            <LoadingButton
                                disabled
                                loading={loadingButtonDetails}
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
                                color={
                                    formik.values?.isActived
                                        ? "error"
                                        : "success"
                                }
                                onClick={handleToggleActivation}
                                disabled={
                                    loadingButtonPicture || loadingButtonDetails
                                }
                            >
                                {formik.values?.isActived
                                    ? "Khoá tài khoản"
                                    : "Mở khoá tài khoản"}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {}}
                                disabled={
                                    loadingButtonPicture || loadingButtonDetails
                                }
                            >
                                Đặt lại mật khẩu
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (isFieldDisabled) handleClick();
                                    else formik.handleSubmit();
                                }}
                                disabled={
                                    loadingButtonPicture || loadingButtonDetails
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
            </Card>
        </form>
    );
};

export default AccountInformation;
