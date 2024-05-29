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

const NewProductInformation = (props: any) => {
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
                            label: "Mã sản phẩm",
                            name: "_id",
                            md: 4,
                            disabled: true,
                        },
                        {
                            label: "Tên sản phẩm",
                            name: "name",
                            md: 8,
                            required: true,
                        },
                        {
                            label: "Môi trường sống",
                            name: "habitat",
                            md: 3,
                        },
                        {
                            label: "Thời gian sinh trưởng",
                            name: "growthTime",
                            md: 9,
                        },
                        {
                            label: "Cách chăm sóc",
                            name: "care",
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
                            label: "Số lượng",
                            name: "quantity",
                            md: 3,
                        },
                        {
                            label: "Số lượng đã bán",
                            name: "soldQuantity",
                            md: 3,
                        },
                        {
                            label: "Mô tả",
                            name: "description",
                            textArea: true,
                            md: 12,
                        },
                        {
                            label: "Trạng thái",
                            name: "status",
                            disabled: true,
                            md: 12,
                        },
                        {
                            label: "Hạng mục",
                            name: "categories",
                            autoComplete: true,
                            md: 12,
                        },
                    ].map((field: any) => (
                        <Grid key={field.name} xs={12} md={field.md || 12}>
                            {loadingSkeleton ||
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
                                    id="autocomplete-products"
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

export default NewProductInformation;
