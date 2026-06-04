import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export const Header = ({ onAddDeal }) => {
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.08]"
    >
      <nav className="flex items-center justify-between h-20 max-w-7xl mx-auto px-6">
        <Link to="/" data-testid="logo-link" className="flex items-end gap-1.5">
          <span className="font-display font-black text-2xl tracking-tighter text-ink leading-none">
            COLECIONA
          </span>
          <span className="h-2 w-2 rounded-full bg-brand mb-1" />
        </Link>

        <div className="hidden md:flex items-center gap-9">
          <a
            href="/#feed"
            data-testid="nav-deals"
            className="font-body text-sm font-medium text-neutral-700 hover:text-brand transition-colors"
          >
            Ofertas
          </a>
          <a
            href="/#como-funciona"
            data-testid="nav-how"
            className="font-body text-sm font-medium text-neutral-700 hover:text-brand transition-colors"
          >
            Como funciona
          </a>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddDeal}
          data-testid="header-add-deal-button"
          className="inline-flex items-center gap-2 bg-brand text-white font-body font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-brand-dark transition-colors active:scale-95"
        >
          <Plus size={16} strokeWidth={2.75} />
          <span className="hidden sm:inline">Divulgar grupo</span>
          <span className="sm:hidden">Postar</span>
        </motion.button>
      </nav>
    </header>
  );
};

export default Header;
