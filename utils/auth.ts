import { addMinutes, isAfter } from "date-fns";
import Cookies from "js-cookie";
import { FetchApi } from "./FetchApi";
import UrlConfig from "@/config/UrlConfig";

export const LocalStorageEventTarget = new EventTarget();

export const saveAccessToken = (access_token: string) => {
    localStorage.setItem("access_token", access_token);
};

export const saveRefreshToken = (refresh_token: string) => {
    localStorage.setItem("refresh_token", refresh_token);
};

export const clearLS = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("profile");
    const clearLSEvent = new Event("clearLS");
    LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const getAccessToken = () => localStorage.getItem("access_token") || "";

export const getRefreshToken = () =>
    localStorage.getItem("refresh_token") || "";

export const getProfile = () => {
    const result = localStorage.getItem("profile");
    return result ? JSON.parse(result) : null;
};

export const saveProfile = (profile: any) => {
    localStorage.setItem("profile", JSON.stringify(profile));
};

export const saveData = (data: any, name: string) => {
    localStorage.setItem(name, JSON.stringify(data));
};

export const getData = (name: string) => {
    const result = localStorage.getItem(name);
    return result ? JSON.parse(result) : null;
};

export const clearData = (name: string) => {
    localStorage.removeItem(name);
};

export const refreshToken: any = async () => {
    let token = Cookies.get("token");
    let refreshToken = Cookies.get("refreshToken");
    const storedTokenExpiryTime = Cookies.get("tokenExpiryTime");
    const storedRefreshTokenExpiryTime = Cookies.get("refreshTokenExpiryTime");
    try {
        if (
            !token ||
            !refreshToken ||
            !storedTokenExpiryTime ||
            !storedRefreshTokenExpiryTime
        ) {
            console.error("Missing necessary field to refresh token!");
            return {
                isSuccessfully: false,
                data: `Lỗi khi refresh token! Vui lòng đăng nhập lại!`,
            };
        }
        let tokenExpiryTime = new Date(storedTokenExpiryTime);
        if (
            tokenExpiryTime != null &&
            !isAfter(tokenExpiryTime, addMinutes(new Date(), 3)) //refresh trc khi hết hạn 3 phút
        ) {
            let refreshTokenExpiryTime = new Date(storedRefreshTokenExpiryTime);

            if (
                refreshTokenExpiryTime != null &&
                refreshTokenExpiryTime > new Date()
            ) {
                const isRefreshing = Cookies.get("isRefreshing");
                if (!isRefreshing) {
                    Cookies.set("isRefreshing", "true");
                } else if (isRefreshing === "true") {
                    return {
                        isSuccessfully: false,
                        data: `Đang trong quá trình refresh token, vui lòng đợi vài giây!`,
                    };
                }

                const response = await FetchApi(
                    UrlConfig.authentication.refreshToken,
                    "POST",
                    false,
                    { token: token, refreshToken: refreshToken }
                );
                if (response.succeeded) {
                    saveToken(response.data);
                    Cookies.remove("isRefreshing");
                    return {
                        isSuccessfully: true,
                        data: response.data.token.accessToken,
                    };
                } else {
                    Cookies.remove("isRefreshing");
                    return {
                        isSuccessfully: false,
                        data: `Refresh token thất bại: ${response.message}`,
                    };
                }
            } else {
                removeItems();
                return {
                    isSuccessfully: false,
                    data: "Refresh token hết hạn! Vui lòng đăng nhập lại!",
                };
            }
        }
        return { isSuccessfully: true, data: token };
    } catch (error) {
        Cookies.remove("isRefreshing");
        console.error("Lỗi khi refresh token:", error);
        return {
            isSuccessfully: false,
            data: `Lỗi khi refresh token: ${error}`,
        };
    }
};

export const saveToken = (response: any) => {
    const token = response.token?.accessToken ?? response.user?.accessToken;
    const refreshToken =
        response.token?.refreshToken ?? response.user?.refreshToken;
    const tokenExpiryTime =
        response.token?.accessTokenExpiresAt ??
        response.user?.accessTokenExpiresAt;
    const refreshTokenExpiryTime =
        response.token?.refreshTokenExpireAt ??
        response.user?.refreshTokenExpireAt;

    Cookies.set("token", token, { expires: new Date(refreshTokenExpiryTime) });
    Cookies.set("refreshToken", refreshToken, {
        expires: new Date(refreshTokenExpiryTime),
    });
    Cookies.set("tokenExpiryTime", tokenExpiryTime, {
        expires: new Date(refreshTokenExpiryTime),
    });
    Cookies.set("refreshTokenExpiryTime", refreshTokenExpiryTime, {
        expires: new Date(refreshTokenExpiryTime),
    });
};

export const removeItems = () => {
    Cookies.remove("token");
    Cookies.remove("tokenExpiryTime");
    Cookies.remove("refreshToken");
    Cookies.remove("refreshTokenExpiryTime");
};
