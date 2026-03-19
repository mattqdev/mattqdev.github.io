// app/blog/[slug]/page.jsx  — Server Component
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import BlogArticle from "@/components/blog/BlogArticle";
import { notFound } from "next/navigation";

// Pre-render all posts at build time (required for static export)
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — MattQ`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://mattqdev.github.io/blog/${slug}`,
      ...(post.cover
        ? { images: [`https://mattqdev.github.io/blog/covers/${post.cover}`] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
