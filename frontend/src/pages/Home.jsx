import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BoxSeam, Search, ArrowClockwise, Link, Tag, People } from "react-bootstrap-icons";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CategoryFilter from "@/components/CategoryFilter";
import DealCard from "@/components/DealCard";
import AddDealModal from "@/components/AddDealModal";
import AdSlot from "@/components/AdSlot";
import { fetchPosts, fetchStats } from "@/lib/api";

const STEPS = [
  {
    icon: Link,
    title: "Cole o link",
    desc: "Pegue o link de compra em grupo do produto no AliExpress e cole na plataforma.",
  },
  {
    icon: Tag,
    title: "Vira um post",
    desc: "Buscamos a imagem e o nome automaticamente e montamos o card da oferta.",
  },
  {
    icon: People,
    title: "Junte 3+ pessoas",
    desc: "A comunidade entra no seu grupo e todos garantem o preço promocional.",
  },
];

export default function Home() {
  const qc = useQueryClient();
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("recent");
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", category, sort, q],
    queryFn: () => fetchPosts({ category, sort, q }),
  });

  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

  const handleCreated = () => {
    qc.invalidateQueries({ queryKey: ["posts"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
  };

  // Interleave a native ad every 6 cards.
  const feedItems = [];
  posts.forEach((p, i) => {
    feedItems.push({ type: "post", post: p, idx: i });
    if ((i + 1) % 6 === 0 && i !== posts.length - 1) {
      feedItems.push({ type: "ad", idx: `ad-${i}` });
    }
  });

  return (
    <div className="relative min-h-screen bg-paper text-ink overflow-x-hidden">
      <Header onAddDeal={() => setModalOpen(true)} />

      {/* Leaderboard ad */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <AdSlot variant="leaderboard" />
      </div>

      <Hero stats={stats} onAddDeal={() => setModalOpen(true)} />

      {/* Feed */}
      <main id="feed" className="relative z-10 max-w-7xl mx-auto px-6 py-14 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display font-black tracking-tighter text-3xl sm:text-4xl text-ink">
              Acervo disponível
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-500 mt-2">
              {posts.length} {posts.length === 1 ? "produto" : "produtos"} · atualizado agora
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar produto..."
              data-testid="search-input"
              className="w-full bg-white border border-black/10 rounded-full focus:border-brand focus:ring-2 focus:ring-brand/15 focus:outline-none text-ink pl-10 pr-4 py-3 font-body text-sm transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        <CategoryFilter active={category} onChange={setCategory} sort={sort} onSortChange={setSort} />

        <div className="mt-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
              <ArrowClockwise size={32} className="animate-spin text-brand" />
              <p className="font-mono text-xs uppercase tracking-[0.15em] mt-4">carregando acervo...</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-black/15 rounded-xl text-center px-6"
              data-testid="empty-state"
            >
              <BoxSeam size={44} className="text-neutral-300 mb-5" />
              <h3 className="font-display font-bold text-xl text-ink">Nenhum grupo por aqui ainda</h3>
              <p className="font-body text-neutral-500 text-sm max-w-sm mt-2">
                Seja o primeiro a divulgar um grupo de figures ou miniaturas nesta categoria.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                data-testid="empty-add-deal-button"
                className="mt-6 bg-brand text-white font-body font-semibold py-3 px-7 rounded-full hover:bg-brand-dark transition-colors"
              >
                Divulgar grupo
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {feedItems.map((item) =>
                item.type === "ad" ? (
                  <AdSlot key={item.idx} variant="native" />
                ) : (
                  <DealCard key={item.post.id} post={item.post} index={item.idx} />
                )
              )}
            </div>
          )}
        </div>
      </main>

      {/* How it works */}
      <section id="como-funciona" className="relative border-t border-black/[0.08] bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <h2 className="font-display font-bold text-2xl tracking-tight text-ink">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="bg-paper border border-black/[0.08] rounded-xl p-8 hover:border-ink/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <Icon size={20} />
                    </span>
                    <span className="font-display font-black text-4xl text-neutral-200">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink mb-2">{s.title}</h3>
                  <p className="font-body text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer banner ad */}
      <div className="px-6">
        <AdSlot variant="footer" className="mt-20 mb-12" />
      </div>

      <Footer />

      <AddDealModal open={modalOpen} onOpenChange={setModalOpen} onCreated={handleCreated} />
    </div>
  );
}
