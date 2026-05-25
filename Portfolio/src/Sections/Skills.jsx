import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import SectionHeader from "../Components/SectionHeader";
import GlassCard from "../Components/GlassCard";
import SkillOrbit from "../Components/SkillOrbit";

function SkillBar({ name, level }) {
  return (
    <div className="skill-bar-row">
      <div className="flex justify-between items-baseline gap-2 mb-1">
        <span className="text-[13px] text-foreground/90 leading-tight">{name}</span>
        <span className="text-[11px] text-muted-foreground font-mono-display shrink-0">{level}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #00E5FF, #9D4CDD)",
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const { portfolio } = usePortfolio();
  const skillsSection = portfolio.skillsSection ?? { categories: [], orbit: [] };

  return (
    <section id="skills" className="page-container section-pad relative">
      <SectionHeader
        eyebrow={skillsSection.eyebrow}
        title={skillsSection.title}
        subtitle={skillsSection.subtitle}
      />

      {/* ~40% orbit | ~60% cards — heights aligned like reference */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 sm:gap-8 lg:gap-10 items-stretch">
        <div className="skills-orbit-wrap flex items-center justify-center w-full py-2 sm:py-4 lg:py-0">
          <SkillOrbit />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 skills-cards-grid items-start">
          {(skillsSection.categories ?? []).map((cat, ci) => (
            <motion.div
              key={cat.name}
              className=""
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.08 }}
            >
              <GlassCard className="skills-card p-4 sm:p-5">
                <h3 className="font-mono-display text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-4">
                  {cat.name}
                </h3>
                <div className="flex flex-col gap-3">
                  {(cat.items ?? []).map((item) => (
                    <SkillBar key={item.name} name={item.name} level={item.level} />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
