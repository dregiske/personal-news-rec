import api from "./api";

export async function fetchFeed() {
  const result = await api.get("/feed");
  return result.data;
}