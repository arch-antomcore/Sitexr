import { Layers, Swords, Car, Sparkles, Gamepad2, Boxes } from "lucide-react";

export const CATEGORIES = [
  { id: "all", label: "Todos", icon: Layers },
  { id: "figures", label: "Figures", icon: Swords },
  { id: "carrinhos", label: "Carrinhos", icon: Car },
  { id: "anime", label: "Anime", icon: Sparkles },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "outros", label: "Outros", icon: Boxes },
];

export const POST_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");

export const categoryLabel = (id) =>
  (CATEGORIES.find((c) => c.id === id) || { label: "Outros" }).label;

export const SORTS = [
  { id: "recent", label: "Recentes" },
  { id: "price_asc", label: "Menor preço" },
  { id: "discount", label: "Maior desconto" },
  { id: "popular", label: "Mais entradas" },
];
