import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { HiPaperAirplane, HiEnvelope, HiMapPin } from "react-icons/hi2";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaYoutube,
  FaInstagram,
  FaSnapchat,
  FaReddit,
  FaDiscord,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { submitContact } from "../api/client";
import { usePortfolio } from "../context/PortfolioContext";
import GlassCard from "../Components/GlassCard";

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
  mail: FaEnvelope,
  youtube: FaYoutube,
  instagram: FaInstagram,
  snapchat: FaSnapchat,
  x: FaXTwitter,
  reddit: FaReddit,
  discord: FaDiscord,
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/30 transition-colors";

export default function Contact() {
  const { portfolio } = usePortfolio();
  const { contactSection, site } = portfolio;
  const social = portfolio.social ?? [];
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const hasEmailJs = Boolean(serviceId && templateId && publicKey);

    setStatus("sending");
    setErrorMsg("");

    try {
      await submitContact(form);

      if (hasEmailJs) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            { ...form, to_email: site.email },
            publicKey
          );
        } catch {
          /* Saved to admin inbox; email notification is optional */
        }
      }

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.message ||
          "Could not send. Start the API server (cd Portfolio/server && npm run dev), then try again."
      );
    }
  };

  const { title, placeholders } = contactSection;

  return (
    <section id="contact" className="page-container section-pad relative">
      <motion.header
        className="mb-10 md:mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono-display text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.35em] uppercase text-cyan-400/90 mb-3 sm:mb-4">
          <span className="h-px w-6 sm:w-8 bg-cyan-400/60 shrink-0" aria-hidden />
          {contactSection.eyebrow}
        </p>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.12] sm:leading-[1.1] max-w-3xl text-balance">
          {title.before}
          <span className="text-gradient">{title.highlight}</span>
          {title.after}
        </h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl">
          {contactSection.subtitle}
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-4 sm:gap-5 lg:gap-6">
        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="contact-card p-6 sm:p-8 h-full flex flex-col">
            <span className="inline-flex items-center gap-2 font-mono-display text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-cyan-400/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              {contactSection.statusBadge}
            </span>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-6">
              {contactSection.infoTitle}
            </h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">
              {contactSection.infoBody}
            </p>

            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-4 group"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-400/90 group-hover:border-cyan-500/30 transition-colors">
                    <HiEnvelope className="h-5 w-5" />
                  </span>
                  <span className="text-sm text-foreground/90 group-hover:text-foreground break-all">
                    {site.email}
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-400/90">
                  <HiMapPin className="h-5 w-5" />
                </span>
                <span className="text-sm text-foreground/90">{site.location}</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="font-mono-display text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
                Elsewhere
              </p>
              <ul className="flex gap-3">
                {social.map(({ label, href, icon }) => {
                  const Icon = socialIcons[icon] ?? FaEnvelope;
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-foreground/70 hover:text-foreground hover:border-cyan-500/35 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </GlassCard>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <GlassCard className="contact-card p-6 sm:p-8 h-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="contact-label">
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder={placeholders.name}
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="contact-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={placeholders.email}
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5 flex-1 flex flex-col">
                <label htmlFor="message" className="contact-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder={placeholders.message}
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} flex-1 min-h-[140px] resize-y`}
                />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <p className="font-mono-display text-[11px] text-muted-foreground tracking-wide">
                  {contactSection.responseTime}
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-white/95 disabled:opacity-60 shrink-0"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  <HiPaperAirplane className="h-4 w-4" />
                </button>
              </div>

              {status === "sent" && (
                <p className="mt-3 text-sm text-cyan-400">Thanks — I&apos;ll reply soon.</p>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm text-destructive">
                  {errorMsg}{" "}
                  <a href={`mailto:${site.email}`} className="underline hover:text-foreground">
                    Email me directly
                  </a>
                </p>
              )}
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
