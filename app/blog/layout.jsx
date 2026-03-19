// app/blog/layout.jsx
// Wraps /blog and /blog/[slug] with the shared Header + Footer.
// This is a Server Component by default — BlogLayoutClient owns
// the scroll state needed by Header.
import BlogLayoutClient from "@/components/blog/BlogLayoutClient";

export default function BlogLayout({ children }) {
  return <BlogLayoutClient>{children}</BlogLayoutClient>;
}
