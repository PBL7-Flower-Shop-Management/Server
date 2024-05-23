import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";

const NewCategoryInformation = (props: any) => {
    const { formik, loadingSkeleton, isFieldDisabled } = props;

    return (
        <Card
            sx={{
                p: 0,
            }}
        >
            <CardContent>
                <Grid container spacing={3}>
                    {[
                        {
                            label: "Mã hạng mục",
                            name: "_id",
                            md: 4,
                            disabled: true,
                        },
                        {
                            label: "Tên hạng mục",
                            name: "categoryName",
                            required: true,
                            md: 8,
                        },
                        {
                            label: "Mô tả",
                            name: "description",
                            textarea: true,
                            md: 6,
                        },
                    ].map((field: any) => (
                        <Grid key={field.name} xs={12} md={field.md || 12}>
                            {loadingSkeleton || formik.values === null ? (
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
                                    // type={field.name}
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
                                    type={field.name}
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

export default NewCategoryInformation;
