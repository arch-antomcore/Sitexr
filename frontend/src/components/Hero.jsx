import { motion } from "framer-motion";
import { ArrowRight, People } from "react-bootstrap-icons";

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
    className={`relative bg-[#181822] border-4 border-black shadow-[4px_4px_0px_#000000] overflow-hidden group ${className}`}
  >
    <img
      src={src}
      alt={caption}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pixelated"
    />
    <figcaption className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 border-t-2 border-black">
      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-white">
        {caption}
      </span>
    </figcaption>
  </motion.figure>
);

export const Hero = ({ stats, onAddDeal }) => {
  return (
    <section className="relative overflow-hidden bg-[#0d0e12] py-8 border-b-4 border-black">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="h-2.5 w-2.5 bg-brand" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand font-bold">
                COMPRA EM GRUPO · AliExpress · 3+ PESSOAS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white leading-tight uppercase"
            >
              Peças de coleção<br />
              no <span className="text-brand">preço de grupo</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-neutral-400 text-xs sm:text-sm max-w-xl mt-6 leading-relaxed"
            >
              A vitrine de <span className="text-white font-bold">compra em grupo</span> para
              colecionadores. Figures, estátuas de anime, miniaturas e die-cast — cole o link do
              seu grupo e desbloqueie o desconto com a comunidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <button
                onClick={onAddDeal}
                data-testid="hero-add-deal-button"
                className="pixel-btn"
              >
                DIVULGAR GRUPO <ArrowRight size={14} />
              </button>
              <a
                href="#feed"
                className="pixel-btn"
                style={{ "--pixel-btn-bg": "#252535", "--pixel-btn-text": "#ffffff" }}
              >
                VER ACERVO
              </a>
            </motion.div>

            {/* Retro HUD Stats Panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 inline-flex items-center gap-6 bg-[#181822] border-4 border-black p-5 shadow-[4px_4px_0px_#000000]"
            >
              <div>
                <div className="font-display text-base text-[#00ff66]">
                  {stats?.groups ?? "00"}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-1">
                  grupos ativos
                </div>
              </div>
              <div className="h-8 w-1 bg-black" />
              <div>
                <div className="font-display text-base text-brand flex items-center gap-1.5">
                  <People size={14} /> 3+
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-1">
                  p/ liberar desc.
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
            <div className="hidden md:flex items-center gap-2 justify-end mt-4 text-neutral-500">
              <span className="font-mono text-[9px] uppercase tracking-widest">
                [ acervo curado da comunidade ]
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
