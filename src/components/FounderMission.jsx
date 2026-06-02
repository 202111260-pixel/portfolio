import { motion, useReducedMotion } from "motion/react";
import "./FounderMission.css";

/*
  ================= EDIT HERE =================
  About — a "Behind the build" desk collage: a cream dossier with
  hand-written answers, a paper-clipped B&W photo, and a boarding
  pass. Edit the strings below; swap the photo (/me.jpeg).
  ============================================
*/
const about = {
  title: "BEHIND MOHAMMED",
  name: "Mohammed Al Hajri",
  focus: "Full-Stack engineering & AI / LLMs",
  story:
    "Business Computing graduate from GCET, Oman (2021–2026). My graduation project — a CSR platform built on the UN SDGs — was the top project in my specialization.",
  photo: "/me.jpeg",
  pass: {
    name: "AL HAJRI / MOHAMMED",
    role: "FULL-STACK · AI",
    from: "MUSCAT, OMAN",
    to: "IMPACT",
    seat: "BUILD",
    flight: "MAH 2026",
    note: "PYHACK ’25 · 3RD OF 27 · GCET",
  },
};

const EASE = [0.16, 1, 0.3, 1];

function Paperclip() {
  return (
    <svg className="clip" viewBox="0 0 44 104" fill="none" aria-hidden="true">
      <path
        d="M14 30 V74 a8.5 8.5 0 0 0 17 0 V26 a5.5 5.5 0 0 0 -11 0 V70"
        stroke="url(#clipg)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="clipg" x1="0" y1="0" x2="44" y2="0">
          <stop offset="0" stopColor="#c8ccd2" />
          <stop offset="0.5" stopColor="#9aa0a6" />
          <stop offset="1" stopColor="#d7dade" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FounderMission() {
  const reduce = useReducedMotion();

  const drop = (rot, delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: -54, rotate: 0 },
    whileInView: { opacity: 1, y: 0, rotate: rot },
    whileHover: reduce ? undefined : { y: -6, rotate: rot * 0.4, scale: 1.015 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.85, delay, ease: EASE },
  });

  return (
    <section className="about" id="about" aria-label="About Mohammed">
      <div className="about__head">
        <span>(02) — ABOUT</span>
        <span>THE PERSON BEHIND THE CODE</span>
      </div>

      <div className="about__stage">
        {/* accent card peeking behind the photo */}
        <motion.div className="accent" {...drop(6, 0.15)} aria-hidden="true">
          <span>GCET</span>
          <span>’26</span>
        </motion.div>

        {/* dossier */}
        <motion.article className="doc" {...drop(-1.6, 0)}>
          <h3 className="doc__title">{about.title}</h3>

          <div className="doc__field">
            <span className="doc__label">NAME</span>
            <span className="doc__hand">{about.name}</span>
          </div>

          <div className="doc__field">
            <span className="doc__label">FOCUS</span>
            <span className="doc__hand">{about.focus}</span>
          </div>

          <div className="doc__field">
            <span className="doc__label">TELL US ABOUT YOUR STORY</span>
            <p className="doc__hand doc__story">{about.story}</p>
          </div>

          <span className="doc__ref" aria-hidden="true">REF · MAH-02 / 2026</span>
        </motion.article>

        {/* paper-clipped portrait */}
        <motion.figure className="photo" {...drop(2.6, 0.2)}>
          {/* TODO: replace with your photo */}
          <img src={about.photo} alt="Mohammed Al Hajri" loading="lazy" draggable="false" />
          <span className="photo__clip" aria-hidden="true">
            <Paperclip />
          </span>
        </motion.figure>

        {/* boarding pass */}
        <motion.div className="pass" {...drop(-3.2, 0.3)} aria-hidden="true">
          <div className="pass__stub">
            <span className="pass__logo">✦ BUILDPASS</span>
            <span className="pass__flight">{about.pass.flight}</span>
          </div>
          <div className="pass__body">
            <div className="pass__name">
              <span className="pass__k">PASSENGER</span>
              <span className="pass__v">{about.pass.name}</span>
            </div>
            <div className="pass__grid">
              <div>
                <span className="pass__k">FROM</span>
                <span className="pass__v">{about.pass.from}</span>
              </div>
              <div>
                <span className="pass__k">TO</span>
                <span className="pass__v">{about.pass.to}</span>
              </div>
              <div>
                <span className="pass__k">ROLE</span>
                <span className="pass__v">{about.pass.role}</span>
              </div>
              <div>
                <span className="pass__k">SEAT</span>
                <span className="pass__v">{about.pass.seat}</span>
              </div>
            </div>
            <div className="pass__foot">
              <span className="pass__barcode" />
              <span className="pass__note">{about.pass.note}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
