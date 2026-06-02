import "./Skills.css";

/*
  ================= EDIT HERE =================
  Each skill is either:
    - { label, logo: "<simple-icons-slug>" }  -> real brand logo (cdn.simpleicons.org)
    - { label, icon: "<glyph>" }               -> inline line icon (no official brand logo)
    - { label, mono: "CDK" }                   -> typographic monogram chip
  Add / remove skills freely; the marquee + groups update automatically.
  ============================================
*/
const groups = [
  {
    name: "Frontend",
    items: [
      { label: "React 19", logo: "react" },
      { label: "Next.js", logo: "nextdotjs" },
      { label: "Tailwind CSS", logo: "tailwindcss" },
      { label: "JavaScript", logo: "javascript" },
    ],
  },
  {
    name: "Backend & Database",
    items: [
      { label: "Node.js", logo: "nodedotjs" },
      { label: "Prisma ORM", logo: "prisma" },
      { label: "SQL", icon: "database" },
      { label: "MySQL", logo: "mysql" },
      { label: "PostgreSQL", logo: "postgresql" },
    ],
  },
  {
    name: "AI & Data",
    items: [
      { label: "LLM Integration", icon: "sparkle" },
      { label: "AI Agents", icon: "robot" },
      { label: "n8n", logo: "n8n" },
      { label: "Power BI", icon: "chart" },
      { label: "Data Modeling", icon: "diagram" },
    ],
  },
  {
    name: "IT Systems",
    items: [
      { label: "Active Directory", icon: "tree" },
      { label: "Server Management", icon: "server" },
      { label: "CDK", mono: "CDK" },
      { label: "Keyloop", mono: "KL" },
      { label: "Git", logo: "git" },
      { label: "GitHub", logo: "github" },
      { label: "Vercel", logo: "vercel" },
    ],
  },
];

/* inline line icons for skills without an official brand logo */
const glyphs = {
  database: (
    <>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
      <path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.7 5.1a3 3 0 0 0 1.9 1.9L20.5 12l-4.9 1.7a3 3 0 0 0-1.9 1.9L12 21l-1.7-5.4a3 3 0 0 0-1.9-1.9L3.5 12l5-1.7a3 3 0 0 0 1.9-1.9z" />
  ),
  robot: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="2.5" />
      <path d="M12 4.5v3.5" />
      <circle cx="12" cy="3.4" r="1.2" />
      <circle cx="9.6" cy="13" r="1.1" />
      <circle cx="14.4" cy="13" r="1.1" />
      <path d="M3 12.5v3M21 12.5v3" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M6 20.5V11M11 20.5V4.5M16 20.5v-6" />
    </>
  ),
  diagram: (
    <>
      <circle cx="6" cy="6" r="2.3" />
      <circle cx="18" cy="6" r="2.3" />
      <circle cx="12" cy="18" r="2.3" />
      <path d="M8 6h8M7.6 7.8 11 15.9M16.4 7.8 13 15.9" />
    </>
  ),
  tree: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="2.5" y="16" width="6" height="5" rx="1" />
      <rect x="15.5" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M5.5 16v-2.5h13V16M12 13.5V16" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="7" rx="1.5" />
      <rect x="4" y="13" width="16" height="7" rx="1.5" />
      <path d="M7.5 7.5h.01M7.5 16.5h.01" />
      <path d="M15 7.5h2M15 16.5h2" />
    </>
  ),
};

function SkillMark({ item }) {
  if (item.logo) {
    return (
      <img
        className="skill__logo"
        src={`https://cdn.simpleicons.org/${item.logo}`}
        alt={item.label}
        loading="lazy"
        draggable="false"
      />
    );
  }
  if (item.mono) {
    return (
      <span className="skill__mono" aria-hidden="true">
        {item.mono}
      </span>
    );
  }
  return (
    <svg
      className="skill__glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyphs[item.icon]}
    </svg>
  );
}

export default function Skills() {
  return (
    <section className="skills" id="skills" aria-label="Technical skills">
      <div className="skills__bg" aria-hidden="true" />

      <div className="skills__inner">
        <header className="skills__head">
          <h2 className="skills__title">TECHNICAL SKILLS</h2>
          <p className="skills__sub">
            The stack I build, automate and ship with — frontend to AI.
            <span className="skills__hint"> Hover a logo to see its name.</span>
          </p>
        </header>

        {/* accessible list (the orbital below is decorative) */}
        <ul className="sr-only">
          {groups.map((g) => (
            <li key={g.name}>
              {g.name}: {g.items.map((it) => it.label).join(", ")}
            </li>
          ))}
        </ul>

        {/* ===== ORBITAL SYSTEM ===== */}
        <div className="orbit" aria-hidden="true">
          <div className="orbit__core">
            <img className="orbit__img" src="/me3.jpeg" alt="Mohammed" draggable="false" />
            <span className="orbit__coreLabel">STACK</span>
          </div>

          {groups.map((g, ri) => (
            <div className={`ring ring--${ri + 1}`} key={g.name}>
              {g.items.map((it, i) => {
                const angle = (360 / g.items.length) * i;
                return (
                  <div
                    className="node"
                    key={it.label}
                    style={{ "--a": `${angle}deg` }}
                  >
                    <span className="node__center">
                      <span className="node__spin">
                        <span className="node__up">
                          <span className="node__chip">
                            <SkillMark item={it} />
                          </span>
                          <span className="node__label">{it.label}</span>
                        </span>
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
