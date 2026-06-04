import { CATEGORIES, SORTS } from "@/lib/categories";

export const CategoryFilter = ({ active, onChange, sort, onSortChange }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
      <div className="flex flex-wrap gap-2" data-testid="category-filter">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              data-testid={`category-${cat.id}`}
              className={`inline-flex items-center gap-2 border px-4 py-2 font-body text-sm transition-all ${
                isActive
                  ? "bg-white text-ink border-white font-semibold"
                  : "bg-transparent text-zinc-400 border-white/15 hover:border-white/40 hover:text-white"
              }`}
            >
              <Icon size={15} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
          Ordenar
        </span>
        <div className="flex border border-white/15">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              data-testid={`sort-${s.id}`}
              className={`px-3 py-2 font-body text-xs transition-colors ${
                sort === s.id
                  ? "bg-cyber-cyan/15 text-cyber-cyan"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
