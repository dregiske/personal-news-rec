import api from "../../api/api";

export async function signup({ email, password }) {
  const res = await api.post("/signup", { email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/login", { email, password });
  return res.data;
}
