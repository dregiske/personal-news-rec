import api from './api.jsx';

async function handleSignup(e) {
  e.preventDefault();
  setMessage('Signing up...');
  try {
	const res = await api.post( "/signup", { email, password });
	console.log("Signup response:", res.data);
	window.location.href = "/login";
  } catch (error) {
	console.error("Signup error:", error);
	setMessage('Signup failed. Please try again.');
  }
}