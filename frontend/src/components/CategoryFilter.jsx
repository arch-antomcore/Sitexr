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
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-body text-sm transition-all ${
                isActive
                  ? "bg-ink text-white border-ink font-semibold"
                  : "bg-white text-neutral-600 border-black/10 hover:border-ink/40 hover:text-ink"
              }`}
            >
              <Icon size={15} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
          Ordenar
        </span>
        <div className="flex rounded-full border border-black/10 bg-white p-1">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              data-testid={`sort-${s.id}`}
              className={`px-3 py-1.5 rounded-full font-body text-xs transition-colors ${
                sort === s.id
                  ? "bg-brand-soft text-brand font-semibold"
                  : "text-neutral-500 hover:text-ink"
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
