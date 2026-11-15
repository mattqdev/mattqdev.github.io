import { pageMeta } from "@/lib/seo";
// app/blog/page.jsx  — Server Component
import { getAllPosts } from "@/lib/blog";
import BlogIndex from "@/components/blog/BlogIndex";

export const metadata = {
  ...pageMeta({
    title: "Blog — MattQ",
    description:
      "Articles on Roblox development, web dev, game design, Arduino, and dev tools by MattQ.",
    path: "/blog",
    image: "blog",
  }),
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
