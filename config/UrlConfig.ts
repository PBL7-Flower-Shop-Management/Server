const UrlConfig = {
    authentication: {
        login: `${process.env.SERVER_API_BASE}/auth/login`,
        register: `${process.env.SERVER_API_BASE}/auth/register`,
        logout: `${process.env.SERVER_API_BASE}/auth/logout`,
        refreshToken: `${process.env.SERVER_API_BASE}/auth/refresh-token`,
        validateEmail: `${process.env.SERVER_API_BASE}/auth/activate`,
        google: `${process.env.SERVER_API_BASE}/auth/google`,
        resetPassword: `${process.env.SERVER_API_BASE}/auth/reset-password`,
    },
};

export default UrlConfig;
