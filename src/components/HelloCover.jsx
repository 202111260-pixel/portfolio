import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import TextPressure from "./TextPressure.jsx";
import "./HelloCover.css";

/*
  ================= EDIT HERE =================
  - header:   three small uppercase labels (left / center / right)
  - photo:    replace `photo` URL with your portrait (shown black & white)
  - notes:    short handwritten annotations around the photo
  - footer:   website (left) + social handle (right)
  ============================================
*/
const content = {
  header: ["GCET · OMAN", "BSC (HONS) BUSINESS COMPUTING", "AWARDED BY UWE BRISTOL"], // EDIT: 3 top labels
  wordTop: "HELLO", // EDIT: big word above the photo
  wordBottom: "WORLD", // EDIT: big word below the photo
  photo: "/me.jpeg", // EDIT: your photo
  photoAlt: "Mohammed Al Hajri",
  footerLeft: "MOHAMMED-ALHAJRI.DEV", // EDIT: your website
  footerRight: "@MOHAMMEDALHAJRI", // EDIT: your handle
};

// EDIT: handwritten notes. `pos` places each note around the photo.
const notes = [
  {
    text: "I build scalable platforms and AI-powered solutions",
    pos: "note--tl",
    rot: -3,
  },
  { text: "You can call me Mohammed =)", pos: "note--ml", rot: -2 },
  {
    text: "Full-Stack Developer and AI Engineer",
    pos: "note--br",
    rot: 2,
  },
  {
    text: "3rd place among 27 teams, national hackathon",
    pos: "note--bb",
    rot: -1,
  },
];

const EASE = [0.16, 1, 0.3, 1];
const TP = {
  flex: true,
  width: true,
  weight: true,
  italic: true,
  alpha: false,
  stroke: false,
  textColor: "#0a0a0a",
  minFontSize: 40,
  maxFontSize: 200,
};

export default function HelloCover() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // leaving-the-hero parallax
  const yTop = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yBottom = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const sPhoto = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section className="cover" id="home" aria-label="Introduction" ref={ref}>
      <div className="cover__inner">
        {/* top meta row — real institution logos */}
        <header className="cover__meta">
          <motion.div
            className="cover__brand"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
          >
            <img
              className="cover__logo cover__logo--gcet"
              src="/gcet-logo.png"
              alt="Global College of Engineering and Technology (GCET), Oman"
            />
          </motion.div>

          <motion.span
            className="cover__degree"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.13, ease: EASE }}
          >
            BSc (Hons) Business Computing
          </motion.span>

          <motion.div
            className="cover__brand cover__brand--right"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.21, ease: EASE }}
          >
            <span className="cover__awarded">Degree awarded by</span>
            <img
              className="cover__logo cover__logo--uwe"
              src="/uwe-logo.png"
              alt="University of the West of England, Bristol"
            />
          </motion.div>
        </header>

        {/* the editorial stack: giant words + overlapping photo */}
        <div className="cover__stage">
          <motion.div
            className="cover__word cover__word--top"
            style={reduce ? undefined : { y: yTop }}
          >
            <motion.div className="cover__wordIn" {...rise(0.2)}>
              <TextPressure text={content.wordTop} {...TP} />
            </motion.div>
          </motion.div>

          <motion.div
            className="cover__photoWrap"
            style={reduce ? undefined : { y: yPhoto, scale: sPhoto }}
          >
            <motion.figure
              className="cover__photo"
              initial={reduce ? false : { opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
            >
              <motion.span
                className="cover__clip"
                aria-hidden="true"
                initial={reduce ? false : { opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.7 }}
              />
              {/* TODO: replace with your photo (portrait, ~680x860, shown black & white) */}
              <img src={content.photo} alt={content.photoAlt} loading="lazy" />

              {notes.map((n, i) => (
                <motion.p
                  key={i}
                  className={`note ${n.pos}`}
                  initial={reduce ? false : { opacity: 0, scale: 0.7, rotate: n.rot }}
                  animate={{ opacity: 1, scale: 1, rotate: n.rot }}
                  transition={{ duration: 0.5, delay: 0.85 + i * 0.12, ease: EASE }}
                >
                  {n.text}
                </motion.p>
              ))}
            </motion.figure>
          </motion.div>

          <motion.div
            className="cover__word cover__word--bottom"
            style={reduce ? undefined : { y: yBottom }}
          >
            <motion.div className="cover__wordIn" {...rise(0.45)}>
              <TextPressure text={content.wordBottom} {...TP} />
            </motion.div>
          </motion.div>
        </div>

        {/* footer row */}
        <motion.footer
          className="cover__footer"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span>{content.footerLeft}</span>
          <span>{content.footerRight}</span>
        </motion.footer>

        {/* scroll cue */}
        <motion.div
          className="cover__cue"
          aria-hidden="true"
          style={reduce ? undefined : { opacity: cueOpacity }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <span>SCROLL</span>
          <motion.span
            className="cover__cueLine"
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
