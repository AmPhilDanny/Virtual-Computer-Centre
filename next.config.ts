import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  // Prevent next.js from bundling node-native or complex packages
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default withPWA(nextConfig);
