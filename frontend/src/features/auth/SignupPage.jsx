import { useState } from "react";
import { signup } from "./api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("Creating account...");

    try {
      await signup({ email, password });
	  const result = await login(email, password);
	  if (!result.ok) {
		setMessage("Account created, but login failed. Redirecting to login...");
		navigate("/login");
		return;
	  }
      setMessage("Account created! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || "Signup failed";
      setMessage(msg);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Email<br />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Password<br />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>

        <button type="submit">Create Account</button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
