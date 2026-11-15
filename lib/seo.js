// lib/seo.js
// One place for page metadata: canonical URL, Open Graph and Twitter card.
// Images come from app/og/[image]/route.jsx, prerendered to /og/<name>.png.

export const SITE_URL = "https://mattqdev.github.io";
export const SITE_NAME = "MattQ";

export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
  ...og
}) {
  const images = [
    { url: `/og/${image}.png`, width: 1200, height: 630, alt: title },
  ];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images,
      ...og,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@mattqdev",
      title,
      description,
      images,
    },
  };
}
