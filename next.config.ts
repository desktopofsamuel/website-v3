import type { NextConfig } from 'next';
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  transpilePackages: ["leaflet", "react-leaflet"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'a.ltrbxd.com',
      },
    ],
  },
};

export default withContentlayer(nextConfig); 