// lib/getProjectMedia.js
// Runs only on the server (Node.js) — used in the page.jsx server component
// to scan public/media/projects/[id]/ and pass the file list as a prop.
import fs from "fs";
import path from "path";

const MEDIA_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg|mov|mp4|webm)$/i;
const VIDEO_EXTENSIONS = /\.(mov|mp4|webm)$/i;

/**
 * Returns { images: string[], videos: string[] }
 * where each string is an absolute URL path like /media/projects/foo/bar.png
 */
export function getProjectMedia(projectId) {
  const dir = path.join(
    process.cwd(),
    "public",
    "media",
    "projects",
    projectId
  );

  if (!fs.existsSync(dir)) return { images: [], videos: [] };

  const files = fs
    .readdirSync(dir)
    .filter((f) => MEDIA_EXTENSIONS.test(f))
    .sort();

  const base = `/media/projects/${projectId}`;
  return {
    images: files
      .filter((f) => !VIDEO_EXTENSIONS.test(f))
      .map((f) => `${base}/${f}`),
    videos: files
      .filter((f) => VIDEO_EXTENSIONS.test(f))
      .map((f) => `${base}/${f}`),
  };
}
