// app/page.jsx
// This is a Server Component by default in App Router.
// All child components that use browser APIs / hooks are marked 'use client'.
import SiteShell from "@/components/SiteShell";
import { SITE_URL } from "@/lib/seo";

// Structured data so search engines can tie the site to its owner.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "MattQ",
  alternateName: ["Matteo Scarcella", "mattqdev"],
  url: SITE_URL,
  image: `${SITE_URL}/icon.png`,
  jobTitle: "Software Developer & Designer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Florence",
    addressCountry: "IT",
  },
  sameAs: [
    "https://github.com/mattqdev",
    "https://devforum.roblox.com/u/mattqdev",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <SiteShell />
    </>
  );
}
