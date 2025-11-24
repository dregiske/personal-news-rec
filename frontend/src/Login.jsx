import api from './api.jsx';

async function handleLogin(e) {
  e.preventDefault();
  try {
    const res = await api.post(
		"/login",
		{ email, password },
		{ withCredentials: true }
	);
	console.log("Login response:", res.data);
  } catch (error) {
	console.error("Login error:", error);
  }
}