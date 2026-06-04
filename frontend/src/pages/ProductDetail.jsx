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
import AdSlot from "@/components/AdSlot";
import { fetchPost, joinGroup, likePost } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [joined, setJoined] = useState(0);
  const [activeImg, setActiveImg] = useState(0);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
  });

  useEffect(() => {
    if (post) {
      setLikes(post.likes || 0);
      setJoined(post.joined_count || 0);
      setActiveImg(0);
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
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display font-bold text-2xl">Grupo não encontrado</p>
        <Link to="/" className="text-brand font-body underline">
          Voltar para o início
        </Link>
      </div>
    );
  }

  const gallery = (post.images && post.images.length ? post.images : post.image ? [post.image] : []);
  const mainImg = gallery[activeImg] || post.image;

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <Header onAddDeal={() => setModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <button
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-ink transition-colors font-body text-sm mb-8"
        >
          <ArrowLeft size={16} /> Voltar ao acervo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square bg-white border border-black/[0.08] rounded-xl overflow-hidden"
            >
              {mainImg ? (
                <img src={mainImg} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <ImageOff size={56} />
                </div>
              )}
              {post.discount ? (
                <span className="absolute top-4 left-4 bg-brand text-white font-body font-bold px-3 py-1.5 text-base rounded-md">
                  -{post.discount}%
                </span>
              ) : null}
            </motion.div>

            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4 flex-wrap" data-testid="gallery-thumbs">
                {gallery.slice(0, 6).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImg ? "border-brand" : "border-black/10 hover:border-black/30"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:sticky lg:top-28"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white text-neutral-600 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5">
                  <Tag size={12} /> {categoryLabel(post.category)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-mono text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={13} /> Verificado
                </span>
              </div>

              <h1 className="font-display font-black text-3xl md:text-4xl leading-[1.05] tracking-tight text-ink">
                {post.title}
              </h1>

              {post.description && (
                <p className="font-body text-neutral-600 leading-relaxed mt-5 text-sm md:text-base">
                  {post.description}
                </p>
              )}

              {/* Price block */}
              <div className="mt-8 bg-white border border-black/[0.08] rounded-xl p-6">
                <div className="flex items-end justify-between flex-wrap gap-4">
                  <div>
                    {post.original_price && (
                      <div className="font-body text-sm text-neutral-400 line-through">
                        {post.original_price}
                      </div>
                    )}
                    <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                      Preço de grupo
                    </div>
                    <div className="font-display font-black text-4xl text-ink leading-none mt-1.5">
                      {post.current_price || "Ver no AliExpress"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-2xl text-ink flex items-center gap-2">
                      <Users size={20} className="text-brand" /> {joined}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                      já entraram
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleJoin}
                  data-testid="join-group-button"
                  className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-brand text-white font-body font-bold py-4 rounded-lg hover:bg-brand-dark transition-colors active:scale-[0.99]"
                >
                  Entrar no grupo <ExternalLink size={16} />
                </button>
                <p className="font-body text-[12px] text-neutral-500 text-center mt-3">
                  Você será levado ao AliExpress com o grupo já aplicado.
                </p>
              </div>

              {/* Like */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={handleLike}
                  data-testid="like-button"
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-body text-sm transition-colors ${
                    liked
                      ? "border-brand/40 text-brand bg-brand-soft"
                      : "border-black/10 bg-white text-neutral-600 hover:text-ink"
                  }`}
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likes}
                </button>
                <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                  curtiram este achado
                </span>
              </div>

              {/* Sidebar rail ad */}
              <div className="mt-8">
                <AdSlot variant="sidebar" />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <AddDealModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
