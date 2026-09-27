"use client";
// components/Providers.jsx
// App-wide client providers. MotionConfig makes every framer-motion
// animation honor the OS "reduce motion" setting.
import { MotionConfig } from "framer-motion";

export default function Providers({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
