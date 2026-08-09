import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Next infer the wrong
  // workspace root, which mangles Turbopack chunk URLs (the project path contains
  // a space + apostrophe) and breaks client hydration in dev. Pin the root here.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
