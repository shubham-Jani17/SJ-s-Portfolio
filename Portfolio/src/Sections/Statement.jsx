import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import GradientTitle from "../Components/GradientTitle";

export default function Statement() {
  const { portfolio } = usePortfolio();
  const { statement } = portfolio;

  return (
    <section className="page-container section-pad-tight relative">
      <motion.h2
        className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] sm:leading-[1.05] max-w-4xl text-balance"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <GradientTitle parts={statement.title} />
      </motion.h2>
      <motion.p
        className="mt-4 md:mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        {statement.subtitle}
      </motion.p>
    </section>
  );
}
