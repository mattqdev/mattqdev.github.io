// app/layout.jsx
import { Syne, DM_Sans } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import "./Blog.css";

// Load fonts via next/font — zero layout shift, no external request at runtime
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MattQ — Developer & Designer",
  description:
    "Portfolio of MattQ — Web developer, Roblox game developer and UI/UX designer.",
  openGraph: {
    title: "MattQ — Developer & Designer",
    description: "Web · Roblox · Design",
    url: "https://mattqdev.github.io",
    siteName: "MattQ Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@mattqdev",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "mZD-GZIQxWFBVVNpzrQ_V1Vmf8do93uwLkKfn10dJrA",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        {/* JetBrains Mono for mono labels — loaded separately to avoid variable font issues */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/icon.ico" />
        {/* Microsoft Clarity analytics */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xpbas038pb");`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
