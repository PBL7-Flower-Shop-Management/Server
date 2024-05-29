import React from "react";
import {
    Card,
    CardContent,
    TextField,
    Unstable_Grid2 as Grid,
    Skeleton,
} from "@mui/material";
import { isActive, role } from "@/utils/constants";
export const NewAccountInformation = (props: any) => {
    const { formik, loadingSkeleton, isFieldDisabled } = props;

    return (
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
                            md: 8,
                        },
                        {
                            label: "Số điện thoại",
                            name: "phoneNumber",
                            textArea: true,
                            md: 6,
                        },
                        {
                            label: "Chức vụ",
                            name: "role",
                            select: true,
                            selectProps: role,
                            selected: "Customer",
                            md: 6,
                        },
                        {
                            label: "Trạng thái tài khoản",
                            name: "isActived",
                            select: true,
                            selectProps: isActive,
                            selected: false,
                            type: "boolean",
                            md: 6,
                        },
                    ].map((field: any) => (
                        <Grid key={field.name} xs={12} md={field.md || 12}>
                            {loadingSkeleton ||
                            formik.values === null ||
                            formik.values.name === undefined ? (
                                <Skeleton variant="rounded">
                                    <TextField fullWidth />
                                </Skeleton>
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
                                    disabled={isFieldDisabled || field.disabled}
                                    label={field.label}
                                    name={field.name}
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        const value =
                                            field.type === "boolean"
                                                ? e.target.value === "true"
                                                : e.target.value;
                                        formik.setFieldValue(field.name, value);
                                    }}
                                    type={
                                        field.type === "boolean"
                                            ? "text"
                                            : field.type
                                    }
                                    value={formik.values[field.name]}
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
                                            ([value, label]: any) => (
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
