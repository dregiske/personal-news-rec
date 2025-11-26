// src/features/auth/api.js
import api from "../../api/client";

export async function signup({ email, password }) {
  const res = await api.post("/signup", { email, password });
  return res.data; // { id, email }
}

export async function login({ email, password }) {
  const res = await api.post("/login", { email, password });
  // { access_token, token_type, user: { id, email } }
  return res.data;
}
