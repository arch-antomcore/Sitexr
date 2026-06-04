import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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
  const { data } = await api.post("/scrape", { url });
  return data;
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
