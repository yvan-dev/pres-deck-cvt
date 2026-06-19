import type { NextConfig } from "next";

// Deployed as a GitHub Pages project site at https://<user>.github.io/pres-deck-cvt/
// so we ship a fully static export served from the /pres-deck-cvt sub-path.
const repoBasePath = "/pres-deck-cvt";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? repoBasePath : undefined,
  assetPrefix: isGithubPages ? repoBasePath : undefined,
  images: {
    // GitHub Pages has no image optimization server. A custom loader keeps
    // images static while prefixing `basePath` (which `unoptimized` would drop).
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
  env: {
    // Exposed to the custom image loader so it can prefix asset paths.
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? repoBasePath : "",
  },
};

export default nextConfig;
