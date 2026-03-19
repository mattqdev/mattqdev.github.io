// components/blog/ArticleRenderer.jsx
// SERVER COMPONENT — no 'use client'. MDXRemote from next-mdx-remote/rsc
// must run on the server. Client interactivity lives in BlogArticle.jsx.
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "github-dark-dimmed",
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
    ],
  },
};

// Custom MDX component map — all styled to match globals.css
const components = {
  h1: (p) => <h1 className="article-h1" {...p} />,
  h2: (p) => <h2 className="article-h2" {...p} />,
  h3: (p) => <h3 className="article-h3" {...p} />,
  h4: (p) => <h4 className="article-h4" {...p} />,
  p: (p) => <p className="article-p" {...p} />,
  a: ({ href, children, ...p }) => (
    <a
      href={href}
      className="article-a"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...p}
    >
      {children}
    </a>
  ),
  ul: (p) => <ul className="article-ul" {...p} />,
  ol: (p) => <ol className="article-ol" {...p} />,
  li: (p) => <li className="article-li" {...p} />,
  blockquote: (p) => <blockquote className="article-blockquote" {...p} />,
  hr: () => <hr className="article-hr" />,

  // Inline code — rehype-pretty-code handles fenced blocks via <pre>
  code: (p) => <code className="article-code-inline" {...p} />,

  // rehype-pretty-code wraps highlighted blocks in <figure data-rehype-pretty-code-figure>
  // We add the article-pre class via CSS selector instead of overriding here.
  pre: (p) => <pre className="article-pre" {...p} />,

  // Tables — GFM tables are now parsed by remark-gfm
  table: (p) => (
    <div className="article-table-wrapper">
      <table className="article-table" {...p} />
    </div>
  ),
  thead: (p) => <thead className="article-thead" {...p} />,
  tbody: (p) => <tbody {...p} />,
  tr: (p) => <tr className="article-tr" {...p} />,
  th: (p) => <th className="article-th" {...p} />,
  td: (p) => <td className="article-td" {...p} />,

  // Images with caption
  img: ({ src, alt, ...p }) => (
    <figure className="article-figure">
      <img src={src} alt={alt} className="article-img" {...p} />
      {alt && <figcaption className="article-figcaption">{alt}</figcaption>}
    </figure>
  ),

  // Custom JSX components usable inside .md files
  Callout: ({ type = "info", title, children }) => (
    <div className={`article-callout article-callout--${type}`}>
      <span className="article-callout-icon" aria-hidden="true">
        {type === "warning"
          ? "⚠️"
          : type === "tip"
            ? "💡"
            : type === "danger"
              ? "🚨"
              : "ℹ️"}
      </span>
      <div className="article-callout-body">
        {title && <strong className="article-callout-title">{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  ),

  // Step component: <Step n={1}>Do this</Step>
  Step: ({ n, children }) => (
    <div className="article-step">
      <span className="article-step-n">{n}</span>
      <div className="article-step-body">{children}</div>
    </div>
  ),
};

export default function ArticleRenderer({ content }) {
  return (
    <MDXRemote source={content} components={components} options={mdxOptions} />
  );
}
