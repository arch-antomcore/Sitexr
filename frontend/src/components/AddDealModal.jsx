import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowClockwise, Search, Link, XLg, Stars, CardImage } from "react-bootstrap-icons";
import { scrapeUrl, createPost } from "@/lib/api";
import { POST_CATEGORIES } from "@/lib/categories";

const empty = {
  title: "",
  image: "",
  images: [],
  group_url: "",
  current_price: "",
  original_price: "",
  category: "outros",
  description: "",
};

export const AddDealModal = ({ open, onOpenChange, onCreated }) => {
  const [form, setForm] = useState(empty);
  const [scraping, setScraping] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [fetched, setFetched] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setForm(empty);
    setFetched(false);
  };

  const handleClose = (v) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleScrape = async () => {
    if (!form.group_url.startsWith("http")) {
      toast.error("Cole um link válido do AliExpress (começando com http).");
      return;
    }
    setScraping(true);
    try {
      const data = await scrapeUrl(form.group_url);
      setForm((f) => ({
        ...f,
        title: data.title || f.title,
        image: data.image || f.image,
        images: data.images || f.images,
        current_price: data.current_price || f.current_price,
        original_price: data.original_price || f.original_price,
        category: data.category || f.category,
        description: data.description || f.description,
      }));
      setFetched(true);
      if (data.image) {
        toast.success("Imagem e dados encontrados! Confira o preço e publique.");
      } else if (data.title) {
        toast.success("Título encontrado. Adicione a imagem e o preço.");
      } else {
        toast.warning("Não consegui ler o link. Preencha manualmente abaixo.");
      }
    } catch (e) {
      toast.error("Falha ao ler o link. Preencha os campos manualmente.");
      setFetched(true);
    } finally {
      setScraping(false);
    }
  };

  const handlePublish = async () => {
    if (!form.title.trim()) return toast.error("Informe o nome do produto.");
    if (!form.group_url.startsWith("http")) return toast.error("Link do grupo inválido.");
    setPublishing(true);
    try {
      const post = await createPost(form);
      toast.success("Grupo publicado com sucesso!");
      onCreated?.(post);
      handleClose(false);
    } catch (e) {
      toast.error("Erro ao publicar. Tente novamente.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-[560px] p-0 bg-[#FDFCFC] border-0 rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] max-h-[92vh] overflow-y-auto [&>button]:hidden overflow-hidden"
        data-testid="add-deal-modal"
      >
        <DialogTitle className="sr-only">Divulgar grupo</DialogTitle>
        <DialogDescription className="sr-only">
          Cole o link do grupo do AliExpress para criar um post automaticamente.
        </DialogDescription>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-b from-brand-soft/80 to-[#FDFCFC] px-8 pt-10 pb-6 border-b border-black/[0.03]">
          {/* Decorative glowing orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 -left-10 w-40 h-40 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={() => handleClose(false)}
            className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full text-black/60 hover:text-black transition-colors"
            data-testid="close-modal-button"
          >
            <XLg size={16} strokeWidth={2.5} />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="h-14 w-14 bg-white shadow-sm border border-black/5 rounded-[18px] flex items-center justify-center text-brand mb-4 -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Stars size={24} strokeWidth={2.5} />
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink">
              Compartilhe um Achado
            </h2>
            <p className="font-body text-sm text-neutral-500 mt-2 max-w-[320px]">
              Cole o link do AliExpress e nós montamos a vitrine para o seu grupo automaticamente.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-8">
          <div className="space-y-7">
            
            {/* Search Input Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-brand transition-colors">
                <Link size={18} strokeWidth={2.5} />
              </div>
              <input
                value={form.group_url}
                onChange={(e) => set("group_url", e.target.value)}
                placeholder="https://s.click.aliexpress.com/..."
                data-testid="group-url-input"
                className="w-full h-14 pl-12 pr-[130px] bg-white border-2 border-black/5 rounded-2xl focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none text-ink font-mono text-sm transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] placeholder:text-neutral-400 placeholder:font-body"
              />
              <button
                onClick={handleScrape}
                disabled={scraping}
                data-testid="scrape-button"
                className="absolute right-1.5 top-1.5 bottom-1.5 inline-flex items-center justify-center gap-2 bg-ink text-white font-body font-bold px-6 rounded-xl hover:bg-black transition-all hover:scale-[0.98] active:scale-95 disabled:opacity-60 shadow-sm"
              >
                {scraping ? <ArrowClockwise size={16} className="animate-spin" /> : <Search size={16} strokeWidth={2.5} />}
                {scraping ? "Lendo..." : "Buscar"}
              </button>
            </div>

            <AnimatePresence>
              {fetched && (
                <motion.div
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6 pt-5 border-t border-black/5"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Image Preview */}
                    <div className="w-full sm:w-32 shrink-0 aspect-square rounded-[20px] overflow-hidden bg-neutral-50 border border-black/5 flex items-center justify-center relative group shadow-sm">
                      {form.image ? (
                        <>
                          <img src={form.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </>
                      ) : (
                        <CardImage size={24} className="text-neutral-300" />
                      )}
                    </div>
                    
                    {/* Titles & Images URL */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                          Nome do Produto
                        </label>
                        <input
                          value={form.title}
                          onChange={(e) => set("title", e.target.value)}
                          placeholder="Ex: Figure Goku Ultra Instinct 28cm"
                          className="w-full bg-neutral-50/50 border border-black/5 rounded-xl px-4 py-3 text-sm font-body font-medium text-ink focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                          URL da Imagem
                        </label>
                        <input
                          value={form.image}
                          onChange={(e) => set("image", e.target.value)}
                          placeholder="https://...jpg"
                          className="w-full bg-neutral-50/50 border border-black/5 rounded-xl px-4 py-3 text-xs font-mono text-ink focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-brand mb-1.5 ml-1">
                        Preço de Grupo
                      </label>
                      <input
                        value={form.current_price}
                        onChange={(e) => set("current_price", e.target.value)}
                        placeholder="R$89,90"
                        className="w-full bg-brand-soft/40 border border-brand/20 rounded-xl px-4 py-3 text-lg font-display font-bold text-brand focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                        Preço Original
                      </label>
                      <input
                        value={form.original_price}
                        onChange={(e) => set("original_price", e.target.value)}
                        placeholder="R$349,00"
                        className="w-full bg-neutral-50/50 border border-black/5 rounded-xl px-4 py-3 text-lg font-display text-neutral-500 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none transition-all line-through decoration-neutral-300 decoration-2 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-1">
                      Categoria
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {POST_CATEGORIES.map((c) => {
                        const Icon = c.icon;
                        const isSelected = form.category === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => set("category", c.id)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-body font-semibold transition-all hover:scale-[1.02] active:scale-95 ${
                              isSelected
                                ? "bg-ink text-white border-ink shadow-md"
                                : "bg-white border-black/5 text-neutral-600 hover:border-black/15 hover:text-ink shadow-sm"
                            }`}
                          >
                            <Icon size={14} className={isSelected ? "text-white" : "text-neutral-400"} /> 
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                      Descrição Adicional <span className="lowercase font-normal tracking-normal">(opcional)</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      rows={2}
                      placeholder="Detalhes sobre a peça, previsão de envio..."
                      className="w-full bg-neutral-50/50 border border-black/5 rounded-xl px-4 py-3 text-sm font-body text-ink focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none transition-all resize-none shadow-sm"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-3">
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-display font-bold text-lg py-4 rounded-xl hover:bg-[#d64022] transition-all disabled:opacity-60 hover:scale-[1.01] active:scale-[0.98] shadow-[0_8px_20px_-8px_rgba(229,77,46,0.6)]"
                    >
                      {publishing ? <ArrowClockwise size={20} className="animate-spin" /> : <Stars size={20} />}
                      Publicar no Mural
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealModal;
