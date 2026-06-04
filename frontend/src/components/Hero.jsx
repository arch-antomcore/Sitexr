import { motion } from "framer-motion";
import { ArrowDown, Users, Zap } from "lucide-react";

const TICKER = [
  "FIGURES", "DIE-CAST 1:18", "ANIME STATUES", "HOT COLLECTIBLES",
  "CARRINHOS 1:64", "MODEL KITS", "GUNDAM", "RETRO GAMES",
];

export const Hero = ({ stats, onAddDeal }) => {
  return (
    <section className="relative overflow-hidden border-b border-white/10 grid-lines">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyber-cyan/10 blur-[120px]" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-cyber-yellow/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.03] px-3 py-1.5 mb-8"
        >
          <Zap size={13} className="text-cyber-cyan" />
          <span className="font-mono text-[11px] tracking-[0.25em] text-zinc-300">
            COMPRA EM GRUPO · A PARTIR DE 3 PESSOAS
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display font-900 tracking-tighter text-4xl sm:text-5xl lg:text-7xl leading-[0.95]"
            >
              Junte a galera.
              <br />
              <span className="text-cyber-yellow">Colecione</span> pagando
              <br />
              <span className="relative inline-block">
                muito menos.
                <span className="absolute left-0 -bottom-2 h-1.5 w-full bg-cyber-cyan/70" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-zinc-400 text-base md:text-lg max-w-xl mt-8 leading-relaxed"
            >
              A central de <span className="text-white">compra em grupo do AliExpress</span> só
              para colecionadores. Figures, estátuas, miniaturas e die-cast — cole o link do seu
              grupo e desbloqueie o preço de grupo com a comunidade.
            </motion.p>
          </div>

          <div className="md:col-span-4 flex md:justify-end">
            <div className="flex gap-px bg-white/10 border border-white/10">
              <div className="bg-ink px-6 py-5 text-center">
                <div className="font-mono-data text-3xl font-bold text-cyber-yellow">
                  {stats?.groups ?? "—"}
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 mt-1">
                  GRUPOS
                </div>
              </div>
              <div className="bg-ink px-6 py-5 text-center">
                <div className="font-mono-data text-3xl font-bold text-cyber-cyan flex items-center gap-1 justify-center">
                  <Users size={22} /> 3+
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 mt-1">
                  P/ DESCONTO
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 mt-12"
        >
          <button
            onClick={onAddDeal}
            data-testid="hero-add-deal-button"
            className="bg-cyber-yellow text-ink font-body font-bold py-4 px-8 uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            Divulgar meu grupo
          </button>
          <a
            href="#feed"
            className="inline-flex items-center gap-2 border border-white/20 text-white font-body py-4 px-6 text-sm hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
          >
            Ver ofertas <ArrowDown size={16} />
          </a>
        </motion.div>
      </div>

      {/* Marquee ticker */}
      <div className="relative border-t border-white/10 bg-cyber-yellow text-ink overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-2.5">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="font-mono text-xs font-bold tracking-[0.3em] mx-6 flex items-center">
              {t} <span className="ml-12 opacity-40">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
