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
    // GitHub Pages has no image optimization server.
    unoptimized: true,
  },
};

export default nextConfig;
