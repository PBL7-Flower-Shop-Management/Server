import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const CategoryInformation = (props: any) => {
    const { formik, handleChange, loadingSkeleton, isFieldDisabled } = props;

    return (
        <form autoComplete="off" noValidate>
            <Card
                sx={{
                    p: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
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
                                        // type={field.type}
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

export default CategoryInformation;
