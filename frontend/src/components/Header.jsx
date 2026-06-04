import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Boxes, Plus } from "lucide-react";

export const Header = ({ onAddDeal }) => {
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-ink/80 border-b border-white/10"
      data-testid="site-header"
    >
      <nav className="flex items-center justify-between h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
          <span className="relative flex h-9 w-9 items-center justify-center bg-cyber-yellow text-ink">
            <Boxes size={20} strokeWidth={2.5} />
            <span className="absolute -right-1 -top-1 h-2 w-2 bg-cyber-cyan animate-pulse-glow" />
          </span>
          <div className="leading-none">
            <span className="font-display font-900 text-lg tracking-tighter">COLECIONA</span>
            <span className="block font-mono text-[10px] text-cyber-cyan tracking-[0.3em] mt-0.5">
              GRUPO · ALIEXPRESS
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-body text-sm text-zinc-400">
          <a href="#feed" className="hover:text-white transition-colors" data-testid="nav-deals">
            Ofertas
          </a>
          <a href="#como-funciona" className="hover:text-white transition-colors" data-testid="nav-how">
            Como funciona
          </a>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAddDeal}
          data-testid="header-add-deal-button"
          className="inline-flex items-center gap-2 bg-cyber-yellow text-ink font-body font-semibold text-sm px-4 sm:px-5 py-2.5 uppercase tracking-wider hover:bg-white transition-colors"
        >
          <Plus size={16} strokeWidth={3} />
          <span className="hidden sm:inline">Divulgar grupo</span>
          <span className="sm:hidden">Postar</span>
        </motion.button>
      </nav>
    </header>
  );
};

export default Header;
