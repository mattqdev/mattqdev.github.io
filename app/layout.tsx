// app/layout.jsx
import {
  Archivo,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import "./globals.css";
import "./Blog.css";

// Brand type system (brand-manual.html §05), adapted for screen reading:
//   Instrument Serif (roman only — no italic on the web) → large display titles
//   Archivo Expanded → MattQ Studios names (wdth axis for font-stretch)
//   JetBrains Mono   → handle, labels, code
//   Inter            → body and all small headings
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--font-instrument",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E0B0B",
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
      className={`${archivo.variable} ${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
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
