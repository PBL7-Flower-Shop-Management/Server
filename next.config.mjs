/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "happyflower.vn",
            },
            {
                protocol: "https",
                hostname: "th.bing.com",
            },
            {
                protocol: "https",
                hostname: "kenh14cdn.com",
            },
            {
                protocol: "https",
                hostname: "product.hstatic.net",
            },
            {
                protocol: "https",
                hostname: "file1.hutech.edu.vn",
            },
            {
                protocol: "https",
                hostname: "media.istockphoto.com",
            },
            {
                protocol: "https",
                hostname: "static.wixstatic.com",
            },
            {
                protocol: "https",
                hostname: "juro.com.vn",
            },
            {
                protocol: "http",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "50mb", // Set desired value here
        },
    },
};

export default nextConfig;
