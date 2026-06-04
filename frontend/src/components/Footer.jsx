import { Boxes } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-20" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center bg-cyber-yellow text-ink">
              <Boxes size={18} strokeWidth={2.5} />
            </span>
            <div className="leading-none">
              <span className="font-display font-900 tracking-tighter">COLECIONA</span>
              <p className="font-mono text-[10px] text-zinc-500 tracking-wider mt-1">
                COMPRA EM GRUPO PARA COLECIONADORES
              </p>
            </div>
          </div>
          <p className="font-body text-xs text-zinc-500 max-w-md leading-relaxed">
            Comunidade independente de divulgação de grupos do AliExpress. As compras são feitas
            no próprio AliExpress, com a segurança da plataforma. Não cobramos nada a mais.
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 font-mono text-[10px] text-zinc-600 tracking-wider">
          © {new Date().getFullYear()} COLECIONA · FEITO PARA QUEM COLECIONA
        </div>
      </div>
    </footer>
  );
};

export default Footer;
