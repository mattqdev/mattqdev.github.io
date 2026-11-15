// app/design/layout.jsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SECTIONS } from "@/components/SiteShell";

export default function DesignLayout({ children }) {
  return (
    <>
      <Header activeSection="design" sections={SECTIONS} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
