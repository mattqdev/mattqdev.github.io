// app/projects/layout.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProjectsLayout({ children }) {
  return (
    <>
      <Header activeSection="projects" />
      {children}
      <Footer />
    </>
  );
}
