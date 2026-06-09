import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const fetchPosts = async ({ category = "all", sort = "recent", q = "" } = {}) => {
  const params = { category, sort };
  if (q) params.q = q;
  const { data } = await api.get("/posts", { params });
  return data;
};

export const fetchPost = async (id) => {
  const { data } = await api.get(`/posts/${id}`);
  return data;
};

export const scrapeUrl = async (url) => {
  try {
    // Tenta usar o Backend Oficial primeiro
    const { data } = await api.post("/scrape", { url });
    return data;
  } catch (e) {
    console.warn("Backend indisponível. Tentando captura via proxy público (Frontend)...");
    
    // Fallback: Captura via Frontend para não deixar o usuário na mão (útil para Github Pages)
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Erro no Proxy");
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const title = doc.querySelector('meta[property="og:title"]')?.content || doc.title || "";
    const image = doc.querySelector('meta[property="og:image"]')?.content || doc.querySelector('meta[name="twitter:image"]')?.content || "";
    const description = doc.querySelector('meta[property="og:description"]')?.content || doc.querySelector('meta[name="description"]')?.content || "";
    
    if (!title && !image) throw new Error("Nenhum dado encontrado no site.");
    
    return {
      ok: true,
      title,
      image,
      images: image ? [image] : [],
      description,
      current_price: null,
      original_price: null,
      category: "outros"
    };
  }
};

export const createPost = async (payload) => {
  const { data } = await api.post("/posts", payload);
  return data;
};

export const joinGroup = async (id) => {
  const { data } = await api.post(`/posts/${id}/join`);
  return data;
};

export const likePost = async (id) => {
  const { data } = await api.post(`/posts/${id}/like`);
  return data;
};

export const fetchStats = async () => {
  const { data } = await api.get("/stats");
  return data;
};
