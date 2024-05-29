import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
    Autocomplete,
    Chip,
    Avatar,
    Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Skeleton from "@mui/material/Skeleton";
import { useEffect, useState } from "react";
import { orderStatus } from "@/utils/constants";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const NewOrderInformation = (props: any) => {
    const { formik, initCategories, loadingSkeleton, isFieldDisabled } = props;
    const [categories, setCategories] = useState([]);
    const [value, setValue] = useState([]);

    useEffect(() => {
        if (categories) {
            setValue(
                categories.filter((category: any) =>
                    formik.values.categoryId.includes(category._id)
                )
            );
        }
        setCategories(initCategories);
    }, [categories]);

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
                            label: "Đơn giá ($)",
                            name: "unitPrice",
                            type: "number",
                            md: 3,
                        },
                        {
                            label: "Giảm giá (%)",
                            name: "discount",
                            type: "positive integer",
                            md: 3,
                        },
                        {
                            label: "Phí ship ($)",
                            name: "shipPrice",
                            type: "number",
                            md: 3,
                        },
                        {
                            label: "Tổng tiền ($)",
                            name: "totalPrice",
                            type: "number",
                            md: 3,
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
                            ) : field.dateTimePicker ? (
                                <DateTimePicker
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
                                    onChange={(date) => {
                                        formik.setFieldValue(field.name, date);
                                    }}
                                    // type={field.type}
                                    value={formik.values[field.name] || null}
                                    disabled={
                                        isFieldDisabled ||
                                        field.disabled ||
                                        isFieldDisabled
                                    }
                                    // renderInput={(params: any) => (
                                    //     <TextField
                                    //         {...params}
                                    //         fullWidth
                                    //         InputLabelProps={{ shrink: true }}
                                    //         required={field.required || false}
                                    //         onKeyDown={(e) =>
                                    //             e.preventDefault()
                                    //         }
                                    //     />
                                    // )}
                                    maxDate={new Date()}
                                    timeSteps={{ minutes: 1 }}
                                    sx={{ width: "100%" }}
                                />
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
                                    onChange={(date) => {
                                        formik.setFieldValue(field.name, date);
                                    }}
                                    // type={field.type}
                                    value={formik.values[field.name] || null}
                                    disabled={isFieldDisabled || field.disabled}
                                    // renderInput={(params: any) => (
                                    //     <TextField
                                    //         {...params}
                                    //         fullWidth
                                    //         InputLabelProps={{ shrink: true }}
                                    //         required={field.required || false}
                                    //         onKeyDown={(e) =>
                                    //             e.preventDefault()
                                    //         }
                                    //     />
                                    // )}
                                    maxDate={new Date()} // Assuming current date is the maximum allowed
                                />
                            ) : field.autoComplete ? (
                                <Autocomplete
                                    id="autocomplete-orders"
                                    multiple
                                    autoHighlight={true}
                                    disabled={isFieldDisabled || field.disabled}
                                    // name={field.name}
                                    // label={field.label}
                                    disablePortal
                                    fullWidth
                                    options={categories}
                                    getOptionLabel={(option: any) =>
                                        value ? option.categoryName : ""
                                    }
                                    renderTags={(value, getTagProps) =>
                                        value.map(
                                            (option: any, index: number) => (
                                                <Box key={index}>
                                                    <Chip
                                                        variant="outlined"
                                                        avatar={
                                                            <Avatar
                                                                src={
                                                                    option.image
                                                                }
                                                            />
                                                        }
                                                        label={
                                                            option.categoryName
                                                        }
                                                        {...getTagProps({
                                                            index,
                                                        })}
                                                        // sx={{
                                                        //     color: "black",
                                                        //     backgroundColor:
                                                        //         "white",
                                                        // }}
                                                    />
                                                </Box>
                                            )
                                        )
                                    }
                                    // isOptionEqualToValue={(option, value) => {
                                    //     if (value === null || value === undefined) {
                                    //         return option === value;
                                    //     }
                                    //     return option.id === value.id;
                                    // }}
                                    // onChange={async (event, value) => {
                                    //     if (value === null || value === undefined) {
                                    //         setValue('');
                                    //         handleChangeCriminals(event, '', index);
                                    //     } else {
                                    //         setValue(value);
                                    //         handleChangeCriminals(event, value, index);
                                    //     }

                                    // }}

                                    onChange={(event, value: any) => {
                                        setValue(value);
                                    }}
                                    value={value}
                                    renderOption={(props, option: any) => (
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
                                                src={option?.image}
                                            />
                                            {option.categoryName}
                                        </Box>
                                    )} // Set the default value based on the criminal prop
                                    renderInput={(params: any) => (
                                        <TextField
                                            {...params}
                                            disabled={
                                                isFieldDisabled ||
                                                field.disabled
                                            }
                                            label={field.label}
                                            required={field.required || false}
                                            sx={{
                                                "& .MuiInputBase-input": {
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                },
                                            }}
                                        />
                                    )}
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
                                                    selected={
                                                        value === field.selected
                                                    }
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
            {/* <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          {isClicked ? (
            loadingButtonDetails && (
              <LoadingButton
                disabled
                loading={loadingButtonDetails}
                size="medium"
                variant="contained"
              >
                Chỉnh sửa thông tin
              </LoadingButton>
            )
          ) : (
            <>
              <Button
                variant="contained"
                onClick={isFieldDisabled ? handleEditGeneral : formik.handleSubmit}
                disabled={loadingButtonPicture}
              >
                {isFieldDisabled ? "Chỉnh sửa thông tin" : "Cập nhật thông tin"}
              </Button>
              {!isFieldDisabled && (
                <Button variant="outlined" onClick={handleCancelGeneral}>
                  Hủy
                </Button>
              )}
            </>
          )}
        </CardActions> */}
        </Card>
    );
};

export default NewOrderInformation;
