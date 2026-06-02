import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./SiteFX.css";

/* ---- custom cursor: a lerp-following ring + dot, grows over links ---- */
function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    const over = (e) => {
      const t = e.target.closest("a, button, .magnetic, .arch__node, [data-cursor]");
      ring.current?.classList.toggle("is-active", !!t);
    };
    const loop = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="fx-cursor-ring" aria-hidden="true" />
      <div ref={dot} className="fx-cursor-dot" aria-hidden="true" />
    </>
  );
}

/* ---- page-load intro: a brief monogram curtain that lifts ---- */
function Intro() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fx-intro"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="fx-intro__mark"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="fx-intro__mono">MA</span>
            <span className="fx-intro__name">MOHAMMED AL HAJRI</span>
          </motion.div>
          <motion.div
            className="fx-intro__bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SiteFX() {
  return (
    <>
      <Intro />
      <Cursor />
      {/* cinematic film grain */}
      <div className="fx-grain" aria-hidden="true" />
    </>
  );
}
