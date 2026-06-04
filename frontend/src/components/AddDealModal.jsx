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
        className="max-w-[560px] p-0 bg-[#181822] border-4 border-black shadow-[8px_8px_0px_#000000] max-h-[92vh] overflow-y-auto [&>button]:hidden overflow-hidden"
        data-testid="add-deal-modal"
      >
        <DialogTitle className="sr-only">Divulgar grupo</DialogTitle>
        <DialogDescription className="sr-only">
          Cole o link do grupo do AliExpress para criar um post automaticamente.
        </DialogDescription>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-[#1f1f2e] px-8 pt-10 pb-6 border-b-4 border-black">
          {/* Decorative glowing orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 -left-10 w-40 h-40 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={() => handleClose(false)}
            className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center bg-black border-2 border-brand text-brand hover:bg-brand hover:text-black transition-colors"
            data-testid="close-modal-button"
          >
            <XLg size={14} />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-black border-2 border-brand flex items-center justify-center text-brand mb-4 -rotate-3 hover:rotate-0 transition-transform duration-300 shadow-[2px_2px_0px_#000000]">
              <Stars size={20} />
            </div>
            <h2 className="font-display text-xs sm:text-sm text-white uppercase tracking-wider">
              Compartilhe um Achado
            </h2>
            <p className="font-body text-xs text-neutral-400 mt-2 max-w-[340px]">
              Cole o link do AliExpress e nós montamos a vitrine para o seu grupo automaticamente.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-8 bg-[#181822]">
          <div className="space-y-7">
            
            {/* Search Input Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-brand transition-colors">
                <Link size={18} />
              </div>
              <input
                value={form.group_url}
                onChange={(e) => set("group_url", e.target.value)}
                placeholder="https://s.click.aliexpress.com/..."
                data-testid="group-url-input"
                className="w-full h-14 pl-12 pr-[130px] bg-[#0d0e12] border-4 border-black text-white focus:border-brand focus:outline-none font-mono text-xs shadow-[2px_2px_0px_#000000] placeholder:text-neutral-500"
              />
              <button
                onClick={handleScrape}
                disabled={scraping}
                data-testid="scrape-button"
                className="absolute right-2 top-2 bottom-2 inline-flex items-center justify-center gap-2 bg-brand border-2 border-black text-white font-mono text-[9px] uppercase px-4 hover:bg-brand-dark active:translate-y-0.5 disabled:opacity-60 shadow-[2px_2px_0px_#000000]"
              >
                {scraping ? <ArrowClockwise size={12} className="animate-spin" /> : <Search size={12} />}
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
                  className="space-y-6 pt-5 border-t-4 border-black"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Image Preview */}
                    <div className="w-full sm:w-32 shrink-0 aspect-square bg-[#0d0e12] border-4 border-black flex items-center justify-center relative group shadow-[2px_2px_0px_#000000]">
                      {form.image ? (
                        <>
                          <img src={form.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pixelated" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </>
                      ) : (
                        <CardImage size={24} className="text-neutral-500" />
                      )}
                    </div>
                    
                    {/* Titles & Images URL */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                          Nome do Produto
                        </label>
                        <input
                          value={form.title}
                          onChange={(e) => set("title", e.target.value)}
                          placeholder="Ex: Figure Goku Ultra Instinct 28cm"
                          className="w-full bg-[#0d0e12] border-2 border-black px-4 py-3 text-xs font-body font-medium text-white focus:border-brand focus:outline-none shadow-[2px_2px_0px_#000000] placeholder:text-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                          URL da Imagem
                        </label>
                        <input
                          value={form.image}
                          onChange={(e) => set("image", e.target.value)}
                          placeholder="https://...jpg"
                          className="w-full bg-[#0d0e12] border-2 border-black px-4 py-3 text-[10px] font-mono text-white focus:border-brand focus:outline-none shadow-[2px_2px_0px_#000000] placeholder:text-neutral-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block font-mono text-[9px] font-bold uppercase tracking-widest text-brand mb-1.5 ml-1">
                        Preço de Grupo
                      </label>
                      <input
                        value={form.current_price}
                        onChange={(e) => set("current_price", e.target.value)}
                        placeholder="R$89,90"
                        className="w-full bg-[#0d0e12] border-2 border-black px-4 py-3 text-sm font-mono text-[#00ff66] focus:border-brand focus:outline-none shadow-[2px_2px_0px_#000000] placeholder:text-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                        Preço Original
                      </label>
                      <input
                        value={form.original_price}
                        onChange={(e) => set("original_price", e.target.value)}
                        placeholder="R$349,00"
                        className="w-full bg-[#0d0e12] border-2 border-black px-4 py-3 text-sm font-mono text-neutral-400 focus:border-brand focus:outline-none shadow-[2px_2px_0px_#000000] line-through placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-1">
                      Categoria
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {POST_CATEGORIES.map((c) => {
                        const Icon = c.icon;
                        const isSelected = form.category === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => set("category", c.id)}
                            className={`inline-flex items-center gap-1.5 border-2 border-black px-3 py-2.5 text-[10px] font-mono uppercase tracking-wider transition-all active:translate-y-0.5 ${
                              isSelected
                                ? "bg-brand text-white shadow-[2px_2px_0px_#000000]"
                                : "bg-[#0d0e12] text-neutral-400 hover:border-brand shadow-[2px_2px_0px_#000000]"
                            }`}
                          >
                            <Icon size={13} className={isSelected ? "text-white" : "text-neutral-400"} /> 
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5 ml-1">
                      Descrição Adicional <span className="lowercase font-normal tracking-normal text-neutral-500">(opcional)</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      rows={2}
                      placeholder="Detalhes sobre a peça, previsão de envio..."
                      className="w-full bg-[#0d0e12] border-2 border-black px-4 py-3 text-xs font-body text-white focus:border-brand focus:outline-none resize-none shadow-[2px_2px_0px_#000000] placeholder:text-neutral-500"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-3">
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="w-full pixel-btn"
                    >
                      {publishing ? <ArrowClockwise size={16} className="animate-spin" /> : <Stars size={16} />}
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
