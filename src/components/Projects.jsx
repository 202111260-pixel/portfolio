import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "motion/react";
import "./Projects.css";

/*
  ================= EDIT HERE =================
  Each project:
    - index, title, level, awards[], blurb, stats[], note
    - images : EXACTLY 3 photos -> { src, alt }
               drop files in /public and use "/your-file.jpg"
  Remove a project by deleting its object.
  ============================================
*/
const projects = [
  {
    index: "01",
    title: "CSR Sustainability Platform",
    level: "Graduation Project · Full-Stack + AI",
    awards: ["Top Project in Specialization", "Best Poster Award"],
    blurb:
      "My graduation project: a CSR platform built on the UN SDGs, tracking 2M+ OMR across all 11 governorates with AI agents, analytics, an early-warning system and interactive maps. Automation raised efficiency by 40%.",
    stats: ["UN SDGs", "2M+ OMR", "+40% efficiency"],
    tech: ["TypeScript", "React", "Node.js", "Python", "LLMs"],
    note: "live interactive maps",
    images: [
      { src: "/esg-dash.jpeg", alt: "CSR command-center dashboard", pos: "50% 0%" },
      { src: "/esg-categories.png", alt: "Sustainability analytics", pos: "50% 50%" },
      { src: "/esg-impact.png", alt: "Impact overview & live map", pos: "50% 18%" },
    ],
  },
  {
    index: "02",
    title: "Legal AI Advisor",
    level: "AI System · Omani Law",
    awards: [],
    blurb:
      "An AI system that analyses legal cases against Omani regulations, integrating LLM models to surface intelligent, context-aware legal insights for faster decisions.",
    stats: ["Omani regulations", "LLM-powered", "Case analysis"],
    tech: ["TypeScript", "React", "Node.js", "LLMs"],
    note: "real generated case brief",
    images: [
      { src: "/legal-brief-1.jpeg", alt: "Investigation brief — header", pos: "50% 0%" },
      { src: "/legal-brief-3.png", alt: "Case evidence board", pos: "50% 50%" },
      { src: "/legal-brief-1.jpeg", alt: "Investigation brief — findings", pos: "50% 58%" },
    ],
  },
  {
    index: "03",
    title: "Madar — Financial Identity",
    level: "Hackathon · Arab World Level",
    awards: [],
    blurb:
      "Integrated 30+ freelance platforms into a single pipeline that generates unified financial-identity profiles for freelancers across the Arab world.",
    stats: ["30+ platforms", "Unified identity", "Arab World"],
    tech: ["TypeScript", "React", "Node.js"],
    note: "one unified profile",
    images: [
      { src: "/madar-platforms.png", alt: "Connected freelance platforms", pos: "50% 0%" },
      { src: "/madar-freelance.jpeg", alt: "Freelance people illustration", pos: "50% 50%" },
    ],
  },
];

const EASE = [0.16, 1, 0.3, 1];

/* highlight numbers / metrics inside the blurb so they pop */
function renderBlurb(text) {
  const re = /(\d[\d,]*(?:M|K)?\+?(?:\s?(?:%|OMR|governorates|platforms|wadis|wadi paths))?)/gi;
  const out = [];
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span className="stat" key={k++}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function ProjectCard({ project, i, total }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress: through } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: pinned } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(pinned, [0, 1], [1, 0.88]);
  const opacity = useTransform(pinned, [0, 1], [1, 0.25]);
  const blur = useTransform(pinned, [0, 1], ["blur(0px)", "blur(5px)"]);
  const yA = useTransform(through, [0, 1], ["18%", "-18%"]);
  const yB = useTransform(through, [0, 1], ["-22%", "22%"]);
  const yC = useTransform(through, [0, 1], ["10%", "-10%"]);
  const drift = [yA, yB, yC];

  const reveal = {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.55 },
  };

  return (
    <section className="card" id={`work-${i}`} ref={ref} style={{ zIndex: i + 1 }}>
      <motion.div
        className="card__inner"
        style={reduce ? undefined : { scale, opacity, filter: blur }}
      >
        <span className="card__bigindex" aria-hidden="true">
          {project.index}
        </span>

        <div className="card__text">
          <motion.p className="card__eyebrow" {...reveal} transition={{ duration: 0.6, ease: EASE }}>
            {project.index} / {String(total).padStart(2, "0")} — {project.level}
          </motion.p>
          <motion.h3 className="card__title" {...reveal} transition={{ duration: 0.7, delay: 0.05, ease: EASE }}>
            {project.title}
          </motion.h3>

          {project.awards.length > 0 && (
            <motion.ul className="card__awards" {...reveal} transition={{ duration: 0.6, delay: 0.1, ease: EASE }}>
              {project.awards.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </motion.ul>
          )}

          <motion.p className="card__blurb" {...reveal} transition={{ duration: 0.6, delay: 0.15, ease: EASE }}>
            {renderBlurb(project.blurb)}
          </motion.p>

          <motion.ul className="card__stats" {...reveal} transition={{ duration: 0.6, delay: 0.2, ease: EASE }}>
            {project.stats.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </motion.ul>

          {project.tech?.length > 0 && (
            <motion.div className="card__tech" {...reveal} transition={{ duration: 0.6, delay: 0.26, ease: EASE }}>
              <span className="card__techLabel">Built with</span>
              <ul>
                {project.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {project.images.length === 1 ? (
          /* single wide hero image */
          <div className="card__media card__media--solo">
            <motion.figure
              className={`soloshot ${project.images[0].fit === "contain" ? "soloshot--float" : ""}`}
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <img
                src={project.images[0].src}
                alt={project.images[0].alt}
                loading="lazy"
                draggable="false"
                style={{
                  ...(project.images[0].pos ? { objectPosition: project.images[0].pos } : {}),
                  ...(project.images[0].fit ? { objectFit: project.images[0].fit } : {}),
                }}
                onError={(e) => {
                  e.currentTarget.style.opacity = "0";
                }}
              />
            </motion.figure>
            <span className="card__note">{project.note}</span>
          </div>
        ) : (
          /* overlapping scattered cluster */
          <div className="card__media">
            {project.images.map((img, idx) => (
              <motion.figure
                key={idx}
                className={`shot shot--${["a", "b", "c"][idx]}`}
                style={reduce ? undefined : { y: drift[idx] }}
                initial={reduce ? false : { opacity: 0, scale: 1.08 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.9, delay: idx * 0.08, ease: EASE }}
              >
                {/* TODO: replace src with your own project image */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  draggable="false"
                  style={img.pos ? { objectPosition: img.pos } : undefined}
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                />
              </motion.figure>
            ))}
            <span className="card__note">{project.note}</span>
          </div>
        )}
      </motion.div>
    </section>
  );
}

function WorkIntro() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section className="work__intro" ref={ref}>
      <motion.div className="work__introInner" style={reduce ? undefined : { scale, opacity }}>
        <span className="work__kicker">(04) — SELECTED WORK</span>
        <h2 className="work__title">
          SELECTED<br />WORK
        </h2>
        <span className="work__count">
          {String(projects.length).padStart(2, "0")} PROJECTS · 2024—2026 · SCROLL TO EXPLORE
        </span>
      </motion.div>
    </section>
  );
}

export default function Projects() {
  const workRef = useRef(null);
  const total = projects.length;
  const { scrollYProgress } = useScroll({
    target: workRef,
    offset: ["start start", "end end"],
  });
  const [idx, setIdx] = useState(1);
  const [inView, setInView] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(total, Math.max(1, Math.ceil(v * total + 0.0001)));
    setIdx((prev) => (prev === i ? prev : i));
  });

  useEffect(() => {
    if (!workRef.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
      rootMargin: "-1px 0px -1px 0px",
    });
    io.observe(workRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="work" id="work" ref={workRef}>
      <WorkIntro />
      <div className="work__stack">
        {projects.map((p, i) => (
          <ProjectCard key={p.index} project={p} i={i} total={total} />
        ))}
      </div>

      {/* side navigation rail with progress */}
      <nav className={`work__rail ${inView ? "is-in" : ""}`} aria-label="Projects">
        <span className="work__railLine">
          <motion.span className="work__railFill" style={{ scaleY: scrollYProgress }} />
        </span>
        <ul>
          {projects.map((p, i) => (
            <li key={p.index}>
              <a href={`#work-${i}`} className={idx - 1 === i ? "is-active" : ""}>
                <span className="work__railTitle">{p.title.split(" — ")[0]}</span>
                <span className="work__railNum">{p.index}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
