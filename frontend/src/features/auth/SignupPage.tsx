import { useState } from "react";
import { signup } from "./api";
import { uploadAvatar } from "../profile/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api, { API_BASE, extractError } from "../../api/api";
import AvatarUploader from "../profile/components/AvatarUploader";

const CONSECUTIVE_SPECIAL = /[_-]{2,}/;
const VALID_USERNAME = /^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$/;

function sanitizeUsername(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

function validateUsername(value: string): string | null {
  if (value.length === 0) return null; // optional field — blank is fine
  if (value.length < 3) return "Username must be at least 3 characters";
  if (value.length > 32) return "Username must be 32 characters or fewer";
  if (CONSECUTIVE_SPECIAL.test(value))
    return "No consecutive underscores or hyphens";
  if (!VALID_USERNAME.test(value))
    return "Must start and end with a letter or number";
  return null;
}

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

      if (username.trim()) {
        await api.patch(`${API_BASE}/me`, { username: username.trim() });
      }

      await refreshUser();

      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = extractError(err, "Could not save customizations. You can update these later in your profile.");
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
      <div className="w-full max-w-sm">
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-fray-text mb-1">
              Join the Fray.
            </h1>
            <p className="text-sm text-fray-text-faint mb-8">
              Create your account to get started.
            </p>

            <div className="bg-fray-glass border border-fray-border backdrop-blur-md p-8">
              <form onSubmit={handleStep1} className="flex flex-col gap-5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint">
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-fray-input-bg border border-fray-border text-fray-text text-sm px-4 py-2.5 outline-none focus:border-fray-primary transition-colors duration-200 placeholder:text-fray-text-faint disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-fray-input-bg border border-fray-border text-fray-text text-sm px-4 py-2.5 outline-none focus:border-fray-primary transition-colors duration-200 placeholder:text-fray-text-faint disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 px-4 py-2.5 bg-fray-primary text-fray-ink text-sm font-semibold hover:bg-fray-primary-hover transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </form>

              {message && (
                <p
                  className={`text-xs mt-4 ${isError ? "text-fray-danger" : "text-fray-text-faint"}`}
                >
                  {message}
                </p>
              )}

              <p className="text-xs text-fray-text-faint mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-fray-primary hover:text-fray-text transition-colors duration-200"
                >
                  Log in
                </Link>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold text-fray-text mb-1">
              Make it yours.
            </h1>
            <p className="text-sm text-fray-text-faint mb-8">
              Add a username and avatar. You can always change these later.
            </p>

            <div className="bg-fray-glass border border-fray-border backdrop-blur-md p-8">
              <form onSubmit={handleStep2} className="flex flex-col gap-5">
                {/* Avatar picker */}
                <AvatarUploader
                  currentUrl={avatarPreview}
                  onFileSelect={handleAvatarChange}
                  size={64}
                />

                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint">
                    Username
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const sanitized = sanitizeUsername(e.target.value);
                      setUsername(sanitized);
                      setUsernameError(validateUsername(sanitized));
                    }}
                    disabled={isLoading}
                    className={`bg-fray-input-bg border text-fray-text text-sm px-4 py-2.5 outline-none focus:border-fray-primary transition-colors duration-200 placeholder:text-fray-text-faint disabled:opacity-50 ${usernameError ? "border-fray-danger" : "border-fray-border"}`}
                    placeholder="(Optional)"
                  />
                  {usernameError && (
                    <p className="text-xs text-fray-danger">{usernameError}</p>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !!usernameError}
                    className="flex-1 px-4 py-2.5 bg-fray-primary text-fray-ink text-sm font-semibold hover:bg-fray-primary-hover transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Finish"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={isLoading}
                    className="px-4 py-2.5 border border-fray-border text-fray-text-faint text-sm font-semibold hover:text-fray-text hover:border-fray-text transition-colors duration-200 disabled:opacity-50"
                  >
                    Skip
                  </button>
                </div>
              </form>

              {message && (
                <p
                  className={`text-xs mt-4 ${isError ? "text-fray-danger" : "text-fray-text-faint"}`}
                >
                  {message}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
