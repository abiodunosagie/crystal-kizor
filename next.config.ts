import type { NextConfig } from "next";

// The site is a single static page, so it is exported as plain HTML, CSS and
// JS and served from Cloudflare's edge with no server at all. Images are
// pre-sized at build time (scripts/prepare-assets.mjs) and picked by a custom
// loader, because the default optimiser needs a running server.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
