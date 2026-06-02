import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import "./AboutStats.css";

/*
  ================= IMPACT AT A GLANCE =================
  Self-contained animated metrics infographic for the dark
  olive "About" section. Real data only — see `metrics` /
  `awards` below. Counts up on scroll into view; fully
  reduced-motion aware (shows final state instantly).
  =====================================================
*/

const EASE = [0.16, 1, 0.3, 1];

const metrics = [
  {
    value: 2,
    suffix: "M+",
    label: "OMR TRACKED",
    caption: "Financial flow monitored across 11 governorates.",
    sub: "11 GOVERNORATES",
  },
  {
    value: 30,
    suffix: "+",
    label: "PLATFORMS UNIFIED",
    caption: "Freelance income sources merged into one identity.",
    sub: "ONE LEDGER",
  },
  {
    value: 13000,
    suffix: "+",
    label: "WADI PATHS MAPPED",
    caption: "Spatial routes resolved with AI terrain analysis.",
    sub: "AI SPATIAL",
    group: true, // thousands separator
  },
  {
    value: 3,
    suffix: "rd",
    label: "PYHACK HACKATHON",
    caption: "National placement out of 27 competing teams.",
    sub: "OF 27 TEAMS",
  },
];

const awards = [
  { icon: "trophy", text: "Best Graduation Project" },
  { icon: "poster", text: "Best Poster Award" },
  { icon: "podium", text: "PYHACK — 3rd of 27 (National)" },
];

const EFFICIENCY = 40; // % efficiency gained through automation

/* ---- count-up hook: rAF, easeOutQuint, reduced-motion safe ---- */
function useCountUp(target, active, { duration = 1700, group = false } = {}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setN(target);
      return;
    }
    if (!active) return;
    let raf = 0;
    let start = 0;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 5);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);

  // format: keep big "M+" hero whole; group thousands when asked
  let display;
  if (target >= 1000 && group) {
    display = Math.round(n).toLocaleString("en-US");
  } else {
    display = Math.round(n).toString();
  }
  return display;
}

function MetricNumber({ m, active, hero = false }) {
  const display = useCountUp(m.value, active, { group: m.group });
  return (
    <span className="stat__num" aria-hidden="true">
      {display}
      <span className="stat__suffix">{m.suffix}</span>
    </span>
  );
}

/* ---- circular efficiency arc (SVG, draws on view) ---- */
function EfficiencyArc({ active }) {
  const reduce = useReducedMotion();
  const display = useCountUp(EFFICIENCY, active, { duration: 1700 });
  const R = 52;
  const C = 2 * Math.PI * R;
  const pct = EFFICIENCY / 100;
  return (
    <div className="arc" role="img" aria-label={`+${EFFICIENCY}% efficiency gained through automation`}>
      <svg viewBox="0 0 140 140" className="arc__svg">
        <circle className="arc__track" cx="70" cy="70" r={R} />
        <motion.circle
          className="arc__fill"
          cx="70"
          cy="70"
          r={R}
          strokeDasharray={C}
          initial={reduce ? false : { strokeDashoffset: C }}
          animate={active ? { strokeDashoffset: C * (1 - pct) } : undefined}
          transition={{ duration: 1.7, ease: EASE }}
          style={reduce ? { strokeDashoffset: C * (1 - pct) } : undefined}
        />
      </svg>
      <div className="arc__center">
        <span className="arc__val" aria-hidden="true">
          +{display}<span className="arc__unit">%</span>
        </span>
        <span className="arc__cap">EFFICIENCY</span>
      </div>
    </div>
  );
}

export default function AboutStats() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const active = reduce ? true : inView;

  const grid = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <section className="impact" aria-label="Impact metrics at a glance" ref={ref}>
      <div className="impact__inner">
        {/* header */}
        <motion.header
          className="impact__head"
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={active ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="impact__eyebrow">IMPACT / 2024—2026</span>
          <h2 className="impact__title">
            Proof, measured in <em>outcomes.</em>
          </h2>
          <span className="impact__pulse" aria-hidden="true">
            <i className="impact__dot" /> SHIPPED &amp; VERIFIED
          </span>
        </motion.header>

        {/* metric grid */}
        <motion.div
          className="impact__grid"
          variants={reduce ? undefined : grid}
          initial={reduce ? false : "hidden"}
          animate={active ? "show" : undefined}
        >
          {/* HERO cell: circular efficiency arc */}
          <motion.figure className="cell cell--hero" variants={reduce ? undefined : fadeUp}>
            <EfficiencyArc active={active} />
            <figcaption className="cell__caption">
              <span className="cell__lead">Automation lift</span>
              Manual reporting replaced by automated pipelines, cutting
              turnaround across the financial tracking platform.
            </figcaption>
          </motion.figure>

          {/* metric cells with thin animated bars */}
          {metrics.map((m, i) => (
            <motion.figure
              key={m.label}
              className="cell stat"
              variants={reduce ? undefined : fadeUp}
            >
              <span className="stat__sub">{m.sub}</span>
              <MetricNumber m={m} active={active} />
              <span className="stat__label">{m.label}</span>
              <figcaption className="stat__caption">{m.caption}</figcaption>
              <span className="stat__bar" aria-hidden="true">
                <motion.i
                  className="stat__barFill"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={active ? { scaleX: 1 } : undefined}
                  transition={{ duration: 1, ease: EASE, delay: 0.25 + i * 0.08 }}
                  style={reduce ? { transform: "scaleX(1)" } : undefined}
                />
              </span>
            </motion.figure>
          ))}
        </motion.div>

        {/* awards ribbon row */}
        <motion.div
          className="impact__awards"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={active ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          aria-label="Awards and recognition"
        >
          <span className="impact__awardsLabel">RECOGNITION</span>
          <ul className="impact__badges">
            {awards.map((a) => (
              <li key={a.text} className="badge">
                <AwardIcon kind={a.icon} />
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* identity footer */}
        <motion.footer
          className="impact__id"
          initial={reduce ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
        >
          <span className="impact__name">Mohammed Al Hajri</span>
          <span className="impact__role">
            Full-Stack &amp; AI Engineer · Business Computing, GCET Oman
          </span>
        </motion.footer>
      </div>
    </section>
  );
}

/* ---- hand-drawn award icons, 1.6 stroke ---- */
function AwardIcon({ kind }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (kind === "trophy") {
    return (
      <svg {...common}>
        <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4.5A1.5 1.5 0 0 0 3 7.5C3 9 4 10.5 6.5 11" />
        <path d="M17 6h2.5A1.5 1.5 0 0 1 21 7.5C21 9 20 10.5 17.5 11" />
        <path d="M12 13v4" />
        <path d="M8.5 20h7" />
        <path d="M10 17h4l-.5 3h-3L10 17Z" />
      </svg>
    );
  }
  if (kind === "poster") {
    return (
      <svg {...common}>
        <rect x="5" y="3" width="14" height="18" rx="1.5" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
        <circle cx="12" cy="3" r="0" />
      </svg>
    );
  }
  // podium / star
  return (
    <svg {...common}>
      <path d="M12 3.2l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.5l5-.7L12 3.2Z" />
    </svg>
  );
}
