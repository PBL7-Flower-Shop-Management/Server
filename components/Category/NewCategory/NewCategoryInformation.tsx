import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

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

export default NewCategoryInformation;
