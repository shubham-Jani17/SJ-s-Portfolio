import { useEffect, useRef, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import useLiteMode from "../hooks/useLiteMode";

function buildRings(skills) {
  const perRing = Math.ceil(skills.length / 3);
  const configs = [
    { radius: 34, duration: 48, direction: "normal" },
    { radius: 46, duration: 72, direction: "reverse" },
    { radius: 58, duration: 96, direction: "normal" },
  ];

  return configs
    .map((cfg, ringIndex) => {
      const start = ringIndex * perRing;
      const slice = skills.slice(start, start + perRing);
      if (!slice.length) return null;
      return { ...cfg, skills: slice };
    })
    .filter(Boolean);
}

function OrbitPath({ radius }) {
  const size = `${radius * 2}%`;
  return (
    <div
      className="skill-orbit-ring pointer-events-none absolute left-1/2 top-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

function OrbitTrack({ radius, duration, direction, skills, running }) {
  const delayStep = duration / skills.length;
  const size = `${radius * 2}%`;
  const playState = running ? "running" : "paused";

  return skills.map((skill, i) => {
    const delay = -(delayStep * i);
    const spin = `skill-orbit-spin ${duration}s linear infinite ${direction}`;
    const counter = `skill-orbit-spin ${duration}s linear infinite ${
      direction === "reverse" ? "normal" : "reverse"
    }`;

    return (
      <div
        key={`${radius}-${skill}`}
        className="absolute left-1/2 top-1/2 pointer-events-none z-10"
        style={{
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            animation: spin,
            animationDelay: `${delay}s`,
            animationPlayState: playState,
          }}
          aria-hidden
        >
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
            <span
              className="skill-orbit-pill orbit-planet-label inline-block font-mono-display"
              style={{
                animation: counter,
                animationDelay: `${delay}s`,
                animationPlayState: playState,
              }}
            >
              {skill}
            </span>
          </div>
        </div>
      </div>
    );
  });
}

function StaticSkills({ orbit, initials }) {
  return (
    <div
      className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-sm mx-auto py-6"
      aria-label="Skills"
    >
      {orbit.map((skill) => (
        <span key={skill} className="skill-orbit-pill inline-block font-mono-display">
          {skill}
        </span>
      ))}
      <div className="w-full flex justify-center mt-4">
        <div className="skill-orbit-sun relative flex h-14 w-14 items-center justify-center rounded-full font-display font-bold text-base">
          <span className="skill-orbit-sun-text">{initials}</span>
        </div>
      </div>
    </div>
  );
}

export default function SkillOrbit() {
  const { portfolio } = usePortfolio();
  const { skillsSection } = portfolio;
  const site = portfolio.site ?? { initials: "SJ" };
  const lite = useLiteMode();
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (lite) return;
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lite]);

  const orbit = skillsSection?.orbit ?? [];

  if (lite) return <StaticSkills orbit={orbit} initials={site.initials} />;

  const rings = buildRings(orbit);
  const running = inView;

  return (
    <div
      ref={rootRef}
      className="skill-orbit relative w-full aspect-square max-w-[min(92vw,280px)] sm:max-w-[320px] lg:max-w-[min(100%,360px)] lg:w-[85%] mx-auto overflow-hidden lg:overflow-visible"
      aria-label="Animated skill orbit — skills revolving around center"
    >
      {rings.map((ring) => (
        <OrbitPath key={`path-${ring.radius}`} radius={ring.radius} />
      ))}

      {rings.map((ring) => (
        <OrbitTrack key={`track-${ring.radius}`} {...ring} running={running} />
      ))}

      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`skill-orbit-sun relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full font-display font-bold text-base sm:text-lg ${running ? "" : "skill-orbit-sun--paused"}`}
        >
          <span className="skill-orbit-sun-text">{site.initials}</span>
        </div>
      </div>
    </div>
  );
}
