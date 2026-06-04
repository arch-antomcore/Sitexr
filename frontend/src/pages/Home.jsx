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
import FAQAccordion from "@/components/FAQAccordion";
import { fetchPosts, fetchStats } from "@/lib/api";

const STEPS = [
  {
    icon: Link,
    title: "COLE O LINK",
    desc: "Pegue o link de compra em grupo do produto no AliExpress e cole na plataforma.",
  },
  {
    icon: Tag,
    title: "VIRA UM POST",
    desc: "Buscamos a imagem e o nome automaticamente e montamos o card da oferta.",
  },
  {
    icon: People,
    title: "JUNTE 3+ PESSOAS",
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
    <div className="relative min-h-screen bg-[#0d0e12] text-white overflow-x-hidden">
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
            <h2 className="font-display text-sm sm:text-base tracking-tighter text-white uppercase">
              Acervo disponível
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mt-2">
              {posts.length} {posts.length === 1 ? "produto" : "produtos"} · atualizado agora
            </p>
          </div>

          <div className="relative w-full md:w-72 font-mono">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar produto..."
              data-testid="search-input"
              className="w-full bg-[#181822] border-4 border-black focus:border-brand focus:outline-none text-white pl-10 pr-4 py-3 font-body text-xs shadow-[2px_2px_0px_#000000] placeholder:text-neutral-500"
            />
          </div>
        </div>

        <CategoryFilter active={category} onChange={setCategory} sort={sort} onSortChange={setSort} />

        <div className="mt-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-500">
              <ArrowClockwise size={32} className="animate-spin text-brand" />
              <p className="font-mono text-[10px] uppercase tracking-wider mt-4">carregando acervo...</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 bg-[#181822] border-4 border-dashed border-black text-center px-6 shadow-[4px_4px_0px_#000000]"
              data-testid="empty-state"
            >
              <BoxSeam size={40} className="text-neutral-600 mb-5" />
              <h3 className="font-display text-xs sm:text-sm text-white uppercase">Nenhum grupo por aqui ainda</h3>
              <p className="font-body text-neutral-400 text-xs max-w-sm mt-3">
                Seja o primeiro a divulgar um grupo de figures ou miniaturas nesta categoria.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                data-testid="empty-add-deal-button"
                className="mt-6 pixel-btn"
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
      <section id="como-funciona" className="relative border-t-4 border-black bg-[#181822] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-10">
            <span className="h-2.5 w-2.5 bg-brand shrink-0" />
            <h2 className="font-display text-xs sm:text-sm tracking-tight text-white uppercase">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="bg-[#0d0e12] border-4 border-black p-8 shadow-[4px_4px_0px_#000000] hover:border-brand transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#ff4d4d]/10 text-brand shadow-[2px_2px_0px_#000000]">
                        <Icon size={16} />
                      </span>
                      <span className="font-display text-base text-neutral-800">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-[10px] text-white uppercase mb-3 leading-normal">{s.title}</h3>
                    <p className="font-body text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Block */}
      <FAQAccordion />

      {/* Footer banner ad */}
      <div className="px-6 bg-[#0d0e12] pt-8">
        <AdSlot variant="footer" className="mt-8 mb-12" />
      </div>

      <Footer />

      <AddDealModal open={modalOpen} onOpenChange={setModalOpen} onCreated={handleCreated} />
    </div>
  );
}
