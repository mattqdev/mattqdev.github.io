// app/page.jsx
// This is a Server Component by default in App Router.
// All child components that use browser APIs / hooks are marked 'use client'.
import SiteShell from "@/components/SiteShell";

export default function HomePage() {
  return <SiteShell />;
}
