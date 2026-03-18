/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true, // /project/foo → /project/foo/index.html
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
