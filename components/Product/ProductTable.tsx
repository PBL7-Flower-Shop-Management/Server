import PropTypes from "prop-types";
import NextLink from "next/link";
import {
    Box,
    Card,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    TablePagination,
    SvgIcon,
    Checkbox,
    Toolbar,
} from "@mui/material";
import PencilSquareIcon from "@mui/icons-material/ModeEditOutlined";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import TrashIcon from "@mui/icons-material/DeleteOutline";
import { alpha } from "@mui/material/styles";
import React, { useEffect } from "react";
import { Stack } from "@mui/system";
import { productStatus, productStatusColor } from "@/utils/constants";
import Chip from "@mui/material/Chip";
import { ShortenString } from "@/utils/helper";
import moment from "moment-timezone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProductTable = (props: any) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {},
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        onDeleteProduct,
        isFetching,
    } = props;
    const router = useRouter();

    const [openDeletePopup, setOpenDeletePopup] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState("");
    const [selected, setSelected] = React.useState<readonly number[]>([]);

    const handleDeleteConfirm = () => {
        onDeleteProduct(selectedId);
        setOpenDeletePopup(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeletePopup(false);
        setSelectedId("");
    };

    const handleDeleteClick = (id: any) => {
        setOpenDeletePopup(true);
        setSelectedId(id);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = items.map((n: any) => n._id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    return (
        <Box>
            <Card>
                {selected.length > 0 && (
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                            ...(selected.length > 0 && {
                                bgcolor: (theme: any) =>
                                    alpha(
                                        theme.palette.primary.main,
                                        theme.palette.action.activatedOpacity
                                    ),
                            }),
                        }}
                    >
                        {selected.length > 0 && (
                            <Typography
                                sx={{ flex: "1 1 100%" }}
                                color="inherit"
                                variant="subtitle1"
                                component="div"
                            >
                                {selected.length} selected
                            </Typography>
                        )}
                        {selected.length > 0 && (
                            <Tooltip title="Delete">
                                <IconButton>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Toolbar>
                )}
                <TableContainer sx={{ maxHeight: 1200 }}>
                    <Box sx={{ minWidth: 800 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            indeterminate={
                                                selected.length > 0 &&
                                                selected.length < items.length
                                            }
                                            checked={
                                                items.length > 0 &&
                                                selected.length === items.length
                                            }
                                            onChange={handleSelectAllClick}
                                            inputProps={{
                                                "aria-label":
                                                    "select all desserts",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>Mã sản phẩm</TableCell>
                                    <TableCell>Minh hoạ</TableCell>
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>Môi trường</TableCell>
                                    <TableCell
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        Đơn giá ($)
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        Giảm giá (%)
                                    </TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Đã bán</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell>Tạo bởi</TableCell>
                                    <TableCell
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        Hành động
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((product: any, index: any) => {
                                    const isItemSelected = isSelected(
                                        product._id
                                    );
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            key={product._id}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            selected={isItemSelected}
                                            onClick={(event) =>
                                                handleClick(event, product._id)
                                            }
                                            onDoubleClick={() =>
                                                router.push(
                                                    `/product/${encodeURIComponent(
                                                        product._id
                                                    )}&name=${encodeURIComponent(
                                                        product.name
                                                    )}`
                                                )
                                            }
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby":
                                                            labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2">
                                                    {product._id}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Image
                                                    src={product.image}
                                                    alt="avatar"
                                                    width={100}
                                                    height={100}
                                                />
                                            </TableCell>
                                            <TableCell id={labelId} scope="row">
                                                <Typography variant="subtitle2">
                                                    {product.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {product.habitat}
                                            </TableCell>
                                            <TableCell>
                                                {product.unitPrice}
                                            </TableCell>
                                            <TableCell>
                                                {product.discount}
                                            </TableCell>
                                            <TableCell>
                                                {product.quantity}
                                            </TableCell>
                                            <TableCell>
                                                {product.soldQuantity}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Chip
                                                    label={
                                                        productStatus[
                                                            product.status
                                                        ]
                                                    }
                                                    color={
                                                        productStatusColor[
                                                            product.status
                                                        ]
                                                    }
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {ShortenString(
                                                    product.description,
                                                    30
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {moment
                                                    .tz(
                                                        product.createdAt,
                                                        "Asia/Ho_Chi_Minh"
                                                    )
                                                    .format("DD/MM/YYYY HH:mm")}
                                            </TableCell>
                                            <TableCell>
                                                {product.createdBy}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "center",
                                                    justifyContent: "center",
                                                }}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Stack
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    direction="row"
                                                    spacing={-1}
                                                >
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            LinkComponent={
                                                                NextLink
                                                            }
                                                            href={`/product/${encodeURIComponent(
                                                                product._id
                                                            )}&name=${encodeURIComponent(
                                                                product.name
                                                            )}`}
                                                        >
                                                            <SvgIcon
                                                                color="primary"
                                                                fontSize="small"
                                                            >
                                                                <EyeIcon />
                                                            </SvgIcon>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Chỉnh sửa sản phẩm">
                                                        <IconButton
                                                            LinkComponent={
                                                                NextLink
                                                            }
                                                            href={`/product/${encodeURIComponent(
                                                                product._id
                                                            )}&name=${encodeURIComponent(
                                                                product.name
                                                            )}`}
                                                            // href={{
                                                            //     pathname:
                                                            //         "/product/[id]",
                                                            //     query: {
                                                            //         id: encodeURIComponent(
                                                            //             product._id
                                                            //         ),
                                                            //         name: encodeURIComponent(
                                                            //             product.name
                                                            //         ),
                                                            //     },
                                                            // }}
                                                        >
                                                            <SvgIcon
                                                                color="warning"
                                                                fontSize="small"
                                                            >
                                                                <PencilSquareIcon />
                                                            </SvgIcon>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Xóa sản phẩm">
                                                        <IconButton
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    product._id
                                                                )
                                                            }
                                                        >
                                                            <SvgIcon
                                                                color="error"
                                                                fontSize="small"
                                                            >
                                                                <TrashIcon />
                                                            </SvgIcon>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={count}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 20]}
                />
                <Dialog open={openDeletePopup} onClose={handleDeleteCancel}>
                    <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                    <DialogContent>
                        Bạn có chắc chắn muốn xóa sản phẩm này?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCancel} color="primary">
                            Hủy
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="error">
                            Xác nhận
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </Box>
    );
};

ProductTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    onDeleteProduct: PropTypes.func,
    isFetching: PropTypes.bool,
};
