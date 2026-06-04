import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowUpRight, ImageOff } from "lucide-react";
import { categoryLabel } from "@/lib/categories";

export const DealCard = ({ post, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.05 }}
      onClick={() => navigate(`/produto/${post.id}`)}
      data-testid="deal-card"
      className="group relative cursor-pointer overflow-hidden bg-surface border border-white/10 transition-colors duration-300 hover:border-cyber-cyan/50"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black/60">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700">
            <ImageOff size={40} />
          </div>
        )}

        {post.discount ? (
          <span className="absolute top-3 right-3 z-10 bg-cyber-cyan text-ink font-mono font-bold px-2.5 py-1 text-sm glow-cyan">
            -{post.discount}%
          </span>
        ) : null}

        <span className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm border border-white/15 text-zinc-200 font-mono text-[10px] uppercase tracking-widest px-2 py-1">
          {categoryLabel(post.category)}
        </span>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
          <span className="inline-flex items-center gap-1 text-cyber-yellow font-mono text-xs">
            Ver grupo <ArrowUpRight size={14} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-body text-sm text-zinc-100 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-white">
          {post.title}
        </h3>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {post.original_price ? (
              <span className="font-mono-data text-xs text-zinc-500 line-through">
                {post.original_price}
              </span>
            ) : (
              <span className="font-mono-data text-xs text-transparent">—</span>
            )}
            <span className="font-mono-data text-xl font-bold text-cyber-yellow leading-none mt-0.5">
              {post.current_price || "Ver no grupo"}
            </span>
          </div>
          {post.joined_count > 0 && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-400 mb-0.5">
              <Users size={12} className="text-cyber-cyan" />
              {post.joined_count}
            </span>
          )}
        </div>
      </div>

      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyber-cyan transition-all duration-500 group-hover:w-full" />
    </motion.article>
  );
};

export default DealCard;
