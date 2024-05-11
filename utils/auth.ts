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
