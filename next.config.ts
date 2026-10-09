import type { NextConfig } from "next";

/* GitHub Pages builds a static export under /<repo> (set by the workflow).
   Everywhere else (Vercel, `next start`) the app runs with the API route and image optimization. */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = isPages && repo && !repo.endsWith(".github.io") ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: isPages ? "export" : undefined,
  basePath: basePath || undefined,
  images: { unoptimized: isPages },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
