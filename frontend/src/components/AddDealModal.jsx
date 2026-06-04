import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Search, Link2, X, Sparkles, ImageOff } from "lucide-react";
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

  const inputCls =
    "w-full bg-white border border-black/10 rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none text-ink p-3.5 font-body text-sm transition-all placeholder:text-neutral-400";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl p-0 gap-0 bg-white border border-black/10 rounded-xl shadow-2xl max-h-[92vh] overflow-y-auto [&>button]:hidden"
        data-testid="add-deal-modal"
      >
        <DialogTitle className="sr-only">Divulgar grupo</DialogTitle>
        <DialogDescription className="sr-only">
          Cole o link do grupo do AliExpress para criar um post automaticamente.
        </DialogDescription>

        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-brand-soft text-brand rounded-lg">
              <Sparkles size={17} />
            </span>
            <div>
              <h2 className="font-display font-bold text-lg tracking-tight text-ink leading-none">
                Divulgar grupo
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-1.5">
                cole o link · nós montamos o post
              </p>
            </div>
          </div>
          <button
            onClick={() => handleClose(false)}
            className="text-neutral-400 hover:text-ink transition-colors"
            data-testid="close-modal-button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <Link2 size={13} /> Link do grupo (AliExpress)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={form.group_url}
                onChange={(e) => set("group_url", e.target.value)}
                placeholder="https://s.click.aliexpress.com/..."
                data-testid="group-url-input"
                className={inputCls + " font-mono text-xs"}
              />
              <button
                onClick={handleScrape}
                disabled={scraping}
                data-testid="scrape-button"
                className="inline-flex items-center justify-center gap-2 bg-ink text-white font-body font-semibold px-5 py-3.5 rounded-lg hover:bg-black transition-colors disabled:opacity-60 shrink-0"
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
                  <div className="aspect-square bg-neutral-100 border border-black/[0.06] rounded-lg overflow-hidden flex items-center justify-center">
                    {form.image ? (
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff size={28} className="text-neutral-300" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
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
                      <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                        URL da imagem
                      </label>
                      <input
                        value={form.image}
                        onChange={(e) => set("image", e.target.value)}
                        placeholder="https://...jpg"
                        data-testid="image-input"
                        className={inputCls + " font-mono text-xs"}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-brand">
                      Preço no grupo
                    </label>
                    <input
                      value={form.current_price}
                      onChange={(e) => set("current_price", e.target.value)}
                      placeholder="R$89,90"
                      data-testid="current-price-input"
                      className={inputCls + " font-display font-bold"}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      Preço sem grupo
                    </label>
                    <input
                      value={form.original_price}
                      onChange={(e) => set("original_price", e.target.value)}
                      placeholder="R$349,00"
                      data-testid="original-price-input"
                      className={inputCls + " font-display"}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
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
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-body transition-colors ${
                            form.category === c.id
                              ? "bg-ink text-white border-ink font-semibold"
                              : "border-black/10 text-neutral-600 hover:text-ink"
                          }`}
                        >
                          <Icon size={13} /> {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-body font-bold py-4 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 active:scale-[0.99]"
                >
                  {publishing && <Loader2 size={16} className="animate-spin" />}
                  Publicar grupo
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!fetched && (
            <p className="font-body text-sm text-neutral-500 leading-relaxed">
              Cole o link de compra em grupo do AliExpress e clique em <b className="text-ink">Buscar</b>.
              Buscamos a imagem e o nome automaticamente — você confere o preço e publica.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealModal;
