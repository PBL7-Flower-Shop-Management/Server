import {
    Box,
    Button,
    Card,
    CardContent,
    FormHelperText,
    SvgIcon,
} from "@mui/material";
import OrderProduct from "./OrderProduct";
import { Space } from "antd";
import PlusIcon from "@mui/icons-material/Add";
import { FetchApi } from "@/utils/FetchApi";
import UrlConfig from "@/config/UrlConfig";
import { showToast } from "@/components/Toast";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";
import { isNumberic } from "@/utils/helper";

const OrderProducts = (props: any) => {
    const {
        formik,
        handleChange,
        loadingSkeleton,
        handleAddProduct,
        handleDeleteProduct,
        isFieldDisabled,
    } = props;

    const [products, setProducts] = useState<any>([]);
    const { setLoading } = useLoadingContext();

    const getProducts = async () => {
        setLoading(true);
        const response = await FetchApi(
            UrlConfig.flower.getAll + "?isExport=true",
            "GET",
            true
        );
        if (response.canRefreshToken === false) {
            showToast(response.message, "warning");
        } else if (response.succeeded) {
            setProducts(response.data);
        } else {
            showToast(response.message, "error");
        }
        setLoading(false);
    };

    const handleUpdateOrderDetails = (index: any, field: any, value: any) => {
        if (field === "all")
            formik.setFieldValue(`orderDetails[${index}]`, value);
        else if (field === "numberOfFlowers")
            formik.setFieldValue(
                `orderDetails[${index}].${field}`,
                isNumberic(value) ? parseInt(value, 10) : value
            );
        else formik.setFieldValue(`orderDetails[${index}].${field}`, value);
        // console.log("field", field, "value", value);
        handleChange();
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <Card
            sx={{
                p: 0,
            }}
        >
            <CardContent>
                <Box sx={{ fontWeight: 700, marginBottom: 1 }}>
                    Sản phẩm được đặt
                </Box>
                <Space
                    direction="vertical"
                    size="middle"
                    style={{
                        display: "flex",
                    }}
                >
                    {formik.values.orderDetails &&
                        formik.values.orderDetails.map(
                            (product: any, index: any) => {
                                return (
                                    <OrderProduct
                                        key={product.key}
                                        product={product}
                                        error={
                                            formik.errors.orderDetails?.[index]
                                        }
                                        touched={
                                            formik.touched.orderDetails?.[index]
                                        }
                                        products={products}
                                        orderDetails={
                                            formik.values.orderDetails
                                        }
                                        index={index}
                                        loading={loadingSkeleton}
                                        handleChangeProduct={(
                                            key: any,
                                            value: any
                                        ) =>
                                            handleUpdateOrderDetails(
                                                index,
                                                key,
                                                value
                                            )
                                        }
                                        handleDeleteProduct={
                                            handleDeleteProduct
                                        }
                                        isFieldDisabled={isFieldDisabled}
                                    />
                                );
                            }
                        )}
                </Space>
                <Box>
                    {typeof formik.errors["orderDetails"] === "string" &&
                        formik.touched["orderDetails"] && (
                            <FormHelperText error>
                                {formik.errors["orderDetails"]}
                            </FormHelperText>
                        )}
                </Box>
                {!isFieldDisabled && (
                    <Button
                        onClick={handleAddProduct}
                        startIcon={
                            <SvgIcon fontSize="small">
                                <PlusIcon />
                            </SvgIcon>
                        }
                    >
                        Thêm sản phẩm
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderProducts;
