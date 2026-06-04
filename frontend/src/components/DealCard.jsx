import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, People, CardImage } from "react-bootstrap-icons";
import { categoryLabel } from "@/lib/categories";

export const DealCard = ({ post, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      onClick={() => navigate(`/produto/${post.id}`)}
      data-testid="deal-card"
      className="group cursor-pointer pixel-card pixel-card-hover flex flex-col h-full bg-[#181822] overflow-hidden"
    >
      <div className="relative aspect-square bg-[#0d0e12] overflow-hidden border-b-4 border-black">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pixelated"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500">
            <CardImage size={36} />
          </div>
        )}

        {post.discount ? (
          <span className="absolute top-3 left-3 bg-brand border-2 border-black text-white font-mono font-bold px-2 py-0.5 text-[10px]">
            -{post.discount}%
          </span>
        ) : null}

        <span className="absolute top-3 right-3 bg-[#181822] border-2 border-black text-[#00ff66] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5">
          {categoryLabel(post.category)}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
        <div className="space-y-2">
          <h3 className="font-body font-bold text-xs sm:text-sm leading-normal text-white line-clamp-2 min-h-[2.5rem]">
            {post.title}
          </h3>

          <div className="flex items-end gap-2 pt-1">
            <span className="font-display text-[10px] sm:text-xs text-[#00ff66] leading-none">
              {post.current_price || "VER GRUPO"}
            </span>
            {post.original_price && (
              <span className="font-body text-[10px] text-neutral-500 line-through mb-0.5">
                {post.original_price}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-black text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-neutral-400 font-body">
            <People size={13} className="text-brand" /> {post.joined_count} no grupo
          </span>
          <span className="inline-flex items-center gap-1 text-white font-bold group-hover:text-brand transition-colors uppercase tracking-wider">
            Ver <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default DealCard;
