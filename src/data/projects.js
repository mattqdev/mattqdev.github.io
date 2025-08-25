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
  FaLightbulb
} from 'react-icons/fa';

import { TAGS } from './tags';


export const projects = [
  {
    id: "brawl-stars-pet-simulator",
    title: "Brawl Stars Pet Simulator",
    shortDescription: "A Roblox pet simulator game inspired by Brawl Stars with 3.2M+ visits.",
    description: (
      <>
        Brawl Stars Pet Simulator is a Roblox game that combines popular characters from the Brawl Stars universe with pet collection mechanics. Players can collect, earn, and hatch pets inspired by their favorite Brawl Stars characters. The game was banned due to a DMCA takedown (not for Supercell copyright violations&mdash;learn more <a href="https://devforum.roblox.com/t/3591519" target="_blank" rel="noopener noreferrer">here</a>), but it remains a significant project in my portfolio.
      </>
    ),
    startDate: "Jun 2024",
    endDate: "Jan 2025",
    tags: [
      TAGS.ROBLOX,
      TAGS.LUAU,
      TAGS.UI_UX,
      TAGS.GAME_DESIGN
    ],
    thumbnail: null,
    links: [
      { type: "play", url: "https://www.roblox.com/games/17359625840", label: "Play Game" },
    ],
    isOpenSource: false,
    features: [
      "Pet collection system with tons of pets",
      "More that 20 different areas",
      "Collecting system with leaderboards",
      "In-game economy with virtual currency",
      "And much more.",
    ],
    technologies: [
      TAGS.ROBOX_STUDIO,
      TAGS.LUAU
    ],
    achievements: [
      { icon: <FaUsers />, title: "Active Players", description: "Peak concurrent players", metric: "2000+" },
      { icon: <FaEye />, title: "Total Visits", description: "Game visits since launch", metric: "3.2M+" },
      { icon: <FaStar />, title: "User Rating", description: "Average player rating", metric: "82%" },
      { icon: <FaMoneyBill />, title: "Robux Earned", description: "Robux Earned by Gamepasses", metric: "500.000+" },
      { icon: <FaUserFriends />, title: "Community", description: "Community members", metric: "87.000+" },
    ],
  },
  {
    id: "brawl-stars-rng",
    title: "Brawl Stars RNG",
    shortDescription: "A RNG game Brawl Stars themed, attracting 65K+ visits with its mechanics.",
    description: "Brawl Stars RNG is a chance-based game where players can test their luck to win rare brawlers from the Brawl Stars universe. The game features various RNG mechanics and luck systems.",
    startDate: "Aug 2024",
    endDate: "Jan 2025",
    tags: [
      TAGS.ROBLOX,
      TAGS.LUAU,
      TAGS.UI_UX,
      TAGS.GAME_DESIGN
    ],
    thumbnail: null,
    links: [
      { type: "live", url: "https://www.roblox.com/games/18960452199", label: "Play Game" },
    ],
    isOpenSource: false,
    features: [
      "Multiple RNG mechanics",
      "Leaderboards for top players",
      "Obby systems",
      "Potion system",
    ],
    technologies: [
      TAGS.ROBOX_STUDIO,
      TAGS.LUAU
    ],
    achievements: [
      { icon: <FaUsers />, title: "Active Players", description: "Peak concurrent players", metric: "200+" },
      { icon: <FaEye />, title: "Total Visits", description: "Game visits since launch", metric: "65,000+" },
      { icon: <FaUserFriends />, title: "Community", description: "Community members", metric: "87.000+" },
    ],
  },
  {
    id: "plugin-ui-assistant",
    title: "Plugin UI Assistant",
    shortDescription: "A free plugin for Roblox developers with 3.500+ downloads that simplifies UI creation in Roblox Studio.",
    description: "Plugin UI Assistant is a Roblox Studio plugin that helps developers quickly create and manage UI elements. It provides quick tools to accelerate the UI development process.",
    startDate: "Oct 2024",
    endDate: "Present",
    tags: [
      TAGS.PLUGIN,
      TAGS.ROBLOX,
      TAGS.LUAU,
      TAGS.UI_UX
    ],
    thumbnail: null,
    links: [
      { type: "devforum", url: "https://devforum.roblox.com/t/3193651", label: "See more" },
      { type: "download", url: "https://create.roblox.com/store/asset/93833895690336", label: "Download Plugin" }
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
      "And others…"
    ],
    technologies: [
      TAGS.ROBOX_STUDIO,
      TAGS.LUAU
    ],
    achievements: [
      { icon: <FaDownload />, title: "Downloads", description: "Plugin installations", metric: "3.500+" },
    ],
  },
  {
    id: "cube-generator",
    title: "Cube Generator",
    shortDescription: "A procedural cube generator game with customizable parameters and real-time visualization.",
    description: "Cube Generator is a game-tool that creates customizable 3D cube structures with various patterns, colors and sizes. It allows users to generate unique cube designs for visualizations or just for stress your pc. This game has been created in just 8 hours (also thumbnails, icons and badges)",
    startDate: "Aug 2024",
    endDate: "8 Hours later",
    tags: [
      TAGS.ROBLOX,
      TAGS.LUAU,
      TAGS.UI_UX,
      TAGS.GAME_DESIGN,
      TAGS.PHYSICS
    ],
    thumbnail: null,
    links: [
      { type: "play", url: "https://www.roblox.com/games/18763191813", label: "Play Game" },
    ],
    isOpenSource: false,
    features: [
      "Procedural cube generation with custom parameters",
      "Real-time 3D generation.",
      "Customize colors, sizes and materials"
    ],
    technologies: [
      TAGS.ROBOX_STUDIO,
      TAGS.LUAU
    ],
    achievements: [
      {
        icon: <FaUsers />,
        title: "Total Users",
        description: "Users who played the game",
        metric: "170+"
      },
      {
        icon: <FaStar />,
        title: "User Satisfaction",
        description: "User rating in Roblox",
        metric: "80%"
      }
    ]
  },
  {
    id: "plugin-heatmap",
    title: "Performance Heatmap",
    shortDescription: "A free plugin for Roblox developers with 2.000+ downloads that help you optimize your builds in Roblox Studio.",
    description: "Plugin Performance Heatmap is a Roblox Studio plugin that helps developers quickly see which builds make the game laggy and fix them. It provides quick tools to colorize Mesh, Parts, Lights, Models and more.",
    startDate: "Jan 2025",
    endDate: "Present",
    tags: [
      TAGS.PLUGIN,
      TAGS.ROBLOX,
      TAGS.LUAU,
      TAGS.UI_UX
    ],
    thumbnail: null,
    links: [
      { type: "devforum", url: "https://devforum.roblox.com/t/3416936", label: "See more" },
      { type: "download", url: "https://create.roblox.com/store/asset/89564204038561", label: "Download Plugin" }
    ],
    isOpenSource: false,
    features: [
      "Heatmap: With just one click see the most problematic buildings with highlights.",
      "Density: Calculates a density estimate (part amount/volume).",
      "Lights: Calculates a light score estimate (Brightness * Range).",
      "Particles: Calculates a particles score estimate (Brightness * Range * AvgLifetime).",
      "Part Amounts: Simply find the models with the highest part quantity.",
      "Stats: Check Roblox engine’s performance.",
      "List and Colors: Intuitive colors and list help you to understand how to optimize your game.",
      "And others…"
    ],
    technologies: [
      TAGS.ROBOX_STUDIO,
      TAGS.LUAU
    ],
    achievements: [
      { icon: <FaDownload />, title: "Downloads", description: "Plugin installations", metric: "3.000+" },
      { icon: <FaHeart />, title: "Likes", description: "Total likes on the post.", metric: "63+"},
    ],
  },
  {
    id: "plugin-sniper",
    title: "Plugin Sniper",
    shortDescription: "A plugin for Roblox developers that allows you to find multiple instances with easy syntax-rules.",
    description: "Plugin Sniper is a Roblox Studio plugin that helps developers quickly find multiple instances with a fancy UI and a search bar. It provides quick commands and syntax-rules to reconize your instances.",
    startDate: "Jun 2025",
    endDate: "Present",
    tags: [
      TAGS.PLUGIN,
      TAGS.ROBLOX,
      TAGS.LUAU,
      TAGS.UI_UX
    ],
    thumbnail: null,
    links: [
      { type: "devforum", url: "https://devforum.roblox.com/t/3750120", label: "See more" },
      { type: "download", url: "https://create.roblox.com/store/asset/117951076251045", label: "Download Plugin" }
    ],
    isOpenSource: false,
    features: [
      <>
        I recommend see the <a href="https://devforum.roblox.com/t/3750120">devforum post</a> for the full list and how to use them."
      </>
    ],
    technologies: [
      TAGS.ROBOX_STUDIO,
      TAGS.LUAU
    ],
    achievements: [
      { icon: <FaDownload />, title: "Downloads", description: "Plugin installations", metric: "150+" },
      { icon: <FaTrophy />, title: "Best Paid", description: "MattQ's Best Paid Plugin.", metric: "#1"},
    ],
  },
  {
    id: "parolora-clock",
    title: "ParolOra Clock",
    shortDescription: "A clock made with Arduino that shows time in words format.",
    description: "This Clock (with a ridiculous Italian name that's definitely not AI-generated) (alternative name suggestions welcome) is a special clock that displays the time verbally. It's equipped with a Wi-Fi module, so it always keeps the time accurate and up-to-date, even during a power outage. You can also customize the colors and enter your Wi-Fi credentials from an integrated web portal.",
    startDate: "Jul 2024",
    endDate: "Aug 2024",
    tags: [
      TAGS.ARDUINO,
      TAGS.CPP,
      TAGS.HTML_CSS
    ],
    thumbnail: null,
    links: [
      { type: "github", url: "", label: "Soon open source" },
    ],
    isOpenSource: false,
    features: [
      "Displays time in words format",
      "Wi-Fi connectivity and synchronization with NTP servers",
      "Customizable colors and settings via web portal",
      "3D printed case",
      "It regolate led brightness based on the time of day",
      "Auto test at the start",
      "It can show figures"
    ],
    technologies: [
      TAGS.ARDUINO_SOFTWARE,
      TAGS.ESP32,
      TAGS.CPP,
      TAGS.HTML_CSS
    ],
    achievements: [
      { icon: <FaLightbulb />, title: "Fun Fact", description: "There are only 2 copies of this in the whole world.", metric: "2 Exists"},
      { icon: <FaLightbulb />, title: "Fun Fact", description: "The entire case has been printed in 3D.", metric: "MIY 3D Printed" },
      { icon: <FaTrophy />, title: "Fun Fact", description: "One of the projects I'm most proud of.", metric: "#1" },
    ],
  },
  {
    id: "backtothefuture-clock",
    title: "Back To The Future Clock",
    shortDescription: "A clock made with Arduino inspired by Back To The Future.",
    description: "This Clock is a special clock that displays the time in a unique way, inspired by the iconic Back To The Future movie. It has tre rows of displays that shows past time, present time and future time. It's very simple: It has only a RTC module and a 3D printed case, It has been made only because was cool and not because it's useful.",
    startDate: "Mar 2023",
    endDate: "Jun 2023",
    tags: [
      TAGS.ARDUINO,
      TAGS.CPP
    ],
    thumbnail: null,
    links: [
      { type: "github", url: "", label: "Soon open source" },
    ],
    isOpenSource: false,
    features: [
      "Displays time in a unique way inspired by Back To The Future",
      "Uses a RTC module for timekeeping",
    ],
    technologies: [
      TAGS.ARDUINO_SOFTWARE,
      TAGS.ARDUINO_NANO,
      TAGS.CPP
    ],
    achievements: [
      { icon: <FaLightbulb />, title: "Fun Fact", description: "My first big Arduino project.", metric: "#1"},
      { icon: <FaLightbulb />, title: "Fun Fact", description: "The entire case has been printed in 3D.", metric: "MIY 3D Printed" },
    ],
  },
  {
    id: "first-portfolio",
    title: "My First Portfolio",
    shortDescription: "My First Portfolio website made in HTML/CSS and JS.",
    description: "This is my first portfolio website, made in HTML/CSS and JS. It's a simple website that showcases my skills and projects. It's a good example of my first web development skills.",
    startDate: "Jul 2023",
    endDate: "Aug 2023",
    tags: [
      TAGS.WEBSITE,
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT
    ],
    thumbnail: null,
    links: [
      { type: "github", url: "https://github.com/mattqdev/first-portfolio", label: "Repository Link" },
    ],
    isOpenSource: true,
    features: [
      "Simple and clean design",
      "Responsive layout",
      "Showcases my skills and projects",
    ],
    technologies: [
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT
    ],
    achievements: [
      { icon: <FaLightbulb />, title: "Fun Fact", description: "It got discontinued after:", metric: "2 Weeks"},
    ],
  },
  {
    id: "physicshub",
    title: "PhysicsHub",
    shortDescription: "Website that contains free physics simulations for students.",
    description: "PhysicsHub is a website that provides free physics simulations for students. It aims to help students understand complex physics concepts through interactive simulations.",
    startDate: "Jul 2025",
    endDate: "Present",
    tags: [
      TAGS.WEBSITE,
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.PHYSICS,
      TAGS.REACT
    ],
    thumbnail: null,
    links: [
      { type: "github", url: "https://github.com/mattqdev/physicshub", label: "Repository Link" },
    ],
    isOpenSource: true,
    features: [
      "Interactive physics simulations",
      "Educational resources for students",
      "User-friendly interface",
      "Responsive design",
      "Open source for community contributions"
    ],
    technologies: [
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.REACT
    ],
    achievements: [
      { icon: <FaLightbulb />, title: "Fun Fact", description: "It's a work in progress, but it's already functional.", metric: "WIP" },
      { icon: <FaLightbulb />, title: "Fun Fact", description: "It's open source and anyone can contribute.", metric: "Open Source" },
    ],
  },
  {
    id: "langrank",
    title: "LangRank",
    shortDescription: "Website that shows datas about programming languages.",
    description: "LangRank is a website that provides data and statistics about various programming languages. It aims to help developers understand the popularity and usage trends of different languages.",
    startDate: "Aug 2025",
    endDate: "Present",
    tags: [
      TAGS.WEBSITE,
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.REACT,
      TAGS.TAILWIND_CSS
    ],
    thumbnail: null,
    links: [
      { type: "github", url: "https://github.com/mattqdev/langrank", label: "Repository Link" },
    ],
    isOpenSource: true,
    features: [
      "Comprehensive data on programming languages",
      "Interactive charts and graphs",
      "Search and filter functionality",
      "User-friendly interface",
      "Responsive design",
      "Open source for community contributions"
    ],
    technologies: [
      TAGS.HTML_CSS,
      TAGS.JAVASCRIPT,
      TAGS.REACT,
      TAGS.TAILWIND_CSS
    ],
    achievements: [
      
    ],
  },
];