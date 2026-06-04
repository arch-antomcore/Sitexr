export const Footer = () => {
  return (
    <footer className="border-t border-black/[0.08] bg-white" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-end gap-1.5">
            <span className="font-display font-black text-xl tracking-tighter text-ink leading-none">
              COLECIONA
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand mb-1" />
          </div>
          <p className="font-body text-sm text-neutral-500 max-w-md leading-relaxed">
            Comunidade independente de divulgação de grupos do AliExpress para colecionadores. As
            compras são feitas no próprio AliExpress, com a segurança da plataforma.
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            © {new Date().getFullYear()} Coleciona · feito para quem coleciona
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            Figures · Carrinhos · Anime · Games
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
