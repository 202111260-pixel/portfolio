import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Navbar from "./components/Navbar.jsx";
import HelloCover from "./components/HelloCover.jsx";
import FounderMission from "./components/FounderMission.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import ThankYou from "./components/ThankYou.jsx";

/*
  Editorial portfolio, five self-contained sections:
    1. HelloCover     — hero / intro
    2. FounderMission — about (desk collage)
    3. Skills         — technical stack (orbital)
    4. Projects       — selected work (sticky stack)
    5. ThankYou       — contact (form)
  Lenis adds buttery smooth-scroll site-wide.
*/
export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // smooth in-page anchor navigation (navbar links)
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        lenis.scrollTo(href, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HelloCover />
        <FounderMission />
        <Skills />
        <Projects />
        <ThankYou />
      </main>
    </>
  );
}
