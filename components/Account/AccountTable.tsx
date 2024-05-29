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
import { alpha, styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import Chip from "@mui/material/Chip";
import { isValidUrl } from "@/utils/helper";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment-timezone";
import { zIndexLevel } from "@/utils/constants";
import { useLoadingContext } from "@/contexts/LoadingContext";

export const AccountTable = (props: any) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {},
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        onDeleteAccount,
        reload,
    } = props;
    const { setLoading } = useLoadingContext();

    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [selectedId, setSelectedId] = useState<any>(null);
    const [selected, setSelected] = useState<readonly string[]>([]);
    const [doDeleteOne, setDoDeleteOne] = useState(false);

    const StickyTableCell = styled(TableCell)(({ theme }) => ({
        position: "sticky",
        right: 0,
        background: theme.palette.background.paper,
        zIndex: zIndexLevel.one,
    }));

    const StickyLeftTableCell = styled(TableCell)(({ theme }) => ({
        position: "sticky",
        left: 0,
        background: theme.palette.background.paper,
        zIndex: zIndexLevel.one,
    }));

    const handleDeleteConfirm = () => {
        onDeleteAccount(doDeleteOne ? selectedId : selected);
        setOpenDeletePopup(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeletePopup(false);
        setSelectedId(null);
    };

    const handleDeleteClick = (id?: string) => {
        setOpenDeletePopup(true);
        if (id) setSelectedId(id);
        setDoDeleteOne(id !== undefined);
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

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

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

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    useEffect(() => setSelected([]), [reload]);

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
                                <IconButton onClick={() => handleDeleteClick()}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Toolbar>
                )}
                <TableContainer sx={{ maxHeight: 400 }}>
                    <Box sx={{ minWidth: 800 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StickyLeftTableCell
                                        sx={{
                                            zIndex: zIndexLevel.three,
                                        }}
                                    >
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
                                    </StickyLeftTableCell>
                                    <TableCell>Tên tài khoản</TableCell>
                                    <TableCell>Ảnh đại diện</TableCell>
                                    <TableCell>Họ và tên</TableCell>
                                    <TableCell>Chức vụ</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        Trạng thái tài khoản
                                    </TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell>Tạo bởi</TableCell>
                                    <StickyTableCell
                                        sx={{
                                            textAlign: "center",
                                            zIndex: zIndexLevel.three,
                                        }}
                                    >
                                        Hành động
                                    </StickyTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((account: any, index: any) => {
                                    const isItemSelected = isSelected(
                                        account._id
                                    );
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            key={account._id}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            selected={isItemSelected}
                                            onClick={(event) =>
                                                handleClick(event, account._id)
                                            }
                                            // onDoubleClick={() => {
                                            //     setLoading(true);
                                            //     router.push(
                                            //         `/account/${encodeURIComponent(
                                            //             account._id
                                            //         )}`
                                            //     );
                                            // }}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <StickyLeftTableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby":
                                                            labelId,
                                                    }}
                                                />
                                            </StickyLeftTableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2">
                                                    {account.username}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {isValidUrl(
                                                    account.avatarUrl
                                                ) && (
                                                    <Image
                                                        src={account.avatarUrl}
                                                        alt="avatar"
                                                        width={100}
                                                        height={100}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {account.name}
                                            </TableCell>
                                            <TableCell>
                                                {account.role}
                                            </TableCell>
                                            <TableCell>
                                                {account.email}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Chip
                                                    label={
                                                        account.isActived
                                                            ? "Đã kích hoạt"
                                                            : "Chưa kích hoạt"
                                                    }
                                                    color={
                                                        account.isActived
                                                            ? "primary"
                                                            : "warning"
                                                    }
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {moment
                                                    .tz(
                                                        account.createdAt,
                                                        "Asia/Ho_Chi_Minh"
                                                    )
                                                    .format("DD/MM/YYYY HH:mm")}
                                            </TableCell>
                                            <TableCell>
                                                {account.createdBy}
                                            </TableCell>
                                            <StickyTableCell
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
                                                            onClick={() =>
                                                                setLoading(true)
                                                            }
                                                            href={`/account/${encodeURIComponent(
                                                                account._id
                                                            )}                                                            
                                                          `}
                                                        >
                                                            <SvgIcon
                                                                color="primary"
                                                                fontSize="small"
                                                            >
                                                                <EyeIcon />
                                                            </SvgIcon>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Chỉnh sửa tài khoản">
                                                        <IconButton
                                                            LinkComponent={
                                                                NextLink
                                                            }
                                                            onClick={() =>
                                                                setLoading(true)
                                                            }
                                                            href={`/account/${encodeURIComponent(
                                                                account._id
                                                            )}?edit=1`}
                                                        >
                                                            <SvgIcon
                                                                color="warning"
                                                                fontSize="small"
                                                            >
                                                                <PencilSquareIcon />
                                                            </SvgIcon>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Xóa tài khoản">
                                                        <IconButton
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    account._id
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
                                            </StickyTableCell>
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
                    <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
                    <DialogContent>
                        {doDeleteOne
                            ? "Bạn có chắc chắn muốn xóa tài khoản này không?"
                            : "Bạn có chắc chắn muốn xoá những tài khoản đã chọn không?"}
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

AccountTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    onDeleteAccount: PropTypes.func,
    reload: PropTypes.bool,
};
