import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Grid,
    Stack,
} from "@mui/material";
import ShowPwdPhoto from "@/public/images/showPwd.png";
import HidePwdPhoto from "@/public/images/hidePwd.png";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const ChangePwdDialog = ({ open, onClose }: any) => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isShowPwd, setIsShowPwd] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const handleChange = (event: any) => {
        if (event && event.target) {
            const { name, value } = event.target;
            switch (name) {
                case "password":
                    setPassword(value);
                    break;
                case "newPassword":
                    setNewPassword(value);
                    break;
                case "confirmNewPassword":
                    setConfirmNewPassword(value);
                    break;
                default:
                    break;
            }
        }
    };

    const handleConfirm = () => {
        fetch(
            process.env.NEXT_PUBLIC_SERVER_API_BASE + "/user/change-password",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user.accessToken}`,
                },
                body: JSON.stringify({
                    password: password,
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword,
                }),
            }
        )
            .then(async (res) => {
                if (!res.ok) {
                    alert((await res.json()).message);
                } else return res.json();
            })
            .then(async (response) => {
                if (response) {
                    console.log(response);
                    onClose();
                    alert("Change your password successfully! Let's login");
                    await signOut({ redirect: false });
                    router.push("/login");
                }
            })
            .catch((error) => {
                alert("Error, check console to view!");
                console.log(error);
            });
    };

    const handleClearAll = () => {
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    };

    const handleClose = () => {
        handleClearAll();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thay đổi mật khẩu</DialogTitle>
            <DialogContent
                sx={{
                    pb: 0.5,
                }}
            >
                <Grid container spacing={2} flexDirection={"column"}>
                    <Grid item xs={12}>
                        <Stack direction={"row"} position={"relative"}>
                            <TextField
                                margin="dense"
                                name="password"
                                type={isShowPwd ? "text" : "password"}
                                label="Mật khẩu hiện tại"
                                value={password}
                                sx={{ width: "100%" }}
                                required
                                onChange={handleChange}
                                fullWidth
                            />
                            <Button
                                sx={{
                                    position: "absolute",
                                    zIndex: 10,
                                    right: 2,
                                    alignSelf: "center",
                                    borderRadius: 100,
                                }}
                                onClick={() => setIsShowPwd(!isShowPwd)}
                            >
                                <Image
                                    src={
                                        isShowPwd ? ShowPwdPhoto : HidePwdPhoto
                                    }
                                    alt="Show/hide"
                                    width={24}
                                    height={8}
                                />
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction={"row"} position={"relative"}>
                            <TextField
                                name="newPassword"
                                label="Mật khẩu mới"
                                type={isShowPwd ? "text" : "password"}
                                value={newPassword}
                                sx={{ width: "100%" }}
                                required
                                onChange={handleChange}
                                fullWidth
                            />
                            <Button
                                sx={{
                                    position: "absolute",
                                    zIndex: 10,
                                    right: 2,
                                    alignSelf: "center",
                                    borderRadius: 100,
                                }}
                                onClick={() => setIsShowPwd(!isShowPwd)}
                            >
                                <Image
                                    src={
                                        isShowPwd ? ShowPwdPhoto : HidePwdPhoto
                                    }
                                    alt="Show/hide"
                                    width={24}
                                    height={8}
                                />
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction={"row"} position={"relative"}>
                            <TextField
                                name="confirmNewPassword"
                                label="Xác nhận mật khẩu mới"
                                type={isShowPwd ? "text" : "password"}
                                value={confirmNewPassword}
                                sx={{ width: "100%" }}
                                required
                                onChange={handleChange}
                                fullWidth
                            />
                            <Button
                                sx={{
                                    position: "absolute",
                                    zIndex: 10,
                                    right: 2,
                                    alignSelf: "center",
                                    borderRadius: 100,
                                }}
                                onClick={() => setIsShowPwd(!isShowPwd)}
                            >
                                <Image
                                    src={
                                        isShowPwd ? ShowPwdPhoto : HidePwdPhoto
                                    }
                                    alt="Show/hide"
                                    width={24}
                                    height={8}
                                />
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleConfirm}
                    color="success"
                    variant="outlined"
                    sx={{ fontFamily: "sans-serif" }}
                >
                    Xác nhận
                </Button>
                <Button
                    onClick={handleClearAll}
                    color="warning"
                    variant="outlined"
                    sx={{ fontFamily: "sans-serif" }}
                >
                    Xoá tất cả
                </Button>
                <Button
                    onClick={handleClose}
                    color="error"
                    variant="outlined"
                    sx={{ fontFamily: "sans-serif" }}
                >
                    Thoát
                </Button>
            </DialogActions>
        </Dialog>
    );
};
