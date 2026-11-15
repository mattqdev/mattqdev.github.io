import { pageMeta } from "@/lib/seo";
// app/blog/[slug]/page.jsx  — Server Component
import { getAllSlugs, getPostBySlug, getAllPosts } from "@/lib/blog";
import BlogArticle from "@/components/blog/BlogArticle";
import ArticleRenderer from "@/components/blog/ArticleRenderer";
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
    ...pageMeta({
      title: post.title,
      description: post.description,
      path: `/blog/${slug}`,
      image: `blog-${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["MattQ"],
      tags: post.tags,
    }),
    title: `${post.title} — MattQ`,
    alternates: {
      canonical: `/blog/${slug}`,
      types: { "application/rss+xml": "/blog/rss.xml" },
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
      <BlogArticle post={post}>
        {/* Rendered on the server; BlogArticle is a client component */}
        <ArticleRenderer content={post.content} />
      </BlogArticle>
      <div className="container related-wrap">
        <RelatedPosts currentPost={post} allPosts={allPosts} />
      </div>
    </>
  );
}
