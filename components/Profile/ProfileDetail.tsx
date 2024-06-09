import React from "react";
import {
    Card,
    CardContent,
    TextField,
    Unstable_Grid2 as Grid,
    Skeleton,
} from "@mui/material";
import { role } from "@/utils/constants";

const ProfileDetail = (props: any) => {
    const { formik, handleChange, loadingSkeleton, isFieldDisabled } = props;

    return (
        <form autoComplete="off" noValidate>
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
                                disabled: true,
                                md: 6,
                            },
                        ].map((field: any) => (
                            <Grid key={field.name} xs={12} md={field.md || 12}>
                                {loadingSkeleton || formik.values === null ? (
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
                                            // formik.touched[field.name] &&
                                            formik.errors[field.name] as string
                                        }
                                        disabled={
                                            isFieldDisabled || field.disabled
                                        }
                                        label={field.label}
                                        name={field.name}
                                        onBlur={formik.handleBlur}
                                        onChange={handleChange}
                                        type={field.type}
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
            </Card>
        </form>
    );
};

export default ProfileDetail;
