import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft, Heart, People, BoxArrowUpRight, ShieldCheck, ArrowClockwise, CardImage, Tag,
} from "react-bootstrap-icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddDealModal from "@/components/AddDealModal";
import AdSlot from "@/components/AdSlot";
import { fetchPost, joinGroup, likePost } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
import RetroTerminalLog from "@/components/RetroTerminalLog";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [joined, setJoined] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [terminalOpen, setTerminalOpen] = useState(false);

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
    const newJoined = joined + 1;
    setJoined(newJoined);
    try {
      await joinGroup(id);
    } catch {
      /* non-blocking */
    }
    if (newJoined >= 3) {
      setTerminalOpen(true);
    }
    toast.success("Abrindo a oferta...");
    window.open(post.group_url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex flex-col items-center justify-center gap-4 text-white">
        <ArrowClockwise size={32} className="animate-spin text-brand" />
        <span className="font-mono text-xs uppercase tracking-wider">Carregando detalhes...</span>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-[#0d0e12] text-white flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-display text-xs sm:text-sm uppercase tracking-wider text-brand">Grupo não encontrado</p>
        <Link to="/" className="pixel-btn">
          Voltar ao início
        </Link>
      </div>
    );
  }

  const gallery = (post.images && post.images.length ? post.images : post.image ? [post.image] : []);
  const mainImg = gallery[activeImg] || post.image;

  return (
    <div className="relative min-h-screen bg-[#0d0e12] text-white">
      <Header onAddDeal={() => setModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <button
          onClick={() => navigate(-1)}
          data-testid="back-button"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-mono text-xs uppercase tracking-wider mb-8"
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
              className="relative aspect-square bg-[#181822] border-4 border-black shadow-[4px_4px_0px_#000000] overflow-hidden"
            >
              {mainImg ? (
                <img src={mainImg} alt={post.title} className="w-full h-full object-cover pixelated" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                  <CardImage size={56} />
                </div>
              )}
              {post.discount ? (
                <span className="absolute top-4 left-4 bg-brand border-2 border-black text-white font-mono font-bold px-3 py-1.5 text-xs shadow-sm">
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
                    className={`h-16 w-16 overflow-hidden border-4 transition-all shadow-[2px_2px_0px_#000000] ${
                      i === activeImg ? "border-brand" : "border-black hover:border-brand"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover pixelated" />
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
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 border-2 border-black bg-[#181822] text-[#00ff66] font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 shadow-[2px_2px_0px_#000000]">
                  <Tag size={12} /> {categoryLabel(post.category)}
                </span>
                {joined >= 3 ? (
                  <span className="inline-flex items-center gap-1.5 border-2 border-[#00ff66] bg-black text-[#00ff66] font-display text-[8px] uppercase px-3 py-1.5 shadow-[2px_2px_0px_#00ff66] animate-pulse">
                    [ META ATINGIDA ]
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[#00ff66] font-mono text-[9px] uppercase tracking-wider font-bold">
                    <ShieldCheck size={14} /> verificado
                  </span>
                )}
              </div>

              <h1 className="font-body font-bold text-lg sm:text-2xl leading-normal text-white uppercase tracking-wide">
                {post.title}
              </h1>

              {post.description && (
                <p className="font-body text-neutral-400 leading-relaxed mt-5 text-xs sm:text-sm">
                  {post.description}
                </p>
              )}

              {/* Price block */}
              <div className="mt-8 bg-[#181822] border-4 border-black shadow-[4px_4px_0px_#000000] p-6">
                <div className="flex items-end justify-between flex-wrap gap-4">
                  <div>
                    {post.original_price && (
                      <div className="font-body text-xs text-neutral-500 line-through">
                        {post.original_price}
                      </div>
                    )}
                    <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-1">
                      Preço de grupo
                    </div>
                    <div className="font-display text-sm sm:text-lg text-[#00ff66] leading-none mt-2">
                      {post.current_price || "Ver Oferta"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm sm:text-base text-white flex items-center justify-end gap-2">
                      <People size={16} className="text-brand" /> {joined}
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-1">
                      já entraram
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleJoin}
                  data-testid="join-group-button"
                  className="w-full mt-6 pixel-btn py-4"
                >
                  Entrar no grupo <BoxArrowUpRight size={14} />
                </button>
                <p className="font-body text-[10px] text-neutral-500 text-center mt-3 uppercase tracking-wider">
                  Você será levado ao site da oferta.
                </p>
              </div>

              {/* Like */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleLike}
                  data-testid="like-button"
                  className={`inline-flex items-center gap-2 border-2 border-black px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors shadow-[2px_2px_0px_#000000] active:translate-y-0.5 ${
                    liked
                      ? "bg-brand text-white"
                      : "bg-[#181822] text-neutral-400 hover:text-white"
                  }`}
                >
                  <Heart size={14} fill={liked ? "currentColor" : "none"} /> {likes}
                </button>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
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

      {/* Left/Right Skyscraper Ads (Large screens) */}
      <div className="hidden 2xl:block fixed left-4 top-28 z-40">
        <AdSlot variant="skyscraper" />
      </div>
      <div className="hidden 2xl:block fixed right-4 top-28 z-40">
        <AdSlot variant="skyscraper" />
      </div>

      <AddDealModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Floating Retro Terminal Simulation */}
      <RetroTerminalLog
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        productName={post.title}
      />
    </div>
  );
}
