import {
    TextField,
    Unstable_Grid2 as Grid,
    Skeleton,
    SvgIcon,
    Stack,
    Tooltip,
    Autocomplete,
    Box,
    Typography,
    Avatar,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button as ButtonMUI,
} from "@mui/material";
// import * as constants from "../../../../constants/constants";
import { Collapse, Button } from "antd";
import { useState, useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import PencilSquareIcon from "@mui/icons-material/EditOutlined";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import XCircleIcon from "@mui/icons-material/CancelOutlined";
import NextLink from "next/link";
import { format, parse } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";

const OrderProduct = (props: any) => {
    const {
        product,
        products,
        productsOfOrder,
        index,
        loading,
        handleSubmit,
        handleDeleteProduct,
        canEdit,
    } = props;
    const [isFieldDisabled, setIsFieldDisabled] = useState(!canEdit);
    const [isExpanded, setIsExpanded] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState<any>({});
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [changesMade, setChangesMade] = useState(false);

    const getAllowedItems = (
        originalList: any,
        valuesList: any,
        idToExclude: any
    ) => {
        const idsToRemove = valuesList.map((item: any) => item._id);
        return originalList.filter((item: any) => {
            const isIdToExclude = item._id === idToExclude;
            const isIdInValuesList = idsToRemove.includes(item._id);
            return isIdToExclude || !isIdInValuesList;
        });
    };

    const handleDeleteConfirm = () => {
        handleDeleteProduct(index);
        setOpenDeletePopup(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeletePopup(false);
    };

    const handleDeleteClick = (e: any) => {
        e.stopPropagation();
        setOpenDeletePopup(true);
    };

    useEffect(() => {
        if (!product._id) {
            setIsFieldDisabled(false);
        }
    }, [product]);
    const fillEmpty = () => {
        if (!product._id) setChangesMade(false);
        setValue(null);
        formik.setValues({
            key: product.key,
            _id: null,
            name: "",
            anotherName: "",
            birthday: "",
            gender: "",
            citizenId: "",
            homeTown: "",
            permanentResidence: "",
            currentAccommodation: "",
            nationality: "",
            ethnicity: "",
            charge: "",
            reason: "",
            testimony: "",
            date: new Date(),
            typeOfViolation: 0,
            weapon: "",
        });
    };

    const handleSubmitProduct = () => {
        if (value === null) return;
        console.log("changemade", changesMade);
        console.log("submit", {
            ...formik.values,
            date:
                formik.values.date &&
                format(formik.values.date, "HH:mm dd/MM/yyyy"),
        });
        // e.stopPropagation();
        setIsFieldDisabled((prev) => !prev);
        if (changesMade) {
            handleSubmit({
                ...formik.values,
                date:
                    formik.values.date &&
                    format(formik.values.date, "HH:mm dd/MM/yyyy"),
                typeOfViolation:
                    formik.values.typeOfViolation &&
                    parseInt(formik.values.typeOfViolation, 10),
            });
        }
    };

    const handleCancelProduct = (e: any) => {
        e.stopPropagation();
        setIsFieldDisabled((prev) => !prev);
        if (product._id) {
            setValue(options.find((option: any) => option._id === product._id));

            console.log("product on cancel: ", product);
            console.log("value on cancel: ", value);
            formik.setValues({
                ...product,
                date:
                    product.date &&
                    parse(product.date, "HH:mm dd/MM/yyyy", new Date()),
                typeOfViolation: parseInt(product.typeOfViolation, 10),
            });
            setChangesMade(false);
        } else fillEmpty();
        formik.setTouched({}, false);
    };

    const handleEditProduct = (e: any) => {
        e.stopPropagation();
        setIsFieldDisabled((prev) => !prev);
        setChangesMade(false);
    };

    useEffect(() => {
        if (products && product) {
            const options = getAllowedItems(
                products,
                productsOfOrder,
                product._id
            );
            setOptions(options);
        }
    }, [product, productsOfOrder, products]);

    useEffect(() => {
        if (options) {
            if (
                changesMade &&
                value &&
                !options.find((option: any) => option._id === value._id)
                // productsOfOrder.find((c) => c._id === value._id) &&
                // formik.values.key &&
                // productsOfOrder.find((c) => c._id === value._id).key !== formik.values.key
            ) {
                fillEmpty();
            } else if (!changesMade) {
                setValue(
                    options.find((option: any) => option._id === product._id)
                );
                console.log("product on useeffect: ", product);
                console.log("value on useeffect: ", value);
                formik.setValues({
                    ...product,
                    date:
                        product.date &&
                        parse(product.date, "HH:mm dd/MM/yyyy", new Date()),
                    typeOfViolation:
                        product.typeOfViolation &&
                        parseInt(product.typeOfViolation, 10),
                });
            }
        }
    }, [product, options]);

    const formik = useFormik({
        // enableReinitialize: true,
        initialValues: product
            ? {
                  ...product,
                  date:
                      product.date &&
                      parse(product.date, "HH:mm dd/MM/yyyy", new Date()),
                  typeOfViolation: parseInt(product.typeOfViolation, 10),
              }
            : null,
        validationSchema: Yup.object({
            // id: Yup.string().required(messages.REQUIRED_CRIMINAL),
            // testimony: Yup.string()
            //     .max(65535, messages.LIMIT_TESTIMONY)
            //     .required(messages.REQUIRED_TESTIMONY),
            // charge: Yup.string()
            //     .max(100, messages.LIMIT_CHARGE)
            //     .required(messages.REQUIRED_CHARGE)
            //     .matches(/^[\p{L} ,]+$/u, messages.CHARGE_VALID_CHARACTER),
            // reason: Yup.string().nullable().max(500, messages.LIMIT_REASON),
            // // .matches(/^[\p{L} ,]+$/u, messages.CHARGE_VALID_CHARACTER),
            // weapon: Yup.string()
            //     .nullable()
            //     .max(100, messages.LIMIT_WEAPON)
            //     .matches(
            //         /^[\p{L}0-9, ]+$/u,
            //         messages.WEAPON_NAME_VALID_CHARACTER
            //     ),
        }),
        onSubmit: async (values, helpers) => {
            try {
                handleSubmitProduct();
            } catch (err: any) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const extraBtns = () => (
        <Stack
            direction="row"
            spacing={-0.5}
            justifyContent="flex-end"
            alignItems="center"
        >
            {isFieldDisabled && canEdit && (
                <Tooltip title="Chỉnh sửa">
                    <Button
                        type="text"
                        icon={
                            <SvgIcon fontSize="small">
                                <PencilSquareIcon />
                            </SvgIcon>
                        }
                        shape="circle"
                        onClick={handleEditProduct}
                    />
                </Tooltip>
            )}

            {!isFieldDisabled && (
                <>
                    <Tooltip title="Cập nhật">
                        <Button
                            type="text"
                            icon={
                                <SvgIcon fontSize="small">
                                    <CheckCircleIcon />
                                </SvgIcon>
                            }
                            shape="circle"
                            onClick={() => formik.handleSubmit}
                        />
                    </Tooltip>
                    <Tooltip title="Hủy">
                        <Button
                            type="text"
                            icon={
                                <SvgIcon fontSize="small">
                                    <XCircleIcon />
                                </SvgIcon>
                            }
                            shape="circle"
                            onClick={handleCancelProduct}
                        />
                    </Tooltip>
                </>
            )}
            <Tooltip title="Xóa">
                <Button
                    type="text"
                    icon={
                        <SvgIcon fontSize="small">
                            <TrashIcon />
                        </SvgIcon>
                    }
                    shape="circle"
                    onClick={handleDeleteClick}
                />
            </Tooltip>
        </Stack>
    );

    const handleCollapseChange = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    return (
        options && (
            <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
                <Collapse
                    onChange={handleCollapseChange}
                    items={[
                        {
                            extra: isExpanded ? extraBtns() : null,
                            label: (
                                <Stack direction="row" spacing={0.5}>
                                    <Typography>
                                        Sản phẩm {index + 1}
                                    </Typography>
                                    {value && (
                                        <>
                                            <Typography>: </Typography>
                                            <Tooltip title="Xem chi tiết sản phẩm này">
                                                <Typography
                                                    color="primary"
                                                    component={NextLink}
                                                    href={{
                                                        pathname: `/product/${value._id}`,
                                                    }}
                                                >
                                                    {value?.name}
                                                </Typography>
                                            </Tooltip>
                                        </>
                                    )}
                                </Stack>
                            ),
                            children: (
                                <Grid container spacing={3}>
                                    {[
                                        {
                                            label: "Liên kết sản phẩm",
                                            name: "_id",
                                            md: 3,
                                            required: true,
                                            autoComplete: true,
                                        },
                                        {
                                            label: "Tên sản phẩm",
                                            name: "name",
                                            md: 8,
                                            disabled: true,
                                            info: true,
                                        },
                                        {
                                            label: "Đơn giá ($)",
                                            name: "unitPrice",
                                            md: 3,
                                            disabled: true,
                                            info: true,
                                        },
                                        {
                                            label: "Giảm giá (%)",
                                            name: "discount",
                                            md: 3,
                                            disabled: true,
                                            info: true,
                                        },
                                        {
                                            label: "Số lượng",
                                            name: "quantity",
                                            md: 3,
                                            disabled: true,
                                            info: true,
                                        },
                                        {
                                            label: "Số lượng đã bán",
                                            name: "soldQuantity",
                                            md: 3,
                                            disabled: true,
                                            info: true,
                                        },
                                        {
                                            label: "Mô tả",
                                            name: "description",
                                            textArea: true,
                                            md: 12,
                                            disabled: true,
                                            info: true,
                                        },
                                        {
                                            label: "Trạng thái",
                                            name: "status",
                                            md: 12,
                                            disabled: true,
                                            info: true,
                                        },
                                        {
                                            label: "Số lượng đặt",
                                            name: "numberOfFlowers",
                                            required: true,
                                            md: 12,
                                        },
                                    ].map((field: any) => (
                                        <Grid
                                            key={field.name}
                                            xs={12}
                                            md={field.md || 12}
                                        >
                                            {loading ? (
                                                <Skeleton variant="rounded">
                                                    <TextField fullWidth />
                                                </Skeleton>
                                            ) : field.autoComplete ? (
                                                <Autocomplete
                                                    id="autocomplete-product"
                                                    autoHighlight={true}
                                                    disabled={
                                                        isFieldDisabled ||
                                                        field.disabled
                                                    }
                                                    // name={field.name}
                                                    // label={field.label}
                                                    disablePortal
                                                    fullWidth
                                                    options={options}
                                                    getOptionLabel={(
                                                        option
                                                    ) => {
                                                        return value
                                                            ? option.name
                                                            : "";
                                                    }}
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => {
                                                        if (
                                                            value === null ||
                                                            value === undefined
                                                        ) {
                                                            return (
                                                                option === value
                                                            );
                                                        }
                                                        return (
                                                            option._id ===
                                                            value._id
                                                        );
                                                    }}
                                                    onChange={async (
                                                        event,
                                                        value
                                                    ) => {
                                                        if (
                                                            value === null ||
                                                            value === undefined
                                                        ) {
                                                            fillEmpty();
                                                        } else {
                                                            setValue(value);
                                                            if (
                                                                value._id ===
                                                                product._id
                                                            ) {
                                                                console.log(
                                                                    "product on change: ",
                                                                    product
                                                                );
                                                                console.log(
                                                                    "value on change: ",
                                                                    value
                                                                );
                                                                formik.setValues(
                                                                    {
                                                                        ...product,
                                                                        date: parse(
                                                                            product.date,
                                                                            "HH:mm dd/MM/yyyy",
                                                                            new Date()
                                                                        ),
                                                                        typeOfViolation:
                                                                            parseInt(
                                                                                product.typeOfViolation,
                                                                                10
                                                                            ),
                                                                    }
                                                                );
                                                                setChangesMade(
                                                                    false
                                                                );
                                                            } else {
                                                                formik.setValues(
                                                                    {
                                                                        ...value,
                                                                        key: product.key,
                                                                        charge: "",
                                                                        reason: "",
                                                                        testimony:
                                                                            "",
                                                                        date: new Date(),
                                                                        typeOfViolation: 0,
                                                                        weapon: "",
                                                                    }
                                                                );
                                                                setChangesMade(
                                                                    true
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    value={value}
                                                    renderOption={(
                                                        props,
                                                        option
                                                    ) => (
                                                        <Box
                                                            component="li"
                                                            key={option._id}
                                                            {...props}
                                                        >
                                                            <Avatar
                                                                sx={{
                                                                    mr: 1.5,
                                                                    height: 32,
                                                                    width: 32,
                                                                }}
                                                                src={
                                                                    option?.image
                                                                }
                                                            />
                                                            {option.name}
                                                        </Box>
                                                    )} // Set the default value based on the product prop
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={
                                                                !!(
                                                                    formik
                                                                        .touched[
                                                                        field
                                                                            .name
                                                                    ] &&
                                                                    formik
                                                                        .errors[
                                                                        field
                                                                            .name
                                                                    ]
                                                                )
                                                            }
                                                            // helperText={
                                                            //     formik.touched[
                                                            //         field.name
                                                            //     ] &&
                                                            //     formik.errors[
                                                            //         field.name
                                                            //     ]
                                                            // }
                                                            disabled={
                                                                isFieldDisabled ||
                                                                field.disabled
                                                            }
                                                            label={field.label}
                                                            required={
                                                                field.required ||
                                                                false
                                                            }
                                                            sx={{
                                                                "& .MuiInputBase-input":
                                                                    {
                                                                        overflow:
                                                                            "hidden",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                    },
                                                            }}
                                                        />
                                                    )}
                                                />
                                            ) : field.dateTimePicker ? (
                                                <DateTimePicker
                                                    // error={
                                                    //     !!(
                                                    //         formik.touched[
                                                    //             field.name
                                                    //         ] &&
                                                    //         formik.errors[
                                                    //             field.name
                                                    //         ]
                                                    //     )
                                                    // }
                                                    // fullWidth
                                                    // helperText={
                                                    //     formik.touched[
                                                    //         field.name
                                                    //     ] &&
                                                    //     formik.errors[
                                                    //         field.name
                                                    //     ]
                                                    // }
                                                    label={field.label}
                                                    name={field.name}
                                                    // onBlur={formik.handleBlur}
                                                    onChange={(date) => {
                                                        setChangesMade(true);
                                                        formik.setFieldValue(
                                                            field.name,
                                                            date
                                                        );
                                                    }}
                                                    // type={field.name}
                                                    value={
                                                        formik.values[
                                                            field.name
                                                        ]
                                                    }
                                                    disabled={
                                                        isFieldDisabled ||
                                                        field.disabled
                                                    }
                                                    // renderInput={(
                                                    //     params: any
                                                    // ) => (
                                                    //     <TextField
                                                    //         {...params}
                                                    //         disabled={
                                                    //             isFieldDisabled ||
                                                    //             field.disabled
                                                    //         }
                                                    //         fullWidth
                                                    //         InputLabelProps={{
                                                    //             shrink: true,
                                                    //         }}
                                                    //         required={
                                                    //             field.required ||
                                                    //             false
                                                    //         }
                                                    //         onKeyDown={(e) =>
                                                    //             e.preventDefault()
                                                    //         }
                                                    //     />
                                                    // )}
                                                    maxDate={new Date()}
                                                />
                                            ) : (
                                                <TextField
                                                    error={
                                                        !!(
                                                            formik.touched[
                                                                field.name
                                                            ] &&
                                                            formik.errors[
                                                                field.name
                                                            ]
                                                        )
                                                    }
                                                    fullWidth
                                                    // helperText={
                                                    //     formik.touched[
                                                    //         field.name
                                                    //     ] &&
                                                    //     formik.errors[
                                                    //         field.name
                                                    //     ]
                                                    // }
                                                    label={field.label}
                                                    name={field.name}
                                                    onBlur={formik.handleBlur}
                                                    onChange={(e) => {
                                                        setChangesMade(true);
                                                        formik.handleChange(e);
                                                    }}
                                                    value={
                                                        formik.values[
                                                            field.name
                                                        ] ?? ""
                                                    }
                                                    multiline={
                                                        field.textArea || false
                                                    }
                                                    disabled={
                                                        isFieldDisabled ||
                                                        field.disabled
                                                    }
                                                    required={
                                                        field.required || false
                                                    }
                                                    select={field.select}
                                                    SelectProps={
                                                        field.select
                                                            ? { native: true }
                                                            : undefined
                                                    }
                                                    sx={{
                                                        "& .MuiInputBase-input":
                                                            {
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                            },
                                                    }}
                                                >
                                                    {field.select &&
                                                        field.selectProps &&
                                                        Object.entries(
                                                            field.selectProps
                                                        ).map(
                                                            (
                                                                [value, label],
                                                                index
                                                            ) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        value
                                                                    }
                                                                >
                                                                    {
                                                                        label as any
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </TextField>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            ),
                        },
                    ]}
                />
                <Dialog open={openDeletePopup} onClose={handleDeleteCancel}>
                    <DialogTitle>
                        Xác nhận xóa sản phẩm {value?.name}
                    </DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn xóa sản phẩm này?
                    </DialogContent>
                    <DialogActions>
                        <ButtonMUI onClick={handleDeleteCancel} color="primary">
                            Hủy
                        </ButtonMUI>
                        <ButtonMUI onClick={handleDeleteConfirm} color="error">
                            Xác nhận
                        </ButtonMUI>
                    </DialogActions>
                </Dialog>
            </form>
        )
    );
};

export default OrderProduct;
