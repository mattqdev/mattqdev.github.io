// app/project/[projectId]/page.jsx
// Server Component — runs at build time for static export.
// Reads the media folder here (Node fs) and passes results as props
// to the client component, which can't use fs.
import { projects } from "@/data/projects";
import { getProjectMedia } from "@/lib/getProjectMedia";
import ProjectDetails from "@/components/ProjectDetails";

export function generateStaticParams() {
  return projects.map((p) => ({ projectId: p.id }));
}

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

  // Scan public/media/projects/[projectId]/ at build time
  const { images, videos } = getProjectMedia(projectId);

  return (
    <ProjectDetails projectId={projectId} images={images} videos={videos} />
  );
}
