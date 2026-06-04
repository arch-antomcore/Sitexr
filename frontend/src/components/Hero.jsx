import { motion } from "framer-motion";
import { ArrowRight, Users, Sparkle } from "lucide-react";

const SHOWCASE = {
  figure:
    "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwzfHxhY3Rpb24lMjBmaWd1cmUlMjB0b3klMjBwaG90b2dyYXBoeXxlbnwwfHx8fDE3ODA1ODc3OTF8MA&ixlib=rb-4.1.0&q=85",
  car:
    "https://images.unsplash.com/photo-1567643858189-ea55265faa2f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxkaWUlMjBjYXN0JTIwbW9kZWwlMjBjYXIlMjBwaG90b2dyYXBoeXxlbnwwfHx8fDE3ODA1ODc3OTF8MA&ixlib=rb-4.1.0&q=85",
  anime:
    "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxhbmltZSUyMHN0YXR1ZSUyMGZpZ3VyZSUyMGRpc3BsYXl8ZW58MHx8fHwxNzgwNTg3NzkxfDA&ixlib=rb-4.1.0&q=85",
};

const Case = ({ src, caption, className = "", delay = 0 }) => (
  <motion.figure
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`relative bg-white border border-black/[0.08] rounded-xl overflow-hidden shadow-sm group ${className}`}
  >
    <img
      src={src}
      alt={caption}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
        {caption}
      </span>
    </figcaption>
  </motion.figure>
);

export const Hero = ({ stats, onAddDeal }) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-7"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Compra em grupo · AliExpress · 3+ pessoas
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter text-ink"
            >
              Peças de coleção
              <br />
              no <span className="text-brand">preço de grupo</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-neutral-600 text-base md:text-lg max-w-xl mt-7 leading-relaxed"
            >
              A vitrine de <span className="text-ink font-medium">compra em grupo</span> só para
              colecionadores. Figures, estátuas de anime, miniaturas e die-cast — cole o link do
              seu grupo e desbloqueie o desconto com a comunidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mt-9"
            >
              <button
                onClick={onAddDeal}
                data-testid="hero-add-deal-button"
                className="inline-flex items-center gap-2 bg-brand text-white font-body font-semibold py-3.5 px-7 rounded-full hover:bg-brand-dark transition-all active:scale-95"
              >
                Divulgar meu grupo <ArrowRight size={17} />
              </button>
              <a
                href="#feed"
                className="inline-flex items-center gap-2 border border-black/15 text-ink font-body font-medium py-3.5 px-6 rounded-full hover:border-ink hover:bg-white transition-colors"
              >
                Ver acervo
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-8 mt-12"
            >
              <div>
                <div className="font-display font-black text-3xl text-ink">
                  {stats?.groups ?? "—"}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 mt-1">
                  grupos ativos
                </div>
              </div>
              <div className="h-10 w-px bg-black/10" />
              <div>
                <div className="font-display font-black text-3xl text-ink flex items-center gap-2">
                  <Users size={24} className="text-brand" /> 3+
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 mt-1">
                  p/ liberar desconto
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — bento showcase */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[360px] md:h-[460px]">
              <Case src={SHOWCASE.figure} caption="Figure · Anime" className="row-span-2" delay={0.15} />
              <Case src={SHOWCASE.car} caption="Die-cast · 1:18" delay={0.25} />
              <Case src={SHOWCASE.anime} caption="Estátua · Colecionável" delay={0.35} />
            </div>
            <div className="hidden md:flex items-center gap-2 justify-end mt-4 text-neutral-400">
              <Sparkle size={13} className="text-brand" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                acervo curado da comunidade
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
