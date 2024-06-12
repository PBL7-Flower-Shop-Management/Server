import { orderStatus } from "@/utils/constants";
import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
    Box,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const OrderInformation = (props: any) => {
    const { formik, handleChange, loadingSkeleton, isFieldDisabled, reset } =
        props;

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
                            md: 6,
                            disabled: true,
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
                            label: "Phí ship",
                            name: "shipPrice",
                            type: "number",
                            md: 4,
                        },
                        {
                            label: "Tổng tiền",
                            name: "totalPrice",
                            type: "number",
                            disabled: true,
                            md: 4,
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
                            ) : field.dateTimePicker ? (
                                <DateTimePicker
                                    label={field.label}
                                    name={field.name}
                                    onChange={(date) => {
                                        handleChange(field.name, date);
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
                                        handleChange(
                                            field.name,
                                            e.target.value
                                        );
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

export default OrderInformation;
