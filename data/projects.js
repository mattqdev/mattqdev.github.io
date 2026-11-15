// src/data/projects.js
import {
  FaUsers,
  FaDownload,
  FaStar,
  FaEye,
  FaUserFriends,
  FaMoneyBill,
  FaHeart,
  FaTrophy,
  FaLightbulb,
  FaBox,
  FaImage,
} from "react-icons/fa";

import { TAGS } from "./tags";

export const projects = [
  {
    id: "physicshub",
    title: "PhysicsHub",
    shortDescription:
      "Website that contains free physics simulations for students.",
    description:
      "PhysicsHub is a website that provides free physics simulations for students. It aims to help students understand complex physics concepts through interactive simulations.",
    startDate: "Jul 2025",
    endDate: "Present",
    tags: [
      TAGS.WEBSITE,
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.PHYSICS,
      TAGS.REACT,
    ],
    thumbnail:
      "https://raw.githubusercontent.com/PhysicsHub/physicshub.github.io/refs/heads/main/public/screenshots/v3.24.0/main.png",
    links: [
      {
        type: "github",
        url: "https://github.com/physicshub/physicshub.github.io",
        label: "Repository Link",
      },
    ],
    images: [
      {
        src: "https://github.com/PhysicsHub/physicshub.github.io/blob/main/public/screenshots/v3.24.0/main.png?raw=true",
        alt: "PhysicsHub Preview",
      },
    ],
    isOpenSource: true,
    features: [
      "Interactive physics simulations",
      "Educational resources for students",
      "User-friendly interface",
      "Responsive design",
      "Open source for community contributions",
    ],
    technologies: [TAGS.HTML_CSS, TAGS.JAVASCRIPT, TAGS.REACT],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "It's a work in progress, but it's already functional.",
        metric: "WIP",
      },
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "It's open source and anyone can contribute.",
        metric: "Open Source",
      },
    ],
  },
  {
    id: "stackfingerprint",
    title: "StackFingerprint",
    shortDescription:
      "Scan any GitHub repo and generate embeddable SVG card of its tech stack.",
    description:
      "Scan any public GitHub repo and generate a beautiful, embeddable SVG card of its tech stack. Zero auth, zero config.",
    startDate: "Mar 2026",
    endDate: "Present",
    tags: [
      TAGS.WEBSITE,
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.REACT,
      TAGS.TAILWIND_CSS,
    ],
    thumbnail: "StackFingerprintThumb.png",
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/stackfingerprint",
        label: "Repository Link",
      },
    ],
    isOpenSource: true,
    features: [
      "Generate a visually appealing SVG card showcasing the technologies used in the repository",
      "Fully customizable beautiful cards with different themes and layouts",
      "Zero auth and completely free.",
      "Supports a wide range of programming languages, frameworks and dev tools",
    ],
    technologies: [TAGS.HTML_CSS, TAGS.JAVASCRIPT, TAGS.REACT],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "It's a work in progress, but it's already functional.",
        metric: "WIP",
      },
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "It has a easy to use API without auth.",
        metric: "Free API",
      },
    ],
  },
  {
    id: "goalmageddon",
    title: "GOALMAGEDDON",
    shortDescription:
      "A vehicular soccer/combat Roblox game — Carmageddon meets Rocket League — with 1.5M+ visits.",
    description:
      "GOALMAGEDDON is a Roblox game that blends vehicular combat with sports gameplay — think Carmageddon meets Rocket League. Players pick a vehicle, arm up, and drive, shoot, and smash their way to victory across multiple game modes. I'm the co-owner, owner is @PenninoITA81",
    startDate: "Jun 2026",
    endDate: "Present",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.GAME_DESIGN, TAGS.UI_UX],
    thumbnail: "GoalmageddonThumb.png",
    thumbnailFit: "contain",
    links: [
      {
        type: "play",
        url: "https://www.roblox.com/games/137024130309002/GOALMAGEDDON",
        label: "Play Game",
      },
    ],
    isOpenSource: false,
    features: [
      "4 vehicles — Speeder, Tank, Phantom & Juggernaut (Phantom & Juggernaut unlockable through Wins & Kills)",
      "Upgrade Speed, Acceleration, Armor & Shield up to Lv10, with realistic trailing-arm suspension",
      "3 weapons + jump: Vulcan Cannon, Forcefield, Proximity Mines and a jump to launch over enemies",
      "3 game modes — Soccer 2v2, Deathmatch 3v3 and Race FFA (6 players)",
      "Cosmetics: skins, underglow, tires, rims & more",
      "Cross-platform (PC, Console, Mobile) with a strictly no pay-to-win design",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaEye />,
        title: "Total Visits",
        description: "Game visits since launch",
        metric: "1.5M+",
      },
      {
        icon: <FaUsers />,
        title: "Active Players",
        description: "Peak CCU (concurrent players)",
        metric: "800+",
      },
      {
        icon: <FaHeart />,
        title: "Favorites",
        description: "Times favorited on Roblox",
        metric: "27K+",
      },
      {
        icon: <FaStar />,
        title: "User Rating",
        description: "Like ratio on Roblox",
        metric: "68%",
      },
    ],
  },
  {
    id: "brawl-stars-pet-simulator",
    title: "Brawl Stars Pet Simulator",
    shortDescription:
      "A Roblox pet simulator game inspired by Brawl Stars with 3.4M+ visits.",
    description: (
      <>
        Brawl Stars Pet Simulator is a Roblox game that combines popular
        characters from the Brawl Stars universe with pet collection mechanics.
        Players can collect, earn, and hatch pets inspired by their favorite
        Brawl Stars characters. The game was banned due to a DMCA takedown (not
        for Supercell copyright violations&mdash;learn more{" "}
        <a
          href="https://devforum.roblox.com/t/3591519"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        ), but it remains a significant project in my portfolio.
      </>
    ),
    startDate: "Jun 2024",
    endDate: "Jan 2025",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.UI_UX, TAGS.GAME_DESIGN],
    thumbnail: "Thumbnail3v2.png",
    links: [
      {
        type: "play",
        url: "https://www.roblox.com/games/17359625840",
        label: "Original Game (Banned)",
      },
      {
        type: "play",
        url: "https://www.roblox.com/join/bx67q",
        label: "Reuploaded Version",
      },
    ],
    isOpenSource: false,
    features: [
      "Pet collection system with tons of pets",
      "More that 20 different areas",
      "Collecting system with leaderboards",
      "In-game economy with virtual currency",
      "And much more.",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaUsers />,
        title: "Active Players",
        description: "Peak concurrent players",
        metric: "2000+",
      },
      {
        icon: <FaEye />,
        title: "Total Visits",
        description: "Game visits since launch",
        metric: "3.4M+",
      },
      {
        icon: <FaStar />,
        title: "User Rating",
        description: "Average player rating",
        metric: "82%",
      },
      {
        icon: <FaMoneyBill />,
        title: "Robux Earned",
        description: "Robux Earned by Gamepasses",
        metric: "500.000+",
      },
      {
        icon: <FaUserFriends />,
        title: "Community",
        description: "Community members",
        metric: "87.000+",
      },
    ],
  },
  {
    id: "pantryos",
    title: "PantryOS",
    shortDescription:
      "A startup I'm building: a shared, real-time pantry inventory with IoT barcode scanners. Work in progress.",
    description:
      "PantryOS is the startup I'm trying to launch. It turns a home or business pantry into a real-time, shared inventory: a household group shares its pantries, products and history, gets alerts when stock runs low, generates shopping lists and sees consumption analytics. Products come in through the mobile scanner or through a physical barcode scanner I'm building on an ESP32 camera board, backed by a decoding server. Everything is still a work in progress, so the code stays private.",
    startDate: "Oct 2025",
    endDate: "Present",
    tags: [TAGS.WEBSITE, TAGS.REACT, TAGS.TYPESCRIPT, TAGS.UI_UX, TAGS.ESP32],
    thumbnail: "preview.webp",
    links: [
      {
        type: "live",
        url: "https://pantryos.lovable.app",
        label: "Website",
      },
    ],
    isOpenSource: false,
    signature: "founder",
    features: [
      "Shared groups with pantries, roles and invitations",
      "Real-time stock with low-stock alerts and shopping lists",
      "Consumption analytics and reports",
      "Mobile barcode scanning in the web app",
      "Physical IoT barcode scanner on ESP32 (in development)",
    ],
    technologies: [
      TAGS.REACT,
      TAGS.TYPESCRIPT,
      TAGS.TAILWIND_CSS,
      TAGS.CPP,
      TAGS.PYTHON,
    ],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Status",
        description: "Startup in development",
        metric: "WIP",
      },
    ],
  },
  {
    id: "warp-arena",
    title: "Warp Arena",
    shortDescription:
      "A portal arena shooter on Roblox: open portals, flank enemies and keep your speed through them.",
    description:
      "Warp Arena is a fast portal shooter I built at MattQ Studios. Players place two portals on portal walls to warp across the map, sprint, slide and jetpack through them without losing momentum, and fight in Team Deathmatch, Free-for-All and Portal Frenzy. Combat is server-authoritative: every shot is validated on the server against exploits. Bots run on a single shared state-machine scheduler with distance-based LOD, so a full lobby stays cheap to simulate.",
    startDate: "Apr 2026",
    endDate: "Present",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.GAME_DESIGN, TAGS.UI_UX],
    thumbnail: "10772469130-1.webp",
    links: [
      {
        type: "play",
        url: "https://www.roblox.com/games/134646755101558",
        label: "Play Game",
      },
    ],
    isOpenSource: false,
    features: [
      "Two-portal system with momentum carried through every warp",
      "Server-authoritative combat that validates every shot against exploits",
      "Bots on one shared state-machine scheduler with distance LOD",
      "Team Deathmatch, Free-for-All and Portal Frenzy, with map voting",
      "Arsenal upgrades, skins, kill effects, Battle Pass and Ranked divisions",
      "Parties of up to 4 friends on the same team",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaEye />,
        title: "Total Visits",
        description: "In the first weeks after launch (Oct 2026)",
        metric: "14K+",
      },
    ],
  },
  {
    id: "atelier",
    title: "Atelier",
    shortDescription:
      "An AI-native, Figma-style design canvas where every board is a plain HTML file.",
    description:
      "Atelier is a static, multi-project design canvas: every board is an HTML file (or an image) placed on an infinite plane with pan, zoom, layers and selection. I design with it through Claude Code, which writes the boards while Atelier shows them live, then export them to PNG, JPG or PDF through headless Chrome. There is no build step and no dependency: a small standard-library Python server runs it. I used it to produce 440+ boards of brand, product and campaign design across 5 projects, including this site's brand manual and my resume.",
    startDate: "Oct 2026",
    endDate: "Present",
    tags: [TAGS.WEBSITE, TAGS.JAVASCRIPT, TAGS.PYTHON, TAGS.UI_UX],
    thumbnail: "preview.webp",
    thumbnailFit: "contain",
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/Atelier",
        label: "Repository",
      },
    ],
    isOpenSource: true,
    features: [
      "Infinite canvas with pan/zoom, layers and selection",
      "Boards are plain HTML files, written and edited live by Claude Code",
      "Headless-Chrome export to PNG, JPG and PDF",
      "Standard-library Python server, no build step, no dependencies",
      "One-click launcher for macOS, Linux and Windows",
      "i18n and CI",
    ],
    technologies: [TAGS.JAVASCRIPT, TAGS.PYTHON, TAGS.HTML_CSS],
    achievements: [
      {
        icon: <FaImage />,
        title: "Boards",
        description: "Brand, product and campaign boards designed with it",
        metric: "440+",
      },
    ],
  },
  {
    id: "globaladv",
    title: "Global Adv",
    shortDescription:
      "An open-source Discord bot that cross-posts your server's ad to a network of communities.",
    description:
      "Global Adv is a Discord bot for growing servers through an ad network: one /bump delivers your server's ad to every server in the same topic rooms. I first launched it in 2022 and recently rebuilt it and made it open source, with a new identity designed in Atelier. Every delivery goes through a gate of blocklists, daily caps, quiet hours and a trust score, with hidden-channel detection, a sandbox for new servers and a moderation console for reports.",
    startDate: "Aug 2022",
    endDate: "Present",
    tags: [TAGS.TYPESCRIPT],
    thumbnail: "preview.webp",
    thumbnailFit: "contain",
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/GlobalAdv",
        label: "Repository",
      },
      {
        type: "live",
        url: "https://top.gg/bot/1010904327902203914/",
        label: "Add on top.gg",
      },
    ],
    isOpenSource: true,
    features: [
      "Guided /setup checklist and /bump every 4 hours",
      "13 topic rooms, including an age-gated one",
      "Trust score (0–100), sandbox for new servers and hidden-channel strikes",
      "Report button on every ad and a moderation console for operators",
      "Invite validation and least-privilege permissions (never Administrator)",
      "TypeScript monorepo: discord.js v14, Supabase Postgres, Zod, Vitest",
    ],
    technologies: [TAGS.TYPESCRIPT],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Open Source",
        description: "Rebuilt and released under MIT",
        metric: "MIT",
      },
    ],
  },
  {
    id: "redline-rivals",
    title: "Redline Rivals",
    shortDescription:
      "A top-down arcade racing game for the browser: you against three AI drivers.",
    description:
      "Redline Rivals is a top-down arcade racing game for the web, built with Phaser 3 and Vite as my first game for browser portals like CrazyGames. You race three laps against three AI opponents, with a countdown, a live HUD for lap, time and position, and a results screen. It ships as a static bundle with no backend, and it's still in development.",
    startDate: "Sep 2026",
    endDate: "Present",
    tags: [TAGS.JAVASCRIPT, TAGS.GAME_DESIGN, TAGS.UI_UX],
    thumbnail: "preview.webp",
    links: [
      {
        type: "play",
        url: "https://mattqdev.itch.io/redline-rivals",
        label: "Play on itch.io",
      },
    ],
    isOpenSource: false,
    features: [
      "Single player against 3 AI drivers",
      "3-lap races with countdown, lap timer and position HUD",
      "Results screen with retry",
      "Static build, no backend, CrazyGames SDK integration",
    ],
    technologies: [TAGS.JAVASCRIPT],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Status",
        description: "In development on itch.io",
        metric: "WIP",
      },
    ],
  },
  {
    id: "koalaz",
    title: "Koalaz",
    shortDescription:
      "A fun npm package for generating koala-themed mock data — a meme-style alternative to Faker.",
    description:
      "Why use boring Lorem Ipsum or generic fake data when you can use koalas? Koalaz is a lightweight npm package for generating absurd, koala-themed mock data. Generate JSON objects, lorem ipsum made of koala sounds, ASCII art, fake API responses, data tables, and more. A meme-style alternative to Faker for tests, prototypes, and developers who want something more fun.",
    startDate: "Nov 2025",
    endDate: "Present",
    tags: [TAGS.JAVASCRIPT, TAGS.TYPESCRIPT ?? TAGS.JAVASCRIPT],
    thumbnail: null,
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/koalaz",
        label: "Repository",
      },
      {
        type: "live",
        url: "https://www.npmjs.com/package/koalaz",
        label: "npm package",
      },
    ],
    isOpenSource: true,
    features: [
      "Generate absurd JSON data about koalas (id, name, mood, sleepHours, eucalyptusConsumed…)",
      "Lorem ipsum made entirely of koala sounds",
      "ASCII koala art with multiple expressions (judging, sleeping, happy…)",
      "Fake data tables for quick UI mockups",
      "API response faker — mock any endpoint with koala data",
      "Lightweight alternative to Faker with zero serious dependencies",
      "Works with both ESM (import) and CJS (require)",
    ],
    technologies: [TAGS.JAVASCRIPT],
    achievements: [
      {
        icon: <FaBox />,
        title: "npm Downloads",
        description: "Total package downloads",
        metric: "439+",
      },
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "MIT licensed and open to contributions.",
        metric: "Open Source",
      },
    ],
  },
  {
    id: "site-seo-kit",
    title: "site-seo-kit",
    shortDescription:
      "A zero-dependency npm package for SEO and GEO on static and Next.js sites.",
    description:
      "site-seo-kit is the SEO and GEO (generative engine optimization) plumbing a static or Next.js site keeps rewriting, as one zero-dependency package. You switch on only the modules you need: sitemap and routes manifest, robots.txt with an AI-crawler policy, an Atom feed, llms.txt with a Markdown twin of every page, JSON-LD, and URL submission to the Google Indexing API and IndexNow.",
    startDate: "Oct 2026",
    endDate: "Present",
    tags: [TAGS.WEBSITE, TAGS.JAVASCRIPT, TAGS.NEXTJS],
    thumbnail: null,
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/site-seo-kit",
        label: "Repository",
      },
      {
        type: "download",
        url: "https://www.npmjs.com/package/site-seo-kit",
        label: "npm package",
      },
    ],
    isOpenSource: true,
    features: [
      "sitemap.xml from routes on disk, declared routes and your data",
      "robots.txt with an AI-crawler policy per category",
      "llms.txt, llms-full.txt and a Markdown twin of every page",
      "JSON-LD (schema.org) manifest for every page",
      "Atom feed",
      "Google Indexing API and IndexNow submission",
    ],
    technologies: [TAGS.JAVASCRIPT],
    achievements: [
      {
        icon: <FaBox />,
        title: "Dependencies",
        description: "Ships with none",
        metric: "0",
      },
    ],
  },
  {
    id: "placet",
    title: "Placet",
    shortDescription:
      "A VS Code extension that commits each AI coding task on its own, once you approve it.",
    description:
      "Placet is approve-to-commit for AI coding assistants. It tracks what Claude Code or opencode is doing, task by task, in a panel in the VS Code Explorer. When a task is done and tested you give it a thumbs up: Placet stages and commits only the files that task touched, with a generated commit message and a push confirmation. Long agent sessions end up as one clean commit per unit of work instead of one giant commit.",
    startDate: "Aug 2026",
    endDate: "Present",
    tags: [TAGS.TYPESCRIPT],
    thumbnail: "preview.webp",
    thumbnailFit: "contain",
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/Placet",
        label: "Repository",
      },
      {
        type: "download",
        url: "https://marketplace.visualstudio.com/items?itemName=mattqdev.placet",
        label: "VS Code Marketplace",
      },
    ],
    isOpenSource: true,
    features: [
      "Per-task tracking of Claude Code and opencode sessions",
      "Stages and commits only the files a task touched",
      "Generated commit messages",
      "Push confirmation before anything leaves your machine",
    ],
    technologies: [TAGS.TYPESCRIPT],
    achievements: [],
  },
  {
    id: "portfolio",
    title: "MattQ Portfolio",
    shortDescription:
      "My personal portfolio and blog, built with Next.js. (It's this website btw)",
    description:
      "My personal portfolio and blog, now in its third version. It's built with Next.js and React and exported as a fully static site on GitHub Pages: project pages with live GitHub and Roblox stats, a design section, and a Markdown blog with an RSS feed. The visual identity follows my own brand manual. The previous versions are still online: v1 at /v1 and my first HTML/CSS portfolio at /v0.",
    startDate: "Sep 2026",
    endDate: "Present",
    tags: [
      TAGS.WEBSITE,
      TAGS.NEXTJS,
      TAGS.REACT,
      TAGS.JAVASCRIPT,
      TAGS.HTML_CSS,
    ],
    thumbnail: "preview.png",
    links: [
      {
        type: "live",
        url: "https://mattqdev.github.io/",
        label: "Live Site",
      },
      {
        type: "github",
        url: "https://github.com/mattqdev/mattqdev.github.io",
        label: "Repository",
      },
      {
        type: "live",
        url: "https://mattqdev.github.io/v1/",
        label: "Previous version (v1)",
      },
    ],
    isOpenSource: true,
    features: [
      "Projects with tag-based filtering and live GitHub and Roblox stats",
      "Design section with brand and visual work",
      "Markdown blog at /blog with an RSS feed",
      "Contact form plus email, Discord, X and Roblox links",
      "Fully static: prerendered at build time and hosted on GitHub Pages",
      "Previous versions kept online at /v1 and /v0",
    ],
    technologies: [TAGS.NEXTJS, TAGS.REACT, TAGS.JAVASCRIPT, TAGS.HTML_CSS],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "The site you're looking at right now.",
        metric: "Meta",
      },
      {
        icon: <FaLightbulb />,
        title: "Versions",
        description: "Three designs since 2023, all still online.",
        metric: "v0 → v2",
      },
      {
        icon: <FaLightbulb />,
        title: "Open Source",
        description: "Source available on GitHub.",
        metric: "Public",
      },
    ],
  },
  {
    id: "portfolio-v1",
    title: "MattQ Portfolio v1",
    shortDescription: "The previous version of this site, still online at /v1.",
    description:
      "The second version of my portfolio and the first one built with Next.js and React, before the redesign around my brand manual. It introduced project pages with live GitHub and Roblox stats and the Markdown blog. It's archived in its own repository and still online at /v1.",
    startDate: "Jul 2025",
    endDate: "Sep 2026",
    tags: [TAGS.WEBSITE, TAGS.NEXTJS, TAGS.REACT, TAGS.JAVASCRIPT],
    thumbnail: "preview.webp",
    links: [
      {
        type: "live",
        url: "https://mattqdev.github.io/v1/",
        label: "Live Site",
      },
      {
        type: "github",
        url: "https://github.com/mattqdev/v1",
        label: "Repository",
      },
    ],
    isOpenSource: true,
    features: [
      "Project pages with live GitHub and Roblox stats",
      "Markdown blog with an RSS feed",
      "Static export on GitHub Pages",
    ],
    technologies: [TAGS.NEXTJS, TAGS.REACT, TAGS.JAVASCRIPT, TAGS.HTML_CSS],
    achievements: [],
  },
  {
    id: "paninoteca-da-tommy",
    title: "Paninoteca da Tommy",
    shortDescription:
      "Website for a local food business, designed and built for a client.",
    description:
      "Client work: I designed and built the website of Paninoteca da Tommy, a sandwich shop, from layout to deployment. The site puts ordering and calling one tap away and is built with React, TypeScript and Vite, deployed on Vercel.",
    startDate: "Mar 2026",
    endDate: "Mar 2026",
    tags: [TAGS.WEBSITE, TAGS.REACT, TAGS.TYPESCRIPT, TAGS.UI_UX],
    thumbnail: "preview.webp",
    links: [
      {
        type: "live",
        url: "https://datommy.vercel.app",
        label: "Live Site",
      },
    ],
    isOpenSource: false,
    signature: "client work",
    features: [
      "Design and development from layout to deployment",
      "One-tap ordering and calling",
      "Responsive layout",
    ],
    technologies: [TAGS.REACT, TAGS.TYPESCRIPT, TAGS.TAILWIND_CSS],
    achievements: [],
  },
  {
    id: "anteo",
    title: "Anteo",
    shortDescription:
      "A clothing brand I co-founded: brand identity and a custom Shopify theme.",
    description:
      "Anteo is an e-commerce clothing brand I co-founded. I designed the brand identity and built its custom Shopify theme on Horizon: Liquid sections, Italian and English locales and product galleries.",
    startDate: "2026",
    endDate: "Present",
    tags: [TAGS.WEBSITE, TAGS.UI_UX],
    thumbnail: "preview.webp",
    links: [
      {
        type: "live",
        url: "https://anteo.site",
        label: "Live Site",
      },
    ],
    isOpenSource: false,
    signature: "co-founder",
    features: [
      "Brand identity and packaging",
      "Custom Shopify theme (Liquid) on Horizon",
      "Italian and English locales",
      "Product galleries",
    ],
    technologies: [TAGS.HTML_CSS, TAGS.JAVASCRIPT],
    achievements: [],
  },
  {
    id: "brawl-stars-rng",
    title: "Brawl Stars RNG",
    shortDescription:
      "A RNG game Brawl Stars themed, attracting 65K+ visits with its mechanics.",
    description:
      "Brawl Stars RNG is a chance-based game where players can test their luck to win rare brawlers from the Brawl Stars universe. The game features various RNG mechanics and luck systems.",
    startDate: "Aug 2024",
    endDate: "Jan 2025",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.UI_UX, TAGS.GAME_DESIGN],
    thumbnail: null,
    links: [
      {
        type: "live",
        url: "https://www.roblox.com/games/18960452199",
        label: "Play Game",
      },
    ],
    isOpenSource: false,
    features: [
      "Multiple RNG mechanics",
      "Leaderboards for top players",
      "Obby systems",
      "Potion system",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaUsers />,
        title: "Active Players",
        description: "Peak concurrent players",
        metric: "200+",
      },
      {
        icon: <FaEye />,
        title: "Total Visits",
        description: "Game visits since launch",
        metric: "65,000+",
      },
      {
        icon: <FaUserFriends />,
        title: "Community",
        description: "Community members",
        metric: "87.000+",
      },
    ],
  },
  {
    id: "starbound",
    title: "Starbound",
    shortDescription:
      "Our game for the Novel Game Jam: 1st place, built in a team of two.",
    description:
      "Starbound is the Roblox game PenninoITA81 and I built for the Novel Game Jam of the Italian Roblox community in July 2026. It won 1st place, with a $400 prize for each of us.",
    startDate: "Jul 2026",
    endDate: "Jul 2026",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.GAME_DESIGN],
    thumbnail: null,
    links: [
      {
        type: "play",
        url: "https://www.roblox.com/games/101731590743311/Starbound",
        label: "Play Game",
      },
    ],
    isOpenSource: false,
    features: [
      "Built during the jam in a team of two",
      "Novel Game Jam, Italian Roblox community",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaTrophy />,
        title: "Game Jam",
        description: "Novel Game Jam, Jul 2026",
        metric: "1st place",
      },
      {
        icon: <FaMoneyBill />,
        title: "Prize",
        description: "Each, for both of us",
        metric: "$400",
      },
    ],
  },
  {
    id: "brainrot-hatchers",
    title: "Brainrot Hatchers",
    shortDescription:
      "A hatching simulator on Roblox with 138 brainrots, trading and a rebirth economy.",
    description:
      "Brainrot Hatchers is a hatching simulator from MattQ Studios. Players defeat enemies to earn coins, hatch brainrots from eggs, unlock new areas and rebirth for coin multipliers. Progress is saved with DataStores, and players can trade with each other and climb global leaderboards.",
    startDate: "Aug 2026",
    endDate: "Sep 2026",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.GAME_DESIGN, TAGS.UI_UX],
    thumbnail: "preview.webp",
    links: [
      {
        type: "play",
        url: "https://www.roblox.com/games/98560857828307",
        label: "Play Game",
      },
    ],
    isOpenSource: false,
    features: [
      "19 areas, 22 eggs and 138 brainrots to unlock",
      "Rebirth economy with coin multipliers",
      "Trading between players",
      "DataStore saves and global leaderboards",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [],
  },
  {
    id: "rogames-obbies",
    title: "RoGames X Studio Obbies",
    shortDescription:
      "Two obbies from my RoGames X Studio group, with 39K+ visits combined.",
    description:
      "Two obstacle courses published under RoGames X Studio, the Roblox group I own: Switch Color or Die, where you pick the colour that matches the course, and Italian Brainrot Obby, with morphs and a leaderboard.",
    startDate: "Jun 2024",
    endDate: "May 2025",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.GAME_DESIGN],
    thumbnail: "6068478027-1.webp",
    links: [
      {
        type: "play",
        url: "https://www.roblox.com/games/17717218221",
        label: "Switch Color or Die",
      },
      {
        type: "play",
        url: "https://www.roblox.com/games/95349133980618",
        label: "Italian Brainrot Obby",
      },
    ],
    isOpenSource: false,
    features: [
      "Switch Color or Die: match the colour of the course or fall",
      "Italian Brainrot Obby: morphs, coins and a leaderboard",
      "Playtime gifts and group rewards",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaEye />,
        title: "Total Visits",
        description: "Both games combined",
        metric: "39K+",
      },
    ],
  },
  {
    id: "plugin-ui-assistant",
    title: "Plugin UI Assistant",
    shortDescription:
      "A free plugin for Roblox developers with 1,300+ downloads that simplifies UI creation in Roblox Studio.",
    description:
      "Plugin UI Assistant is a Roblox Studio plugin that helps developers quickly create and manage UI elements. It provides quick tools to accelerate the UI development process.",
    startDate: "Oct 2024",
    endDate: "Present",
    tags: [TAGS.PLUGIN, TAGS.ROBLOX, TAGS.LUAU, TAGS.UI_UX],
    thumbnail: "BannerPlugin.png",
    thumbnailFit: "contain",
    links: [
      {
        type: "devforum",
        url: "https://devforum.roblox.com/t/3193651",
        label: "See more",
      },
      {
        type: "download",
        url: "https://create.roblox.com/store/asset/93833895690336",
        label: "Download Plugin",
      },
    ],
    isOpenSource: false,
    features: [
      "Units Conversions: Can convert easily Offset → Scale for Size and Position",
      "Positioning: Easy positioning with Arrows your frames, image labels and more.",
      "Add Elements: Add constraints and elements with ONE CLICK with UI icons!",
      "UIAspectRatioConstraint",
      "UISize",
      "UITextSize",
      "UICorner",
      "Fast Tools: some really useful and fast actions!",
      "Switch BackgroundTransparency",
      "Switch Visible",
      "Duplicate instances",
      "Slider for changing scale size",
      "And others…",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaDownload />,
        title: "Downloads",
        description: "Plugin installations",
        metric: "1,300+",
      },
    ],
  },
  {
    id: "plugin-heatmap",
    title: "Performance Heatmap",
    shortDescription:
      "A free plugin for Roblox developers with 6,000+ downloads that help you optimize your builds in Roblox Studio.",
    description:
      "Plugin Performance Heatmap is a Roblox Studio plugin that helps developers quickly see which builds make the game laggy and fix them. It provides quick tools to colorize Mesh, Parts, Lights, Models and more.",
    startDate: "Jan 2025",
    endDate: "Present",
    tags: [TAGS.PLUGIN, TAGS.ROBLOX, TAGS.LUAU, TAGS.UI_UX],
    thumbnail: "PerformanceHeatmapbanner.png",
    thumbnailFit: "contain",
    links: [
      {
        type: "devforum",
        url: "https://devforum.roblox.com/t/3416936",
        label: "See more",
      },
      {
        type: "download",
        url: "https://create.roblox.com/store/asset/89564204038561",
        label: "Download Plugin",
      },
      {
        type: "github",
        url: "https://github.com/mattqdev/Performance-Heatmap",
        label: "Repository",
      },
    ],
    isOpenSource: true,
    features: [
      "Heatmap: With just one click see the most problematic buildings with highlights.",
      "Density: Calculates a density estimate (part amount/volume).",
      "Lights: Calculates a light score estimate (Brightness * Range).",
      "Particles: Calculates a particles score estimate (Brightness * Range * AvgLifetime).",
      "Part Amounts: Simply find the models with the highest part quantity.",
      "Stats: Check Roblox engine's performance.",
      "List and Colors: Intuitive colors and list help you to understand how to optimize your game.",
      "And others…",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaDownload />,
        title: "Downloads",
        description: "Plugin installations",
        metric: "6,000+",
      },
      {
        icon: <FaHeart />,
        title: "Likes",
        description: "Total likes on the post.",
        metric: "63+",
      },
    ],
  },
  {
    id: "plugin-sniper",
    title: "Plugin Sniper",
    shortDescription:
      "A plugin for Roblox developers that allows you to find multiple instances with easy syntax-rules.",
    description:
      "Plugin Sniper is a Roblox Studio plugin that helps developers quickly find multiple instances with a fancy UI and a search bar. It provides quick commands and syntax-rules to reconize your instances.",
    startDate: "Jun 2025",
    endDate: "Present",
    tags: [TAGS.PLUGIN, TAGS.ROBLOX, TAGS.LUAU, TAGS.UI_UX],
    thumbnail: "ThumbnailSniper.png",
    links: [
      {
        type: "devforum",
        url: "https://devforum.roblox.com/t/3750120",
        label: "See more",
      },
      {
        type: "download",
        url: "https://create.roblox.com/store/asset/117951076251045",
        label: "Download Plugin",
      },
    ],
    isOpenSource: false,
    features: [
      <>
        I recommend see the{" "}
        <a href="https://devforum.roblox.com/t/3750120">devforum post</a> for
        the full list and how to use them."
      </>,
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaDownload />,
        title: "Downloads",
        description: "Plugin installations",
        metric: "350+",
      },
      {
        icon: <FaTrophy />,
        title: "Best Paid",
        description: "MattQ's Best Paid Plugin.",
        metric: "#1",
      },
    ],
  },
  {
    id: "plugin-assets-previewer",
    title: "Assets Previewer",
    shortDescription:
      "A free Roblox Studio plugin to preview assets and place them with one click.",
    description:
      "Assets Previewer is a Roblox Studio plugin to preview the selected part with built-in camera controls and place assets with a click, with random rotation and flip options.",
    startDate: "Nov 2024",
    endDate: "Present",
    tags: [TAGS.PLUGIN, TAGS.ROBLOX, TAGS.LUAU],
    thumbnail: "preview.webp",
    thumbnailFit: "contain",
    links: [
      {
        type: "devforum",
        url: "https://devforum.roblox.com/t/3260283",
        label: "See more",
      },
      {
        type: "download",
        url: "https://create.roblox.com/store/asset/85798913992851",
        label: "Download Plugin",
      },
    ],
    isOpenSource: false,
    features: [
      "Preview the selected part with camera controls",
      "Click to place, with random rotation and flip",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaDownload />,
        title: "Downloads",
        description: "Plugin installations",
        metric: "290+",
      },
    ],
  },
  {
    id: "plugin-hierarchy-exporter",
    title: "Hierarchy Exporter",
    shortDescription:
      "A Roblox Studio plugin that exports any instance tree as text for AI assistants.",
    description:
      "Hierarchy Exporter scans any selected instance and generates a clean, text-based tree of it, so an AI assistant like Claude gets accurate context about a game's hierarchy instead of a long manual explanation.",
    startDate: "Jun 2026",
    endDate: "Present",
    tags: [TAGS.PLUGIN, TAGS.ROBLOX, TAGS.LUAU, TAGS.UI_UX],
    thumbnail: "preview.webp",
    thumbnailFit: "contain",
    links: [
      {
        type: "devforum",
        url: "https://devforum.roblox.com/t/4680970",
        label: "See more",
      },
      {
        type: "download",
        url: "https://create.roblox.com/store/asset/132603734766163",
        label: "Download Plugin",
      },
    ],
    isOpenSource: false,
    features: [
      "Text tree of any instance, ready to paste into an AI chat",
      "Copy to clipboard or export as JSON",
      "Layout options, live statistics and recent history",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaDownload />,
        title: "Downloads",
        description: "Plugin installations",
        metric: "110+",
      },
    ],
  },
  {
    id: "famous-roblox-users-finder",
    title: "Famous Roblox Users Finder",
    shortDescription:
      "CLI tool to scan a Roblox seller report CSV and find buyers with a large following.",
    description:
      "A fast, production-grade Python CLI tool that takes a Roblox marketplace seller report CSV and identifies notable buyers — those who exceed a configurable follower threshold. Runs concurrent requests, handles rate limiting with exponential backoff, deduplicates user IDs, and outputs two clean CSV reports.",
    startDate: "Mar 2026",
    endDate: "Present",
    tags: [TAGS.PYTHON],
    thumbnail: null,
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/famous-roblox-users-finder",
        label: "Repository",
      },
    ],
    isOpenSource: true,
    features: [
      "Concurrent scanning via configurable thread pool",
      "Exponential backoff with jitter on API failures",
      "Deduplication of user IDs before scanning",
      "Live progress bar via tqdm",
      "Two output reports: famous_users.csv and full_results.csv",
      "Graceful Ctrl+C handling — partial results are saved",
      "Dry-run mode to preview without making requests",
      "Fully configurable via CLI flags",
    ],
    technologies: [TAGS.PYTHON],
    achievements: [
      {
        icon: <FaUsers />,
        title: "Use Case",
        description: "Identify high-follower buyers in your seller report.",
        metric: "Seller Tool",
      },
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "MIT licensed and open to contributions.",
        metric: "Open Source",
      },
    ],
  },
  {
    id: "parolora-clock",
    title: "ParolOra Clock",
    shortDescription:
      "A clock made with Arduino that shows time in words format.",
    description:
      "This Clock (with a ridiculous Italian name that's definitely not AI-generated) (alternative name suggestions welcome) is a special clock that displays the time verbally. It's equipped with a Wi-Fi module, so it always keeps the time accurate and up-to-date, even during a power outage. You can also customize the colors and enter your Wi-Fi credentials from an integrated web portal.",
    startDate: "Jul 2024",
    endDate: "Aug 2024",
    tags: [TAGS.ARDUINO, TAGS.CPP, TAGS.HTML_CSS],
    thumbnail: "thumb.jpg",
    links: [{ type: "github", url: "", label: "Soon open source" }],
    isOpenSource: false,
    features: [
      "Displays time in words format",
      "Wi-Fi connectivity and synchronization with NTP servers",
      "Customizable colors and settings via web portal",
      "3D printed case",
      "It regolate led brightness based on the time of day",
      "Auto test at the start",
      "It can show figures",
    ],
    technologies: [TAGS.ARDUINO_SOFTWARE, TAGS.ESP32, TAGS.CPP, TAGS.HTML_CSS],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "There are only 2 copies of this in the whole world.",
        metric: "2 Exists",
      },
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "The entire case has been printed in 3D.",
        metric: "MIY 3D Printed",
      },
      {
        icon: <FaTrophy />,
        title: "Fun Fact",
        description: "One of the projects I'm most proud of.",
        metric: "#1",
      },
    ],
  },
  {
    id: "backtothefuture-clock",
    title: "Back To The Future Clock",
    shortDescription:
      "A clock made with Arduino inspired by Back To The Future.",
    description:
      "This Clock is a special clock that displays the time in a unique way, inspired by the iconic Back To The Future movie. It has tre rows of displays that shows past time, present time and future time. It's very simple: It has only a RTC module and a 3D printed case, It has been made only because was cool and not because it's useful.",
    startDate: "Mar 2023",
    endDate: "Jun 2023",
    tags: [TAGS.ARDUINO, TAGS.CPP],
    thumbnail: "thumb.jpg",
    links: [{ type: "github", url: "", label: "Soon open source" }],
    isOpenSource: false,
    features: [
      "Displays time in a unique way inspired by Back To The Future",
      "Uses a RTC module for timekeeping",
    ],
    technologies: [TAGS.ARDUINO_SOFTWARE, TAGS.ARDUINO_NANO, TAGS.CPP],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "My first big Arduino project.",
        metric: "#1",
      },
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "The entire case has been printed in 3D.",
        metric: "MIY 3D Printed",
      },
    ],
  },
  {
    id: "cube-generator",
    title: "Cube Generator",
    shortDescription:
      "A procedural cube generator game with customizable parameters and real-time visualization.",
    description:
      "Cube Generator is a game-tool that creates customizable 3D cube structures with various patterns, colors and sizes. It allows users to generate unique cube designs for visualizations or just for stress your pc. This game has been created in just 8 hours (also thumbnails, icons and badges)",
    startDate: "Aug 2024",
    endDate: "8 Hours later",
    tags: [TAGS.ROBLOX, TAGS.LUAU, TAGS.UI_UX, TAGS.GAME_DESIGN, TAGS.PHYSICS],
    thumbnail: "Thumbnail.png",
    links: [
      {
        type: "play",
        url: "https://www.roblox.com/games/18763191813",
        label: "Play Game",
      },
    ],
    isOpenSource: false,
    features: [
      "Procedural cube generation with custom parameters",
      "Real-time 3D generation.",
      "Customize colors, sizes and materials",
    ],
    technologies: [TAGS.ROBLOX_STUDIO, TAGS.LUAU],
    achievements: [
      {
        icon: <FaUsers />,
        title: "Total Users",
        description: "Users who played the game",
        metric: "170+",
      },
      {
        icon: <FaStar />,
        title: "User Satisfaction",
        description: "User rating in Roblox",
        metric: "80%",
      },
    ],
  },
  {
    id: "watermark-applier",
    title: "Watermark Applier",
    shortDescription:
      "A smart Python script that intelligently applies watermarks to images — auto-positioning, auto-color, auto-opacity.",
    description:
      "A Python script that applies watermarks to images with actual intelligence. Instead of blindly pasting a logo, it analyzes the background brightness and complexity to find the calmest area, automatically inverts the watermark color (white/black) based on the background, and adjusts opacity for readability. Supports recursive folder processing and maintains the original directory hierarchy in output.",
    startDate: "2025",
    endDate: "Present",
    tags: [TAGS.PYTHON ?? TAGS.JAVASCRIPT],
    thumbnail: null,
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/watermark-applier",
        label: "Repository",
      },
    ],
    isOpenSource: true,
    features: [
      "Smart positioning — analyzes pixel chaos (std deviation) to find the calmest corner",
      "Fallback logic — if bottom-right is too busy, compares with bottom-center and picks the better one",
      "Auto-inversion — detects light backgrounds and flips watermark to dark for contrast",
      "Dynamic opacity — adjusts transparency based on background brightness",
      "Recursive folder processing — maintains original directory hierarchy in output",
      "Customizable padding, size, inversion threshold, and chaos sensitivity",
    ],
    technologies: [TAGS.PYTHON ?? TAGS.JAVASCRIPT],
    achievements: [
      {
        icon: <FaImage />,
        title: "License",
        description: "Open source under MIT.",
        metric: "MIT",
      },
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description:
          "Uses luminance analysis + std deviation to pick watermark placement.",
        metric: "Smart AI-free",
      },
    ],
  },
  {
    id: "first-portfolio",
    title: "My First Portfolio",
    shortDescription: "My First Portfolio website made in HTML/CSS and JS.",
    description:
      "This is my first portfolio website, made in HTML/CSS and JS. It's a simple website that showcases my skills and projects. It's a good example of my first web development skills.",
    startDate: "Jul 2023",
    endDate: "Aug 2023",
    tags: [TAGS.WEBSITE, TAGS.HTML_CSS, TAGS.JAVASCRIPT],
    thumbnail: "preview.png",
    links: [
      {
        type: "live",
        url: "https://mattqdev.github.io/v0/",
        label: "Live Site",
      },
      {
        type: "github",
        url: "https://github.com/mattqdev/first-portfolio",
        label: "Repository Link",
      },
    ],
    isOpenSource: true,
    features: [
      "Simple and clean design",
      "Responsive layout",
      "Showcases my skills and projects",
    ],
    technologies: [TAGS.HTML_CSS, TAGS.JAVASCRIPT],
    achievements: [
      {
        icon: <FaLightbulb />,
        title: "Fun Fact",
        description: "It got discontinued after:",
        metric: "2 Weeks",
      },
    ],
  },
  {
    id: "langrank",
    title: "LangRank",
    shortDescription: "Website that shows datas about programming languages.",
    description:
      "LangRank is a website that provides data and statistics about various programming languages. It aims to help developers understand the popularity and usage trends of different languages.",
    startDate: "Aug 2025",
    endDate: "Present",
    tags: [
      TAGS.WEBSITE,
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.REACT,
      TAGS.TAILWIND_CSS,
    ],
    thumbnail: null,
    links: [
      {
        type: "github",
        url: "https://github.com/mattqdev/langrank",
        label: "Repository Link",
      },
    ],
    isOpenSource: true,
    features: [
      "Comprehensive data on programming languages",
      "Interactive charts and graphs",
      "Search and filter functionality",
      "User-friendly interface",
      "Responsive design",
      "Open source for community contributions",
    ],
    technologies: [
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.REACT,
      TAGS.TAILWIND_CSS,
    ],
    achievements: [],
  },
];
