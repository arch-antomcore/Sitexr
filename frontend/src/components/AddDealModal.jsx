import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Search, Link2, X, Sparkles, ImageOff } from "lucide-react";
import { scrapeUrl, createPost } from "@/lib/api";
import { POST_CATEGORIES } from "@/lib/categories";

const empty = {
  title: "",
  image: "",
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
        current_price: data.current_price || f.current_price,
        original_price: data.original_price || f.original_price,
        category: data.category || f.category,
        description: data.description || f.description,
      }));
      setFetched(true);
      if (data.title || data.image) {
        toast.success("Dados encontrados! Revise e publique.");
      } else {
        toast.warning("Não consegui ler tudo. Preencha manualmente abaixo.");
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
      toast.success("Grupo publicado com sucesso! 🎉");
      onCreated?.(post);
      handleClose(false);
    } catch (e) {
      toast.error("Erro ao publicar. Tente novamente.");
    } finally {
      setPublishing(false);
    }
  };

  const inputCls =
    "w-full bg-black/50 border border-white/15 focus:border-cyber-cyan focus:outline-none text-white p-3.5 font-body text-sm transition-colors placeholder:text-zinc-600";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 bg-surface border border-white/15 max-h-[92vh] overflow-y-auto [&>button]:hidden"
        data-testid="add-deal-modal"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sticky top-0 bg-surface z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center bg-cyber-yellow text-ink">
              <Sparkles size={16} />
            </span>
            <div>
              <h2 className="font-display font-700 text-base tracking-tight">Divulgar grupo</h2>
              <p className="font-mono text-[10px] text-zinc-500 tracking-wider">
                COLE O LINK · NÓS MONTAMOS O POST
              </p>
            </div>
          </div>
          <button
            onClick={() => handleClose(false)}
            className="text-zinc-500 hover:text-white transition-colors"
            data-testid="close-modal-button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Link input + scrape */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] text-zinc-400 tracking-wider uppercase flex items-center gap-2">
              <Link2 size={13} /> Link do grupo (AliExpress)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={form.group_url}
                onChange={(e) => set("group_url", e.target.value)}
                placeholder="https://s.click.aliexpress.com/..."
                data-testid="group-url-input"
                className={inputCls + " font-mono-data text-xs"}
              />
              <button
                onClick={handleScrape}
                disabled={scraping}
                data-testid="scrape-button"
                className="inline-flex items-center justify-center gap-2 bg-cyber-cyan text-ink font-body font-semibold px-5 py-3.5 text-sm hover:bg-white transition-colors disabled:opacity-60 shrink-0"
              >
                {scraping ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {scraping ? "Lendo..." : "Buscar"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {fetched && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
                  <div className="aspect-square bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center">
                    {form.image ? (
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff size={28} className="text-zinc-700" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
                        Nome do produto
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder="Ex: Figure Goku Ultra Instinct 28cm"
                        data-testid="title-input"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
                        URL da imagem
                      </label>
                      <input
                        value={form.image}
                        onChange={(e) => set("image", e.target.value)}
                        placeholder="https://...jpg"
                        data-testid="image-input"
                        className={inputCls + " font-mono-data text-xs"}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-cyber-yellow tracking-wider uppercase">
                      Preço no grupo
                    </label>
                    <input
                      value={form.current_price}
                      onChange={(e) => set("current_price", e.target.value)}
                      placeholder="R$89,90"
                      data-testid="current-price-input"
                      className={inputCls + " font-mono-data"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
                      Preço sem grupo
                    </label>
                    <input
                      value={form.original_price}
                      onChange={(e) => set("original_price", e.target.value)}
                      placeholder="R$349,00"
                      data-testid="original-price-input"
                      className={inputCls + " font-mono-data"}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
                    Categoria
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {POST_CATEGORIES.map((c) => {
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.id}
                          onClick={() => set("category", c.id)}
                          data-testid={`select-category-${c.id}`}
                          className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-body transition-colors ${
                            form.category === c.id
                              ? "bg-white text-ink border-white font-semibold"
                              : "border-white/15 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Icon size={13} /> {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={2}
                    placeholder="Detalhes do produto, altura, material..."
                    data-testid="description-input"
                    className={inputCls + " resize-none"}
                  />
                </div>

                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  data-testid="publish-button"
                  className="w-full inline-flex items-center justify-center gap-2 bg-cyber-yellow text-ink font-body font-bold py-4 uppercase tracking-widest text-sm hover:bg-white transition-colors disabled:opacity-60"
                >
                  {publishing && <Loader2 size={16} className="animate-spin" />}
                  Publicar grupo
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!fetched && (
            <p className="font-body text-xs text-zinc-500 leading-relaxed">
              Cole o link de compra em grupo do AliExpress e clique em <b>Buscar</b>. Tentamos
              extrair imagem, nome e preço automaticamente — você pode editar tudo antes de publicar.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealModal;
