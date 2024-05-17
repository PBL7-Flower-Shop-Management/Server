import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    SvgIcon,
} from "@mui/material";
import OrderProduct from "./OrderProduct";
import { Space } from "antd";
import PlusIcon from "@mui/icons-material/Add";

const OrderProducts = (props: any) => {
    const {
        productInfos,
        products,
        loading,
        handleSubmit,
        handleAddProduct,
        handleDeleteProduct,
        canEdit,
        isSubmitting,
    } = props;

    const handleSubmitInfo = (index: any, values: any) => {
        console.log("submit info");
        console.log([
            ...productInfos.slice(0, index),
            { ...values },
            ...productInfos.slice(index + 1),
        ]);
        handleSubmit([
            ...productInfos.slice(0, index),
            { ...values },
            ...productInfos.slice(index + 1),
        ]);
    };

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
                    {productInfos &&
                        productInfos.map((product: any, index: any) => {
                            return (
                                <OrderProduct
                                    key={product.key}
                                    product={product}
                                    products={products}
                                    productsOfOrder={productInfos}
                                    index={index}
                                    loading={loading}
                                    handleSubmit={(values: any) =>
                                        handleSubmitInfo(index, values)
                                    }
                                    handleDeleteProduct={handleDeleteProduct}
                                    canEdit={canEdit}
                                />
                            );
                        })}
                </Space>
                {canEdit && (
                    <Button
                        onClick={handleAddProduct}
                        startIcon={
                            <SvgIcon fontSize="small">
                                <PlusIcon />
                            </SvgIcon>
                        }
                        // sx={{ marginTop: 2 }}
                        // variant="contained"
                    >
                        Thêm sản phẩm
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderProducts;
