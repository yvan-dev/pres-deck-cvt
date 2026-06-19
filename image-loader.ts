// Custom next/image loader for the static export.
//
// On GitHub Pages the site is served from the /pres-deck-cvt sub-path. With
// `unoptimized` images Next does not prepend `basePath` to the raw `src`, so we
// do it here. This keeps every <Image src="/generated/..."> working both
// locally (no prefix) and on Pages (prefixed).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src }: ImageLoaderParams): string {
  // Leave absolute/remote URLs untouched.
  if (/^https?:\/\//.test(src)) {
    return src;
  }

  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `${basePath}${normalized}`;
}
