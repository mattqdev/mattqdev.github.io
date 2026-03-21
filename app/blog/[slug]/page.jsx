// app/blog/[slug]/page.jsx  — Server Component
import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/blog";
import BlogArticle from "@/components/blog/BlogArticle";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { notFound } from "next/navigation";

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
    alternates: {
      // Tell Google the RSS feed exists
      types: {
        "application/rss+xml": "https://mattqdev.github.io/blog/rss.xml",
      },
    },
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

  // Load all posts server-side for related posts calculation
  const allPosts = getAllPosts();

  return (
    <>
      <BlogArticle post={post} />
      <div className="container" style={{ paddingBottom: 80 }}>
        <RelatedPosts currentPost={post} allPosts={allPosts} />
      </div>
    </>
  );
}
