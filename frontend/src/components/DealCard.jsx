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
      className="group cursor-pointer bg-white border border-black/[0.08] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_44px_-16px_rgba(0,0,0,0.22)]"
    >
      <div className="relative aspect-square bg-neutral-100 overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <CardImage size={36} />
          </div>
        )}

        {post.discount ? (
          <span className="absolute top-3 left-3 bg-brand text-white font-body font-bold px-2.5 py-1 text-sm rounded-md shadow-sm">
            -{post.discount}%
          </span>
        ) : null}

        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur border border-black/[0.06] text-neutral-600 font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded">
          {categoryLabel(post.category)}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-display font-bold text-lg leading-tight tracking-tight text-ink line-clamp-2 min-h-[3.25rem]">
          {post.title}
        </h3>

        <div className="flex items-end gap-2">
          <span className="font-display font-black text-2xl text-ink leading-none">
            {post.current_price || "Ver grupo"}
          </span>
          {post.original_price && (
            <span className="font-body text-sm text-neutral-400 line-through mb-0.5">
              {post.original_price}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 pt-4 border-t border-neutral-100 text-sm">
          <span className="inline-flex items-center gap-1.5 text-neutral-500 font-body">
            <People size={14} className="text-brand" /> {post.joined_count} no grupo
          </span>
          <span className="inline-flex items-center gap-1 text-ink font-medium group-hover:text-brand transition-colors">
            Ver <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default DealCard;
