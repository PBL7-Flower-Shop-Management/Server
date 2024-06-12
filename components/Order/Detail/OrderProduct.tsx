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
import { Collapse, Button } from "antd";
import { useState, useEffect } from "react";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import NextLink from "next/link";

const OrderProduct = (props: any) => {
    const {
        product,
        error,
        touched,
        products,
        orderDetails,
        index,
        loading,
        handleChangeProduct,
        handleDeleteProduct,
        isFieldDisabled,
    } = props;

    const [isExpanded, setIsExpanded] = useState(false);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState<any>({});
    const [openDeletePopup, setOpenDeletePopup] = useState(false);

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

    const fillEmpty = () => {
        setValue(null);
        handleChangeProduct("all", {
            key: product.key,
            _id: null,
            numberOfFlowers: product.numberOfFlowers
                ? product.numberOfFlowers
                : "",
        });
    };

    useEffect(() => {
        if (products && product) {
            const options = getAllowedItems(
                products,
                orderDetails,
                product._id
            );
            setOptions(options);
        }
    }, [product, orderDetails, products]);

    const extraBtns = () => (
        <Stack
            direction="row"
            spacing={-0.5}
            justifyContent="flex-end"
            alignItems="center"
        >
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

    useEffect(() => {
        if (options) {
            if (
                value &&
                !options.find((option: any) => option._id === value._id) &&
                orderDetails.find((c: any) => c._id === value._id) &&
                product.key &&
                orderDetails.find((c: any) => c._id === value._id).key !==
                    product.key
            ) {
                fillEmpty();
            } else {
                setValue(
                    options.find((option: any) => option._id === product._id)
                );
                handleChangeProduct("all", product);
            }
        }
    }, [product, options]);

    const handleCollapseChange = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    return (
        options && (
            <>
                <Collapse
                    onChange={handleCollapseChange}
                    items={[
                        {
                            extra:
                                isExpanded && !isFieldDisabled
                                    ? extraBtns()
                                    : null,
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
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
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
                                                                handleChangeProduct(
                                                                    "all",
                                                                    {
                                                                        ...product,
                                                                        numberOfFlowers:
                                                                            product.numberOfFlowers
                                                                                ? product
                                                                                : "",
                                                                    }
                                                                );
                                                            } else {
                                                                handleChangeProduct(
                                                                    "all",
                                                                    {
                                                                        ...value,
                                                                        key: product.key,
                                                                        numberOfFlowers:
                                                                            product.numberOfFlowers
                                                                                ? product.numberOfFlowers
                                                                                : "",
                                                                    }
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
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            error={
                                                                !!(
                                                                    touched &&
                                                                    touched[
                                                                        field
                                                                            .name
                                                                    ] &&
                                                                    error &&
                                                                    error[
                                                                        field
                                                                            .name
                                                                    ]
                                                                )
                                                            }
                                                            helperText={
                                                                touched &&
                                                                touched[
                                                                    field.name
                                                                ] &&
                                                                error &&
                                                                error[
                                                                    field.name
                                                                ]
                                                            }
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
                                            ) : (
                                                <TextField
                                                    error={
                                                        !!(
                                                            touched &&
                                                            touched[
                                                                field.name
                                                            ] &&
                                                            error &&
                                                            error[field.name]
                                                        )
                                                    }
                                                    fullWidth
                                                    helperText={
                                                        touched &&
                                                        touched[field.name] &&
                                                        error &&
                                                        error[field.name]
                                                    }
                                                    label={field.label}
                                                    name={field.name}
                                                    // onBlur={
                                                    // formik.handleBlur
                                                    // }
                                                    onChange={(e) => {
                                                        handleChangeProduct(
                                                            field.name,
                                                            e.target.value
                                                        );
                                                    }}
                                                    value={
                                                        product[field.name] ??
                                                        ""
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
                                                            ? {
                                                                  native: true,
                                                              }
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
            </>
        )
    );
};

export default OrderProduct;
