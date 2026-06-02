import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import "./AboutDossier.css";

/*
  ================= ABOUT DOSSIER =================
  A diagrammatic "capability matrix" infographic:
    - SVG radar / spider chart across 4 domains (draws + scales in)
    - domain legend with signature-tech mono chips
    - sequential milestone timeline (connector + nodes light up)
  Monochrome + olive brand. Green status dot is the only accent.
  ================================================
*/

const EASE = [0.16, 1, 0.3, 1];

// --- REAL DATA ---------------------------------------------------------------
const DOMAINS = [
  {
    id: "01",
    name: "Frontend",
    level: 0.95,
    tech: ["React 19", "Next.js", "Tailwind", "JavaScript"],
  },
  {
    id: "02",
    name: "Backend & Data",
    level: 0.86,
    tech: ["Node.js", "Prisma", "SQL / MySQL / PostgreSQL"],
  },
  {
    id: "03",
    name: "AI & Automation",
    level: 0.9,
    tech: ["LLM integration", "AI agents", "n8n", "Power BI"],
  },
  {
    id: "04",
    name: "IT Systems",
    level: 0.8,
    tech: ["Active Directory", "Servers", "Git / GitHub", "Vercel"],
  },
];

const MILESTONES = [
  { id: "M0", year: "GCET", label: "Business Computing", note: "GCET, Oman" },
  { id: "M1", year: "GRAD", label: "Best Graduation Project", note: "Cohort distinction" },
  { id: "M2", year: "PYHACK", label: "3rd of 27 — National", note: "PYHACK Hackathon" },
  { id: "M3", year: "REGION", label: "Arab-World & Middle-East", note: "Hackathon circuit" },
];

// --- RADAR GEOMETRY ----------------------------------------------------------
const CX = 160;
const CY = 156;
const R = 118;
const RINGS = [0.25, 0.5, 0.75, 1];

// 4 axes, starting at top (12 o'clock), clockwise
function axisAngle(i, n) {
  return (Math.PI * 2 * i) / n - Math.PI / 2;
}
function point(i, n, radius) {
  const a = axisAngle(i, n);
  return [CX + Math.cos(a) * radius, CY + Math.sin(a) * radius];
}
function polygonPoints(values) {
  return values
    .map((v, i) => point(i, values.length, R * v).map((p) => p.toFixed(1)).join(","))
    .join(" ");
}

export default function AboutDossier() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.35 });

  const levels = DOMAINS.map((d) => d.level);
  const dataPolygon = polygonPoints(levels);
  const fullGrid = polygonPoints(DOMAINS.map(() => 1));

  // animate from a collapsed polygon at center to the real shape
  const collapsed = polygonPoints(DOMAINS.map(() => 0.001));
  const go = reduce ? true : inView;

  const fade = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  return (
    <section
      className="dossier"
      id="dossier"
      aria-label="Expertise dossier and capability matrix"
      ref={ref}
    >
      <motion.div
        className="dossier__sheet"
        variants={stagger}
        initial={reduce ? false : "hidden"}
        animate={go ? "show" : "hidden"}
      >
        {/* corner crosshairs (decorative) */}
        <span className="dossier__crosshair dossier__crosshair--tl" aria-hidden="true" />
        <span className="dossier__crosshair dossier__crosshair--br" aria-hidden="true" />

        {/* ---------- HEADER ---------- */}
        <motion.header className="dossier__head" variants={fade}>
          <div className="dossier__eyebrow">
            <span className="dossier__dot" aria-hidden="true" />
            <span>CAPABILITY MATRIX</span>
            <span className="dossier__sep" aria-hidden="true">/</span>
            <span>FILE&nbsp;MAH-04</span>
          </div>
          <h2 className="dossier__title">The Dossier</h2>
          <p className="dossier__sub">
            Mohammed Al Hajri <span aria-hidden="true">—</span>{" "}
            <span className="dossier__role">Full-Stack &amp; AI Engineer</span>
          </p>
          <span className="dossier__rev" aria-hidden="true">REV 2026</span>
        </motion.header>

        <motion.hr className="dossier__rule" variants={fade} aria-hidden="true" />

        {/* ---------- BODY: radar + legend ---------- */}
        <div className="dossier__body">
          {/* RADAR */}
          <motion.figure className="dossier__radar" variants={fade}>
            <figcaption className="dossier__radarCap">
              <span>PROFICIENCY&nbsp;PLOT</span>
              <span aria-hidden="true">θ · 4-AXIS</span>
            </figcaption>

            <svg
              className="radar"
              viewBox="0 0 320 312"
              role="img"
              aria-label="Radar chart of four expertise domains: Frontend, Backend and Data, AI and Automation, IT Systems."
            >
              <defs>
                <radialGradient id="dossierFill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(233,231,221,0.20)" />
                  <stop offset="100%" stopColor="rgba(233,231,221,0.04)" />
                </radialGradient>
              </defs>

              {/* concentric rings */}
              {RINGS.map((rg, i) => (
                <motion.polygon
                  key={`ring-${i}`}
                  points={polygonPoints(DOMAINS.map(() => rg))}
                  className="radar__ring"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={go ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.07, ease: EASE }}
                />
              ))}

              {/* spokes + outer tick labels */}
              {DOMAINS.map((d, i) => {
                const [x, y] = point(i, DOMAINS.length, R);
                const [lx, ly] = point(i, DOMAINS.length, R + 22);
                const anchor = Math.abs(lx - CX) < 4 ? "middle" : lx > CX ? "start" : "end";
                return (
                  <g key={`spoke-${i}`}>
                    <motion.line
                      x1={CX}
                      y1={CY}
                      x2={x}
                      y2={y}
                      className="radar__spoke"
                      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                      animate={go ? { pathLength: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
                    />
                    <text
                      x={lx}
                      y={ly}
                      className="radar__axisLabel"
                      textAnchor={anchor}
                      dominantBaseline="middle"
                    >
                      {d.id}
                    </text>
                  </g>
                );
              })}

              {/* data polygon: scales/morphs in */}
              <motion.polygon
                className="radar__shapeFill"
                points={dataPolygon}
                fill="url(#dossierFill)"
                initial={reduce ? false : { opacity: 0 }}
                animate={go ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
                style={
                  reduce
                    ? undefined
                    : { transformOrigin: `${CX}px ${CY}px` }
                }
              />
              <motion.polygon
                className="radar__shapeStroke"
                points={collapsed}
                animate={go ? { points: dataPolygon } : { points: collapsed }}
                transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
              />

              {/* vertices */}
              {levels.map((v, i) => {
                const [x, y] = point(i, levels.length, R * v);
                return (
                  <motion.circle
                    key={`vtx-${i}`}
                    cx={x}
                    cy={y}
                    r="3.4"
                    className="radar__vertex"
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    animate={go ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.45, delay: 0.95 + i * 0.08, ease: EASE }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                );
              })}

              {/* center crosshair */}
              <line x1={CX - 7} y1={CY} x2={CX + 7} y2={CY} className="radar__center" />
              <line x1={CX} y1={CY - 7} x2={CX} y2={CY + 7} className="radar__center" />
            </svg>
          </motion.figure>

          {/* LEGEND */}
          <motion.ul className="dossier__legend" variants={stagger}>
            {DOMAINS.map((d) => (
              <motion.li className="legend__row" key={d.id} variants={fade}>
                <div className="legend__head">
                  <span className="legend__id">{d.id}</span>
                  <h3 className="legend__name">{d.name}</h3>
                  <span className="legend__pct" aria-hidden="true">
                    {Math.round(d.level * 100)}
                    <i>%</i>
                  </span>
                </div>
                <div className="legend__bar" aria-hidden="true">
                  <motion.span
                    className="legend__barFill"
                    initial={reduce ? false : { scaleX: 0 }}
                    animate={go ? { scaleX: d.level } : { scaleX: 0 }}
                    transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
                  />
                </div>
                <ul className="legend__chips">
                  {d.tech.map((t) => (
                    <li className="legend__chip" key={t}>
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.hr className="dossier__rule" variants={fade} aria-hidden="true" />

        {/* ---------- MILESTONE TIMELINE ---------- */}
        <motion.div className="dossier__timeline" variants={fade}>
          <div className="timeline__cap">
            <span>JOURNEY&nbsp;LOG</span>
            <span aria-hidden="true">04 ENTRIES</span>
          </div>

          <ol className="timeline__track">
            {/* animated connector */}
            <motion.span
              className="timeline__line"
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              animate={go ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
            />
            {MILESTONES.map((m, i) => (
              <motion.li
                className="timeline__stop"
                key={m.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={go ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.55, delay: 0.55 + i * 0.18, ease: EASE }}
              >
                <motion.span
                  className="timeline__node"
                  aria-hidden="true"
                  initial={reduce ? false : { scale: 0 }}
                  animate={go ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.18, ease: EASE }}
                />
                <span className="timeline__year">{m.year}</span>
                <span className="timeline__label">{m.label}</span>
                <span className="timeline__note">{m.note}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </section>
  );
}
