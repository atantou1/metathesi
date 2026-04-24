import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev' // Επιτρέπει όλα τα URL του GitHub Codespaces
      ],
    },
  },
};

export default nextConfig;