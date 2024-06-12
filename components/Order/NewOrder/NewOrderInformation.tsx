import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
    Box,
    SvgIcon,
    Stack,
    Tooltip,
    Autocomplete,
    Chip,
    Avatar,
    FormHelperText,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { orderStatus } from "@/utils/constants";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useState } from "react";
import KeyboardOutlinedIcon from "@mui/icons-material/KeyboardOutlined";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import { FetchApi } from "@/utils/FetchApi";
import { showToast } from "@/components/Toast";
import UrlConfig from "@/config/UrlConfig";
import { useLoadingContext } from "@/contexts/LoadingContext";

const NewOrderInformation = (props: any) => {
    const { formik, loadingSkeleton, isFieldDisabled, reset } = props;
    const [isTypeMode, setIsTypeMode] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [value, setValue] = useState<any>(null);
    const { setLoading } = useLoadingContext();

    useEffect(() => {
        const getCustomers = async () => {
            setLoading(true);
            const response = await FetchApi(
                UrlConfig.account.getAll + "?getCustomer=true&isExport=true",
                "GET",
                true
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
            } else if (response.succeeded) {
                setCustomers(response.data);
            } else {
                showToast(response.message, "error");
            }
            setLoading(false);
        };

        getCustomers();
    }, []);

    useEffect(() => {
        setValue(null);
    }, [reset]);

    return (
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
                            typeSelectMode: true,
                            md: 6,
                        },
                        {
                            label: "Ngày đặt hàng",
                            name: "orderDate",
                            dateTimePicker: true,
                            md: 6,
                        },
                        {
                            label: "Ngày giao hàng",
                            name: "shipDate",
                            dateTimePicker: true,
                            md: 6,
                        },
                        {
                            label: "Địa chỉ giao hàng",
                            name: "shipAddress",
                            textArea: true,
                            md: 12,
                        },
                        {
                            label: "Giảm giá (%)",
                            name: "discount",
                            type: "positive integer",
                            md: 4,
                        },
                        {
                            label: "Phí ship ($)",
                            name: "shipPrice",
                            type: "number",
                            md: 4,
                        },
                        {
                            label: "Tổng tiền ($)",
                            name: "totalPrice",
                            type: "number",
                            md: 4,
                            disabled: true,
                        },
                        {
                            label: "Phương thức thanh toán",
                            name: "paymentMethod",
                            md: 8,
                        },
                        {
                            label: "Trạng thái",
                            name: "status",
                            required: true,
                            select: true,
                            selectProps: orderStatus,
                            selected: "Processing",
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
                            {loadingSkeleton || formik.values === null ? (
                                <Skeleton variant="rounded">
                                    <TextField fullWidth />
                                </Skeleton>
                            ) : field.typeSelectMode ? (
                                <>
                                    {isTypeMode ? (
                                        <Stack direction={"row"} gap={1}>
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
                                                helperText={
                                                    formik.touched[
                                                        field.name
                                                    ] &&
                                                    formik.errors[field.name]
                                                }
                                                label={field.label}
                                                name={field.name}
                                                onBlur={formik.handleBlur}
                                                onChange={(e) =>
                                                    formik.setFieldValue(
                                                        "username",
                                                        e.target.value
                                                    )
                                                }
                                                type={field.type}
                                                value={
                                                    formik.values[field.name]
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
                                                sx={{
                                                    "& .MuiInputBase-input": {
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    },
                                                }}
                                            ></TextField>

                                            {!isFieldDisabled &&
                                                !field.disabled && (
                                                    <Tooltip
                                                        title="Select mode"
                                                        sx={{ marginTop: 2 }}
                                                    >
                                                        <SvgIcon
                                                            fontSize="medium"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                formik.setFieldValue(
                                                                    "username",
                                                                    undefined
                                                                );
                                                                setIsTypeMode(
                                                                    false
                                                                );
                                                            }}
                                                        >
                                                            <ArrowDropDownCircleOutlinedIcon />
                                                        </SvgIcon>
                                                    </Tooltip>
                                                )}
                                        </Stack>
                                    ) : (
                                        <Stack direction={"row"} gap={1}>
                                            <Box width={"100%"}>
                                                <Autocomplete
                                                    id="autocomplete-customers"
                                                    autoHighlight={true}
                                                    disabled={
                                                        isFieldDisabled ||
                                                        field.disabled
                                                    }
                                                    disablePortal
                                                    fullWidth
                                                    options={customers}
                                                    getOptionLabel={(
                                                        option: any
                                                    ) => ""}
                                                    onChange={(
                                                        event,
                                                        value: any
                                                    ) => {
                                                        setValue(value);
                                                        formik.setFieldValue(
                                                            "orderUserId",
                                                            value?._id
                                                        );
                                                    }}
                                                    value={value}
                                                    filterOptions={(
                                                        options,
                                                        { inputValue }
                                                    ) => {
                                                        const filtered =
                                                            options.filter(
                                                                (option) =>
                                                                    option.username
                                                                        .toLowerCase()
                                                                        .includes(
                                                                            inputValue.toLowerCase()
                                                                        )
                                                            );
                                                        return filtered;
                                                    }}
                                                    renderOption={(
                                                        props,
                                                        option: any
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
                                                                    option?.avatarUrl
                                                                }
                                                            />
                                                            {option.username}
                                                        </Box>
                                                    )}
                                                    renderInput={(
                                                        params: any
                                                    ) => (
                                                        <TextField
                                                            {...params}
                                                            disabled={
                                                                isFieldDisabled ||
                                                                field.disabled
                                                            }
                                                            label={field.label}
                                                            required={
                                                                field.required ||
                                                                false
                                                            }
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment:
                                                                    value ? (
                                                                        <Chip
                                                                            variant="outlined"
                                                                            disabled={
                                                                                isFieldDisabled ||
                                                                                field.disabled
                                                                            }
                                                                            avatar={
                                                                                <Avatar
                                                                                    src={
                                                                                        value.avatarUrl
                                                                                    }
                                                                                />
                                                                            }
                                                                            label={
                                                                                value.username
                                                                            }
                                                                            // sx={{
                                                                            //     color: "black",
                                                                            //     backgroundColor:
                                                                            //         "white",
                                                                            // }}
                                                                        />
                                                                    ) : null,
                                                            }}
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
                                                {formik.errors["username"] &&
                                                    formik.touched[
                                                        "username"
                                                    ] && (
                                                        <FormHelperText error>
                                                            {
                                                                formik.errors[
                                                                    "username"
                                                                ]
                                                            }
                                                        </FormHelperText>
                                                    )}
                                            </Box>

                                            {!isFieldDisabled &&
                                                !field.disabled && (
                                                    <Tooltip
                                                        title="Type mode"
                                                        sx={{ marginTop: 2 }}
                                                    >
                                                        <SvgIcon
                                                            fontSize="medium"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                formik.setFieldValue(
                                                                    "orderUserId",
                                                                    undefined
                                                                );
                                                                setValue(null);
                                                                setIsTypeMode(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <KeyboardOutlinedIcon />
                                                        </SvgIcon>
                                                    </Tooltip>
                                                )}
                                        </Stack>
                                    )}
                                </>
                            ) : field.dateTimePicker ? (
                                <DateTimePicker
                                    label={field.label}
                                    name={field.name}
                                    onChange={(date) => {
                                        formik.setFieldValue(field.name, date);
                                    }}
                                    value={formik.values[field.name] || null}
                                    disabled={
                                        isFieldDisabled ||
                                        field.disabled ||
                                        isFieldDisabled
                                    }
                                    slotProps={{
                                        textField: {
                                            error: !!(
                                                formik.touched[field.name] &&
                                                formik.errors[field.name]
                                            ),
                                            helperText:
                                                formik.touched[field.name] &&
                                                formik.errors[field.name],
                                        },
                                    }}
                                    maxDate={
                                        field.name === "orderDate"
                                            ? new Date()
                                            : undefined
                                    }
                                    timeSteps={{ minutes: 1 }}
                                    sx={{ width: "100%" }}
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
                                    helperText={
                                        formik.touched[field.name] &&
                                        formik.errors[field.name]
                                    }
                                    label={field.label}
                                    name={field.name}
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        if (field.type === "positive integer") {
                                            const { value } = e.target;
                                            if (
                                                value !== "" &&
                                                !/^[0-9]\d*$/.test(value)
                                            )
                                                return;
                                        }
                                        formik.handleChange(e);
                                    }}
                                    type={field.type}
                                    value={formik.values[field.name]}
                                    multiline={field.textArea || false}
                                    disabled={isFieldDisabled || field.disabled}
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
                                        Object.entries(field.selectProps).map(
                                            ([value, label]) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label as any}
                                                </option>
                                            )
                                        )}
                                </TextField>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default NewOrderInformation;
