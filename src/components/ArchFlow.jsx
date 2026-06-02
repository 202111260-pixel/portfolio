import { motion } from "motion/react";
import "./ArchFlow.css";

/* ---- tiny inline icons ---- */
const Ic = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.5 2.5 13 0 16M12 4c-2.5 2.5-2.5 13 0 16" />
    </>
  ),
  code: <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />,
  ai: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9.5 9.5h5v5h-5z" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </>
  ),
  chart: <path d="M5 19V11M10 19V5M15 19v-6M20 19V9M4 19h17" />,
};

function Glyph({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {Ic[name]}
    </svg>
  );
}

const NODES = [
  { id: "user", x: 50, y: 11, label: "USER", icon: "user" },
  { id: "web", x: 25, y: 37, label: "WEB APP", icon: "web" },
  { id: "api", x: 75, y: 37, label: "API GATEWAY", icon: "code" },
  { id: "ai", x: 25, y: 64, label: "AI SERVICE", icon: "ai" },
  { id: "db", x: 75, y: 64, label: "DATABASE", icon: "db" },
  { id: "ana", x: 50, y: 90, label: "ANALYTICS", icon: "chart" },
];
const LINKS = [
  ["user", "web"],
  ["user", "api"],
  ["web", "api"],
  ["web", "ai"],
  ["api", "db"],
  ["ai", "db"],
  ["ai", "ana"],
  ["db", "ana"],
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const TAGS = ["THINK", "ENGINEER", "AUTOMATE", "SCALE"];

export default function ArchFlow() {
  return (
    <motion.div
      className="arch"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="arch__head">
        <span className="arch__title">SYSTEM ARCHITECTURE</span>
        <span className="arch__live">
          <i /> RUNNING
        </span>
      </div>

      <div className="arch__stage">
        <svg className="arch__wires" viewBox="0 0 100 100" preserveAspectRatio="none">
          {LINKS.map(([a, b], i) => {
            const A = byId[a];
            const B = byId[b];
            const d = `M${A.x} ${A.y} L${B.x} ${B.y}`;
            return (
              <g key={`${a}-${b}`}>
                <path className="arch__base" d={d} vectorEffect="non-scaling-stroke" />
                <path
                  className="arch__flow"
                  d={d}
                  vectorEffect="non-scaling-stroke"
                  style={{ animationDelay: `${i * 0.28}s` }}
                />
              </g>
            );
          })}
        </svg>

        {NODES.map((n, i) => (
          <motion.div
            key={n.id}
            className="arch__node"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 + i * 0.08 }}
          >
            <span className="arch__nodeIc">
              <Glyph name={n.icon} />
            </span>
            <span className="arch__nodeLabel">{n.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="arch__tags">
        {TAGS.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <p className="arch__caption">AI-powered systems, built for impact.</p>
    </motion.div>
  );
}
