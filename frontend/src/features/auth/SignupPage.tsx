import { useState } from "react";
import { signup } from "./api";
import { uploadAvatar } from "../profile/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api, { API_BASE, extractError } from "../../api/api";
import AvatarUploader from "../profile/components/AvatarUploader";
import TopicToggler from "../../components/TopicToggler";
import PromptCard from "../../components/PromptCard";
import { formInput, formLabel, formError, btnPrimary, btnSecondary } from "../../styles/common";
import { sanitizeUsername, validateUsername } from "../../utils/validation";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();

  // Step 1 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 state
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [topics, setTopics] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setIsError(false);
    setIsLoading(true);
    setMessage("Creating account...");

    try {
      await signup({ email, password });
      const result = await login(email, password);
      if (!result.ok) {
        setIsError(true);
        setMessage("Account created, but login failed. Redirecting...");
        navigate("/login");
        return;
      }
      setMessage("");
      setStep(2);
    } catch (err: unknown) {
      const msg = extractError(err, "Something went wrong. Please try again.");
      setIsError(true);
      setMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    await saveCustomizations();
  }

  async function handleSkip() {
    navigate("/dashboard");
  }

  async function saveCustomizations() {
    setIsError(false);
    setIsLoading(true);
    setMessage("Saving...");

    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      const patch: Record<string, string> = {};
      if (username.trim()) patch.username = username.trim();
      if (topics.trim()) patch.preferred_topics = topics.trim();
      if (Object.keys(patch).length > 0) {
        await api.patch(`${API_BASE}/me`, patch);
      }

      await refreshUser();

      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = extractError(
        err,
        "Could not save customizations. You can update these later in your profile.",
      );
      setIsError(true);
      setMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAvatarChange(file: File) {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  return (
    <div className="mt-15 min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      {step === 1 && (
        <PromptCard title="Join the Fray." subtitle="Create your account to get started.">
          <form onSubmit={handleStep1} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className={formLabel}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={formInput}
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={formLabel}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className={formInput}
                placeholder="••••••••"
              />
            </label>

            <button type="submit" disabled={isLoading} className={`mt-2 ${btnPrimary}`}>
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {message && (
            <p className={`${formError} mt-4 ${isError ? "" : "text-fray-text-faint!"}`}>
              {message}
            </p>
          )}

          <p className="text-xs text-fray-text-faint mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-fray-primary hover:text-fray-text transition-colors duration-200">
              Log in
            </Link>
          </p>
        </PromptCard>
      )}

      {step === 2 && (
        <PromptCard title="Make it yours." subtitle="Customize your profile. You can always change these later.">
          <form onSubmit={handleStep2} className="flex flex-col gap-5">
            <AvatarUploader
              currentUrl={avatarPreview}
              onFileSelect={handleAvatarChange}
              size={64}
            />

            <div className="flex flex-col gap-1.5">
              <span className={formLabel}>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const sanitized = sanitizeUsername(e.target.value);
                  setUsername(sanitized);
                  setUsernameError(validateUsername(sanitized));
                }}
                disabled={isLoading}
                className={`${formInput} ${usernameError ? "border-fray-danger!" : ""}`}
                placeholder="(Optional)"
              />
              {usernameError && <p className={formError}>{usernameError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={formLabel}>Topics</span>
              <TopicToggler value={topics} onChange={setTopics} />
            </div>

            <div className="flex gap-3 mt-2">
              <button type="submit" disabled={isLoading || !!usernameError} className={`flex-1 ${btnPrimary}`}>
                {isLoading ? "Saving..." : "Finish"}
              </button>
              <button type="button" onClick={handleSkip} disabled={isLoading} className={btnSecondary}>
                Skip
              </button>
            </div>
          </form>

          {message && (
            <p className={`${formError} mt-4 ${isError ? "" : "text-fray-text-faint!"}`}>
              {message}
            </p>
          )}
        </PromptCard>
      )}
    </div>
  );
}
