import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusLg } from "react-bootstrap-icons";

export const Header = ({ onAddDeal }) => {
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 w-full bg-[#0d0e12]/95 border-b-4 border-black"
    >
      <nav className="flex items-center justify-between h-20 max-w-7xl mx-auto px-6">
        <Link to="/" data-testid="logo-link" className="flex items-end gap-1.5">
          <span className="font-display font-black text-sm tracking-tighter text-white leading-none">
            COLECIONA
          </span>
          <span className="h-2 w-2 bg-brand mb-1 shrink-0" />
        </Link>

        <div className="hidden md:flex items-center gap-9">
          <a
            href="/#feed"
            data-testid="nav-deals"
            className="font-body text-xs font-bold text-neutral-300 hover:text-brand tracking-wider uppercase transition-colors"
          >
            Ofertas
          </a>
          <a
            href="/#como-funciona"
            data-testid="nav-how"
            className="font-body text-xs font-bold text-neutral-300 hover:text-brand tracking-wider uppercase transition-colors"
          >
            Como funciona
          </a>
        </div>

        <button
          onClick={onAddDeal}
          data-testid="header-add-deal-button"
          className="pixel-btn"
        >
          <PlusLg size={14} />
          <span className="hidden sm:inline">Divulgar grupo</span>
          <span className="sm:hidden">Postar</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
