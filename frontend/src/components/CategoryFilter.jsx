import { CATEGORIES, SORTS } from "@/lib/categories";

export const CategoryFilter = ({ active, onChange, sort, onSortChange }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
      <div className="flex flex-wrap gap-3" data-testid="category-filter">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              data-testid={`category-${cat.id}`}
              className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all border-2 border-black ${
                isActive
                  ? "bg-brand text-white shadow-[2px_2px_0px_#000000] translate-y-0.5"
                  : "bg-[#181822] text-neutral-400 hover:text-white hover:border-brand shadow-[2px_2px_0px_#000000]"
              }`}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
          Ordenar
        </span>
        <div className="flex bg-[#181822] border-2 border-black p-0.5 shadow-[2px_2px_0px_#000000]">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              data-testid={`sort-${s.id}`}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                sort === s.id
                  ? "bg-brand text-white font-bold"
                  : "text-neutral-400 hover:text-white"
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
