import path from "node:path";
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src")],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
