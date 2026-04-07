// app/projects/layout.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SECTIONS } from "@/components/SiteShell";

export default function ProjectsLayout({ children }) {
  return (
    <>
      <Header activeSection="projects" sections={SECTIONS} />
      {children}
      <Footer />
    </>
  );
}
