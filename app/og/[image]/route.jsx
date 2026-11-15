// app/og/[image]/route.jsx
// Social preview cards (1200×630), prerendered at build time to out/og/<name>.png.
// The ".png" lives in the param so GitHub Pages serves the files as image/png.
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { getAllPosts } from "@/lib/blog";
import { projects } from "@/data/projects";
import { MARK_PATH } from "@/components/brand/Mark";
import { isStudioProject } from "@/components/brand/ProjectSignature";

export const dynamic = "force-static";
export const dynamicParams = false;

const font = (file) => readFileSync(join(process.cwd(), "assets/fonts", file));

const C = {
  ink: "#0E0B0B",
  paper: "#FFFFFF",
  text2: "#C9C4BF",
  text3: "#9A9591",
  rule: "#3A3333",
  signal: "#E0262C",
  safelight: "#8E1519",
  oxblood: "#3B0306",
};

const PAGES = {
  home: {
    label: "Software developer & designer",
    title: "Hi, I’m MattQ",
    description:
      "Roblox games with 5M+ visits, developer tools with 8,100+ installs and open-source platforms.",
  },
  blog: {
    label: "Blog",
    title: "Notes from the build",
    description:
      "Roblox development, web dev, game design, Arduino and dev tools.",
  },
  projects: {
    label: "Portfolio",
    title: "All projects",
    description:
      "Roblox games · Studio plugins · Web apps · Hardware builds · Open-source tools",
  },
  design: {
    label: "Visual portfolio",
    title: "Design",
    description: "Brand identity · Packaging · Social campaigns · Game GFX",
  },
};

function cards() {
  const out = { ...PAGES };
  for (const p of getAllPosts()) {
    out[`blog-${p.slug}`] = {
      label: `Blog · ${p.readingTime}`,
      title: p.title,
      description: p.description,
    };
  }
  for (const p of projects) {
    out[`project-${p.id}`] = {
      label: ["Project", p.startDate, p.endDate !== p.startDate && p.endDate]
        .filter(Boolean)
        .join(" · "),
      title: p.title,
      description: p.shortDescription,
      studio: isStudioProject(p),
    };
  }
  return out;
}

export function generateStaticParams() {
  return Object.keys(cards()).map((name) => ({ image: `${name}.png` }));
}

function Mark({ size, solid }) {
  return (
    <svg width={size} height={size * 0.95} viewBox="232 247 616 586">
      <path
        d={MARK_PATH}
        fill={solid ? C.paper : "none"}
        stroke={solid ? "none" : C.paper}
        strokeWidth={solid ? 0 : 16}
      />
    </svg>
  );
}

export async function GET(_req, { params }) {
  const { image } = await params;
  const card = cards()[image.replace(/\.png$/, "")];
  if (!card) return new Response("Not found", { status: 404 });

  const { label, title, description, studio } = card;
  const titleSize = title.length <= 24 ? 112 : title.length <= 48 ? 84 : 64;
  const endsWithPunct = /[.!?…]$/.test(title);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: C.ink,
        color: C.paper,
        fontFamily: "Inter",
        borderTop: `8px solid ${C.signal}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {studio ? (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                backgroundImage: `linear-gradient(180deg, ${C.safelight}, ${C.oxblood})`,
              }}
            >
              <Mark size={40} solid />
            </div>
            <span style={{ fontFamily: "JetBrains Mono", fontSize: 26 }}>
              MattQ Studios
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Mark size={56} />
            <div style={{ width: 12, height: 12, background: C.signal }} />
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 26,
                marginLeft: 6,
              }}
            >
              @mattqdev
            </span>
          </div>
        )}
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 22,
            color: C.text3,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "Instrument Serif",
            fontSize: titleSize,
            lineHeight: 1.02,
          }}
        >
          {/* One flex item per word so the red full stop wraps with the last word */}
          {title.split(" ").map((word, i, words) => (
            <span
              key={i}
              style={{
                display: "flex",
                marginRight: i < words.length - 1 ? "0.22em" : 0,
              }}
            >
              {word}
              {i === words.length - 1 && !endsWithPunct && (
                <span style={{ color: C.signal }}>.</span>
              )}
            </span>
          ))}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: C.text2,
              maxWidth: 980,
            }}
          >
            {description.length > 150
              ? description.slice(0, 147).trimEnd() + "…"
              : description}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${C.rule}`,
          paddingTop: 24,
          fontFamily: "JetBrains Mono",
          fontSize: 22,
          color: C.text3,
        }}
      >
        <span>mattqdev.github.io</span>
        <span>Web · Roblox · Design</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Instrument Serif",
          data: font("instrument-serif-latin-400-normal.woff"),
          weight: 400,
        },
        {
          name: "Inter",
          data: font("inter-latin-400-normal.woff"),
          weight: 400,
        },
        {
          name: "JetBrains Mono",
          data: font("jetbrains-mono-latin-500-normal.woff"),
          weight: 500,
        },
      ],
    }
  );
}
