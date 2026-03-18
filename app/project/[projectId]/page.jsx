// app/project/[projectId]/page.jsx
import { projects } from "@/data/projects";
import ProjectDetails from "@/components/ProjectDetails";

// Tells Next.js all valid projectId values at build time
// so it can pre-render every project page as static HTML.
export function generateStaticParams() {
  return projects.map((p) => ({ projectId: p.id }));
}

// Next.js 15+: params is a Promise — must be awaited
export async function generateMetadata({ params }) {
  const { projectId } = await params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — MattQ`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }) {
  const { projectId } = await params;
  return <ProjectDetails projectId={projectId} />;
}
