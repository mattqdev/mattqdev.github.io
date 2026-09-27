// app/layout.jsx
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b12",
  colorScheme: "dark",
};

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
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
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
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
