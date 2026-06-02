import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./ThankYou.css";

/*
  ================= EDIT HERE =================
  - email / github / linkedin : your contact
  The multi-step form composes a real email to you (mailto) on submit.
  ============================================
*/
const contact = {
  email: "202111260@gcet.edu.om",
  github: "https://github.com/202111260-pixel",
  linkedin: "https://www.linkedin.com/in/mohammed-al-hajri-663846367",
};

/*
  ⚠️  WEB3FORMS — make the form actually reach your inbox:
  1. Go to https://web3forms.com  → enter your email → you instantly get an
     "Access Key" by email (free, unlimited, no signup).
  2. Paste that key below. That's it — submissions land in your inbox.
*/
const WEB3FORMS_ACCESS_KEY = "9e6f8122-2901-470d-8d0d-099e09f118d8";

// the wizard steps — fill one, it advances to the next
const steps = [
  {
    key: "name",
    kicker: "01 — Who",
    label: "What's your name?",
    placeholder: "Your full name",
    type: "text",
    autoComplete: "name",
  },
  {
    key: "email",
    kicker: "02 — Where to reply",
    label: "Your email address?",
    placeholder: "you@email.com",
    type: "email",
    autoComplete: "email",
  },
  {
    key: "message",
    kicker: "03 — The idea",
    label: "What's the problem worth solving?",
    placeholder: "Tell me about the project…",
    type: "textarea",
    autoComplete: "off",
  },
];

const EASE = [0.16, 1, 0.3, 1];
const fade = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const parent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

function LocalClock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Muscat",
      }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>Muscat · {t}</span>;
}

const GitHubGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
  </svg>
);
const LinkedInGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);
const MailGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NextArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---- hand-drawn doodles that surround the box ---- */
function Doodles() {
  return (
    <div className="doodles" aria-hidden="true">
      {/* top-left: start here → */}
      <span className="doodle doodle--tl">
        <span className="doodle__note">start here</span>
        <svg viewBox="0 0 130 96" fill="none">
          <path d="M8 14 C 46 2, 70 6, 84 26 C 92 38, 96 50, 100 66" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M86 56 L101 70 L108 50" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* top-right: only 3 steps */}
      <span className="doodle doodle--tr">
        <span className="doodle__note">only 3 steps!</span>
        <svg viewBox="0 0 150 92" fill="none">
          <path d="M142 16 C 104 4, 60 8, 28 42" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M44 30 L26 46 L50 58" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* right: takes 20 sec */}
      <span className="doodle doodle--r">
        <span className="doodle__note">takes ~20s</span>
        <svg viewBox="0 0 110 70" fill="none">
          <path d="M104 12 C 70 6, 34 14, 10 40" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M26 28 L8 42 L30 52" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* bottom-left: I reply fast ↗ */}
      <span className="doodle doodle--bl">
        <span className="doodle__note">I reply fast</span>
        <svg viewBox="0 0 96 120" fill="none">
          <path d="M28 110 C 14 74, 22 42, 56 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M40 28 L58 12 L70 34" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* bottom-right: promise loop */}
      <span className="doodle doodle--br">
        <span className="doodle__note">say hi 👋</span>
        <svg viewBox="0 0 120 90" fill="none">
          <path d="M112 70 C 84 86, 40 84, 18 56" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M30 64 L14 52 L34 42" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

export default function ThankYou() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const fieldRef = useRef(null);
  const mounted = useRef(false);
  const inView = { once: true, amount: 0.3 };

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = (step / (steps.length - 1)) * 100;

  // focus the field when the step changes — but NOT on first mount
  // (focusing on load would scroll the page down to the contact form)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const id = requestAnimationFrame(() => fieldRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [step]);

  const onChange = (e) => {
    setForm({ ...form, [current.key]: e.target.value });
    if (error) setError("");
  };

  const validate = () => {
    const v = (form[current.key] || "").trim();
    if (!v) return "This one's required";
    if (current.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "That email looks off";
    return "";
  };

  const submit = async () => {
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio enquiry — ${form.name || "New message"}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) setStatus("ok");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const advance = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (isLast) submit();
    else setStep((s) => s + 1);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    advance();
  };
  const onKeyDown = (e) => {
    // Enter advances on single-line fields; textarea keeps Enter for newlines
    if (e.key === "Enter" && current.type !== "textarea") {
      e.preventDefault();
      advance();
    }
  };

  return (
    <section className="cta" id="contact" aria-label="Contact">
      <div className="cta__inner">
        <div className="cta__top">
          <span>(05) — CONTACT</span>
          <span className="cta__clock">
            <LocalClock />
          </span>
          <span>Available 2026</span>
        </div>

        <div className="cta__main">
          {/* left: invitation + details */}
          <motion.div className="cta__intro" variants={parent} initial="hidden" whileInView="show" viewport={inView}>
            <motion.h2 className="cta__title" variants={fade}>
              LET&apos;S
              <br />
              TALK<span className="cta__dotmark">.</span>
            </motion.h2>
            <motion.p className="cta__lead" variants={fade}>
              Open to roles, freelance and collaboration. Tell me about the
              problem worth solving — I usually reply within 24 hours.
            </motion.p>

            <motion.a className="cta__email" href={`mailto:${contact.email}`} variants={fade}>
              {contact.email}
            </motion.a>

            <motion.div className="cta__meta" variants={fade}>
              <span>
                <i className="cta__dot" /> Open to work
              </span>
              <span>Muscat, Oman</span>
            </motion.div>

            <motion.div className="cta__socials" variants={fade}>
              <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubGlyph />
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedInGlyph />
              </a>
              <a href={`mailto:${contact.email}`} aria-label="Email">
                <MailGlyph />
              </a>
            </motion.div>
          </motion.div>

          {/* right: multi-step infographic box, ringed by hand-drawn arrows */}
          <motion.div
            className="formwrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <Doodles />

            <form className="wzd" onSubmit={onSubmit} noValidate>
              <div className="wzd__head">
                <span className="wzd__title">Send a message</span>
                <span className="wzd__counter">
                  <b>{String(step + 1).padStart(2, "0")}</b>
                  <i>/</i>
                  {String(steps.length).padStart(2, "0")}
                </span>
              </div>

              {status === "ok" ? (
                <div className="wzd__done" role="status">
                  <span className="wzd__doneIc">
                    <Check />
                  </span>
                  <h3 className="wzd__doneTitle">Message sent</h3>
                  <p className="wzd__doneText">
                    Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""} — I&apos;ll get
                    back to you within 24 hours.
                  </p>
                </div>
              ) : (
              <>
              {/* infographic progress rail */}
              <div className="wzd__rail" aria-hidden="true">
                <span className="wzd__track">
                  <span className="wzd__fill" style={{ width: `${progress}%` }} />
                </span>
                {steps.map((s, i) => (
                  <span
                    key={s.key}
                    className={`wzd__node ${i < step ? "is-done" : ""} ${i === step ? "is-active" : ""}`}
                  >
                    {i < step ? <Check /> : String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>

              {/* animated current field */}
              <div className="wzd__stage">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    className="wzd__field"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <span className="wzd__kicker">{current.kicker}</span>
                    <label className="wzd__label" htmlFor={current.key}>
                      {current.label}
                    </label>

                    {current.type === "textarea" ? (
                      <textarea
                        ref={fieldRef}
                        id={current.key}
                        name={current.key}
                        rows="4"
                        value={form[current.key]}
                        onChange={onChange}
                        placeholder={current.placeholder}
                        autoComplete={current.autoComplete}
                      />
                    ) : (
                      <input
                        ref={fieldRef}
                        id={current.key}
                        name={current.key}
                        type={current.type}
                        value={form[current.key]}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        placeholder={current.placeholder}
                        autoComplete={current.autoComplete}
                      />
                    )}

                    <span className={`wzd__err ${error ? "is-show" : ""}`}>{error || " "}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {status === "error" && (
                <p className="wzd__sendErr">
                  Couldn&apos;t send right now — email me directly at{" "}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </p>
              )}

              {/* nav */}
              <div className="wzd__nav">
                <button
                  type="button"
                  className="wzd__back"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  Back
                </button>
                <button type="submit" className="wzd__next" disabled={status === "sending"}>
                  <span>
                    {isLast ? (status === "sending" ? "Sending…" : "Send message") : "Next"}
                  </span>
                  <span className="wzd__nextIc">{isLast ? <MailGlyph /> : <NextArrow />}</span>
                </button>
              </div>
              </>
              )}
            </form>
          </motion.div>
        </div>

        <div className="cta__foot">
          <span className="cta__mono">MA</span>
          <span>Mohammed Al Hajri © 2026 — Built with React + Vite</span>
        </div>
      </div>
    </section>
  );
}
