const UrlConfig = {
    authentication: {
        login: `${process.env.NEXT_PUBLIC_SERVER_API_BASE}/auth/login`,
        register: `${process.env.NEXT_PUBLIC_SERVER_API_BASE}/auth/register`,
        logout: `${process.env.NEXT_PUBLIC_SERVER_API_BASE}/auth/logout`,
        refreshToken: `${process.env.NEXT_PUBLIC_SERVER_API_BASE}/auth/refresh-token`,
        validateEmail: `${process.env.NEXT_PUBLIC_SERVER_API_BASE}/auth/activate`,
        google: `${process.env.NEXT_PUBLIC_SERVER_API_BASE}/auth/google`,
        resetPassword: `${process.env.NEXT_PUBLIC_SERVER_API_BASE}/auth/reset-password`,
    },
};

export default UrlConfig;
