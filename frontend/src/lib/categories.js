import { Layers, PersonStanding, CarFront, Stars, Controller, Boxes } from "react-bootstrap-icons";

export const CATEGORIES = [
  { id: "all", label: "Todos", icon: Layers },
  { id: "figures", label: "Figures", icon: PersonStanding },
  { id: "carrinhos", label: "Carrinhos", icon: CarFront },
  { id: "anime", label: "Anime", icon: Stars },
  { id: "games", label: "Games", icon: Controller },
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
