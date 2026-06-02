import { useEffect, useState } from "react";
import { motion } from "motion/react";
import "./Navbar.css";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [hover, setHover] = useState(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // hide while scrolling down, reveal while scrolling up — never covers content
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 90) setHidden(false);
        else if (y > last + 6) setHidden(true);
        else if (y < last - 6) setHidden(false);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const current = hover ?? active;

  return (
    <motion.nav
      className="nav"
      aria-label="Primary"
      onMouseLeave={() => setHover(null)}
      style={{ pointerEvents: hidden ? "none" : "auto" }}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? -120 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <ul className="nav__links">
        {LINKS.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className={current === l.id ? "is-active" : ""}
              onMouseEnter={() => setHover(l.id)}
            >
              {l.label}
              {current === l.id && (
                <motion.span
                  layoutId="nav-ind"
                  className="nav__ind"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
