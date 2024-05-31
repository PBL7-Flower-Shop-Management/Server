import {
    Unstable_Grid2 as Grid,
    TextField,
    Card,
    CardContent,
    Box,
    Autocomplete,
    Avatar,
    Chip,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect } from "react";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "@/components/Toast";
import { productStatus } from "@/utils/constants";
import { isNumberic } from "@/utils/helper";

const ProductInformation = (props: any) => {
    const { formik, handleChange, loadingSkeleton, isFieldDisabled } = props;
    const [categories, setCategories] = useState([]);
    const [value, setValue] = useState([]);
    const { setLoading } = useLoadingContext();

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            const response = await FetchApi(
                UrlConfig.category.getAll + "?isExport=true",
                "GET",
                true
            );
            if (response.canRefreshToken === false) {
                showToast(response.message, "warning");
            } else if (response.succeeded) {
                setCategories(response.data);
            } else {
                showToast(response.message, "error");
            }
            setLoading(false);
        };

        getCategories();
    }, []);

    useEffect(() => {
        if (categories && formik.values.category) {
            setValue(
                categories.filter((category: any) =>
                    formik.values.category.includes(category._id)
                )
            );
        }
    }, [categories, formik.values.category]);

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
                            disabled: true,
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
                            {loadingSkeleton || formik.values === null ? (
                                <Skeleton variant="rounded">
                                    <TextField fullWidth />
                                </Skeleton>
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
                                                                    option.avatarUrl
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
                                    onChange={(event, value: any) => {
                                        setValue(value);
                                        handleChange(
                                            "category",
                                            value.map((v: any) => v._id)
                                        );
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
                                                src={option?.avatarUrl}
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
                                        if (e.target.name === "quantity") {
                                            if (
                                                e.target.value === "" ||
                                                Number(e.target.value) === 0 ||
                                                !isNumberic(e.target.value)
                                            )
                                                formik.setFieldValue(
                                                    "status",
                                                    productStatus[
                                                        "Out of stock"
                                                    ]
                                                );
                                            else
                                                formik.setFieldValue(
                                                    "status",
                                                    productStatus["Available"]
                                                );
                                        }
                                        handleChange(
                                            field.name,
                                            e.target.value
                                        );
                                        // formik.handleChange(e);
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
        </Card>
    );
};

export default ProductInformation;
