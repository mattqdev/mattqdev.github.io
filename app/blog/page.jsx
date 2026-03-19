// app/blog/page.jsx  — Server Component
import { getAllPosts } from "@/lib/blog";
import BlogIndex from "@/components/blog/BlogIndex";

export const metadata = {
  title: "Blog — MattQ",
  description:
    "Articles on Roblox development, web dev, game design, Arduino, and dev tools by MattQ.",
  openGraph: {
    title: "Blog — MattQ",
    description:
      "Articles on Roblox development, web dev, game design, Arduino, and dev tools.",
    url: "https://mattqdev.github.io/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
