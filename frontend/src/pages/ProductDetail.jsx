import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft, Heart, Users, ExternalLink, ShieldCheck, Loader2, ImageOff, Tag,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddDealModal from "@/components/AddDealModal";
import { fetchPost, joinGroup, likePost } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [joined, setJoined] = useState(0);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  });

  useEffect(() => {
    if (post) {
      setLikes(post.likes || 0);
      setJoined(post.joined_count || 0);
    }
  }, [post]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    try {
      await likePost(id);
    } catch {
      setLikes((n) => n - 1);
      setLiked(false);
    }
  };

  const handleJoin = async () => {
    if (!post?.group_url) return;
    setJoined((n) => n + 1);
    try {
      await joinGroup(id);
    } catch {
      /* non-blocking */
    }
    toast.success("Abrindo o grupo no AliExpress...");
    window.open(post.group_url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cyber-cyan" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-ink text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display font-700 text-2xl">Grupo não encontrado</p>
        <Link to="/" className="text-cyber-cyan font-body underline">
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-ink text-white">
      <Header onAddDeal={() => setModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-body text-sm mb-8"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square bg-black/60 border border-white/10 overflow-hidden"
          >
            {post.image ? (
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                <ImageOff size={56} />
              </div>
            )}
            {post.discount ? (
              <span className="absolute top-4 right-4 bg-cyber-cyan text-ink font-mono font-bold px-3 py-1.5 text-base glow-cyan">
                -{post.discount}%
              </span>
            ) : null}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 border border-white/15 text-zinc-300 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5">
                <Tag size={12} /> {categoryLabel(post.category)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-cyber-cyan font-mono text-[10px] uppercase tracking-widest">
                <ShieldCheck size={13} /> Verificado
              </span>
            </div>

            <h1 className="font-display font-700 text-2xl md:text-3xl leading-tight tracking-tight">
              {post.title}
            </h1>

            {post.description && (
              <p className="font-body text-zinc-400 leading-relaxed mt-5 text-sm md:text-base">
                {post.description}
              </p>
            )}

            {/* Price block */}
            <div className="mt-8 border border-white/10 bg-surface p-6">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  {post.original_price && (
                    <div className="font-mono-data text-sm text-zinc-500 line-through">
                      {post.original_price}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] text-zinc-500 tracking-wider uppercase">
                      Preço de grupo
                    </span>
                  </div>
                  <div className="font-mono-data text-4xl font-bold text-cyber-yellow leading-none mt-1">
                    {post.current_price || "Ver no AliExpress"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono-data text-2xl font-bold text-white flex items-center gap-2">
                    <Users size={20} className="text-cyber-cyan" /> {joined}
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500 tracking-wider mt-1">
                    JÁ ENTRARAM
                  </div>
                </div>
              </div>

              <button
                onClick={handleJoin}
                data-testid="join-group-button"
                className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-cyber-yellow text-ink font-body font-bold py-4 uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Entrar no grupo <ExternalLink size={16} />
              </button>
              <p className="font-body text-[11px] text-zinc-500 text-center mt-3">
                Você será levado ao AliExpress com o grupo já aplicado.
              </p>
            </div>

            {/* Like */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleLike}
                data-testid="like-button"
                className={`inline-flex items-center gap-2 border px-4 py-2.5 font-body text-sm transition-colors ${
                  liked
                    ? "border-rose-500/50 text-rose-400 bg-rose-500/10"
                    : "border-white/15 text-zinc-400 hover:text-white"
                }`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likes}
              </button>
              <span className="font-mono text-[11px] text-zinc-500 tracking-wider">
                pessoas curtiram este achado
              </span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <AddDealModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
