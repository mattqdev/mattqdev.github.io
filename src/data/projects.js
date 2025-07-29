// src/data/projects.js
import { 
  FaGamepad, FaLaptopCode, FaPalette, FaUsers, 
  FaDownload, FaStar, FaEye, FaUserFriends, FaTrophy, FaCode,
  FaMoneyBill,
  FaTruckMoving
} from 'react-icons/fa';


import T_BSPS from '../assets/media/projects/brawl-stars-pet-simulator/Thumbnail3.png';
import T_BSR from '../assets/media/projects/brawl-stars-rng/Icon.png';
import T_CG  from '../assets/media/projects/cube-generator/Thumbnail.png';


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
      { name: "Roblox", icon: <FaGamepad />, color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, color: "#4d79ff" },
      { name: "UI/UX", icon: <FaPalette />, color: "#c19700ff" },
      { name: "Game Design", icon: <FaPalette />, color: "#6a0dad" },
    ],
    thumbnail: T_BSPS,
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
    challenges: [
      // nessuna challenge per questo progetto
    ],
    technologies: [
      { name: "Roblox Studio", icon: <FaGamepad />, purpose: "Game development platform", color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, purpose: "Game scripting language", color: "#4d79ff" },
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
      { name: "Roblox", icon: <FaGamepad />, color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, color: "#4d79ff" },
      { name: "UI/UX", icon: <FaPalette />, color: "#c19700ff" },
      { name: "Game Design", icon: <FaPalette />, color: "#6a0dad" },
    ],
    thumbnail: T_BSR,
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
    challenges: [
      // nessuna challenge per questo progetto
    ],
    technologies: [
      { name: "Roblox Studio", icon: <FaGamepad />, purpose: "Game development platform", color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, purpose: "Game scripting language", color: "#4d79ff" },
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
      { name: "Plugin", icon: <FaLaptopCode />, color: "#4d79ff" },
      { name: "Roblox", icon: <FaGamepad />, color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, color: "#4d79ff" },
      { name: "UI/UX", icon: <FaPalette />, color: "#ff6b6b" },
    ],
    thumbnail: undefined,
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
    challenges: [
      // nessuna challenge per questo progetto
    ],
    technologies: [
      { name: "Roblox Studio", icon: <FaGamepad />, purpose: "Plugin development platform", color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, purpose: "Scripting language", color: "#4d79ff" },
    ],
    achievements: [
      { icon: <FaDownload />, title: "Downloads", description: "Plugin installations", metric: "3.500+" },
      //{ icon: <FaStar />, title: "Rating", description: "Average user rating", metric: "4.9/5"},
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
      { name: "Roblox", icon: <FaGamepad />, color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, color: "#4d79ff" },
      { name: "UI/UX", icon: <FaPalette />, color: "#c19700ff" },
      { name: "Game Design", icon: <FaPalette />, color: "#6a0dad" },
      { name: "Physics", icon: <FaTruckMoving />, color: "#0d68adff" },
    ],
    thumbnail: T_CG,
    links: [
      { type: "play", url: "https://www.roblox.com/games/18763191813", label: "Play Game" },
    ],
    isOpenSource: false,
    features: [
      "Procedural cube generation with custom parameters",
      "Real-time 3D generation.",
      "Customize colors, sizes and materials"
    ],
    challenges: [
      // nessuna challenge per questo progetto
    ],
    technologies: [
      { name: "Roblox Studio", icon: <FaGamepad />, purpose: "Game development platform", color: "#ff4d5a" },
      { name: "Luau", icon: <FaLaptopCode />, purpose: "Game scripting language", color: "#4d79ff" },
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
  }
];