import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PackageOpen, Search, Loader2, HelpCircle, Users, Link2, Tag } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CategoryFilter from "@/components/CategoryFilter";
import DealCard from "@/components/DealCard";
import AddDealModal from "@/components/AddDealModal";
import { fetchPosts, fetchStats } from "@/lib/api";

const STEPS = [
  {
    icon: Link2,
    title: "Cole o link",
    desc: "Pegue o link de compra em grupo do seu produto no AliExpress e cole aqui.",
  },
  {
    icon: Tag,
    title: "Vira um post",
    desc: "Montamos automaticamente o card com imagem, nome e preço de grupo.",
  },
  {
    icon: Users,
    title: "Junte 3+ pessoas",
    desc: "A comunidade entra no seu grupo e todos pagam o preço promocional.",
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

  return (
    <div className="relative min-h-screen bg-ink text-white overflow-x-hidden">
      <Header onAddDeal={() => setModalOpen(true)} />
      <Hero stats={stats} onAddDeal={() => setModalOpen(true)} />

      {/* Feed */}
      <main id="feed" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display font-900 tracking-tighter text-3xl sm:text-4xl">
              Grupos disponíveis
            </h2>
            <p className="font-mono text-xs text-zinc-500 tracking-wider mt-2">
              {posts.length} {posts.length === 1 ? "PRODUTO" : "PRODUTOS"} · ATUALIZADO AGORA
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar produto..."
              data-testid="search-input"
              className="w-full bg-black/40 border border-white/15 focus:border-cyber-cyan focus:outline-none text-white pl-9 pr-3 py-3 font-body text-sm transition-colors placeholder:text-zinc-600"
            />
          </div>
        </div>

        <CategoryFilter active={category} onChange={setCategory} sort={sort} onSortChange={setSort} />

        <div className="mt-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
              <Loader2 size={32} className="animate-spin text-cyber-cyan" />
              <p className="font-mono text-xs tracking-wider mt-4">CARREGANDO GRUPOS...</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 border border-dashed border-white/15 text-center px-6"
              data-testid="empty-state"
            >
              <PackageOpen size={44} className="text-zinc-600 mb-5" />
              <h3 className="font-display font-700 text-xl">Nenhum grupo por aqui ainda</h3>
              <p className="font-body text-zinc-500 text-sm max-w-sm mt-2">
                Seja o primeiro a divulgar um grupo de figures ou miniaturas nesta categoria.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                data-testid="empty-add-deal-button"
                className="mt-6 bg-cyber-yellow text-ink font-body font-bold py-3 px-7 uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Divulgar grupo
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {posts.map((post, i) => (
                <DealCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* How it works */}
      <section id="como-funciona" className="relative z-10 border-t border-white/10 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-10">
            <HelpCircle size={18} className="text-cyber-cyan" />
            <h2 className="font-display font-700 text-2xl tracking-tight">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-ink p-8">
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex h-11 w-11 items-center justify-center border border-white/15 text-cyber-yellow">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono-data text-4xl font-bold text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-700 text-lg mb-2">{s.title}</h3>
                  <p className="font-body text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <AddDealModal open={modalOpen} onOpenChange={setModalOpen} onCreated={handleCreated} />
    </div>
  );
}
