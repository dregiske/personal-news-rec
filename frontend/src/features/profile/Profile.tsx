import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
} from "./api";
import { extractError } from "../../api/api";
import PageLayout from "../../components/PageLayout";
import AvatarUploader from "./components/AvatarUploader";
import EditPrompt from "./components/EditPrompt";
import type { User, FieldConfig } from "../../types";

interface ProfileRow {
  key: string;
  label: string;
  displayValue: (user: User) => string;
  fields: FieldConfig[];
}

const PROFILE_ROWS: ProfileRow[] = [
  {
    key: "username",
    label: "Username",
    displayValue: (user) => user.username ?? "—",
    fields: [
      {
        key: "username",
        label: "New username",
        type: "text",
        placeholder: "e.g. john_doe",
      },
    ],
  },
  {
    key: "password",
    label: "Password",
    displayValue: () => "••••••••",
    fields: [
      {
        key: "current_password",
        label: "Current password",
        type: "password",
        placeholder: "••••••••",
      },
      {
        key: "new_password",
        label: "New password",
        type: "password",
        placeholder: "••••••••",
      },
    ],
  },
  {
    key: "preferred_topics",
    label: "Preferred Topics",
    displayValue: (user) =>
      user.preferred_topics
        ? user.preferred_topics
            .split(",")
            .map((t) => t.trim())
            .join(", ")
        : "None",
    fields: [
      { key: "preferred_topics", label: "Select topics", type: "topics" },
    ],
  },
  {
    key: "language",
    label: "Language",
    displayValue: (user) => user.language?.toUpperCase() ?? "—",
    fields: [{ key: "language", label: "Language", type: "select" }],
  },
];

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  if (!user) return null;

  const activeRow = PROFILE_ROWS.find((r) => r.key === activeField) ?? null;

  async function handleSubmit(values: Record<string, string>) {
    if (!activeField) return;

    if (activeField === "password") {
      await changePassword(values.current_password, values.new_password);
      return;
    }

    await updateProfile({ [activeField]: values[activeField] });
    await refreshUser();
  }

  async function handleAvatarUpload(file: File) {
    setAvatarError("");
    setAvatarLoading(true);
    try {
      await uploadAvatar(file);
      await refreshUser();
    } catch (err) {
      setAvatarError(
        extractError(err, "Failed to upload avatar. Please try again."),
      );
    } finally {
      setAvatarLoading(false);
    }
  }

  async function handleDeleteAvatar() {
    setAvatarError("");
    setAvatarLoading(true);
    try {
      await deleteAvatar();
      await refreshUser();
    } catch (err) {
      setAvatarError(
        extractError(err, "Failed to remove avatar. Please try again."),
      );
    } finally {
      setAvatarLoading(false);
    }
  }

  return (
    <PageLayout title="Profile" subtitle="Manage your account details.">
      <div className="flex flex-col md:flex-row gap-12 mt-4">
        {/* Avatar column */}
        <div className="shrink-0">
          <AvatarUploader
            currentUrl={user.avatar_url}
            onFileSelect={handleAvatarUpload}
            onRemove={handleDeleteAvatar}
            loading={avatarLoading}
            error={avatarError}
            size={120}
          />
        </div>

        {/* Details column */}
        <div className="flex-1 flex flex-col divide-y divide-fray-border border border-fray-border">
          {/* Email — read only */}
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint mb-1">
                Email
              </p>
              <p className="text-sm text-fray-text">{user.email}</p>
            </div>
          </div>

          {PROFILE_ROWS.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-fray-text-faint mb-1">
                  {row.label}
                </p>
                <p className="text-sm text-fray-text">
                  {row.displayValue(user)}
                </p>
              </div>
              <button
                onClick={() => setActiveField(row.key)}
                className="text-xs font-semibold uppercase tracking-widest px-4 py-1.5 border border-fray-border text-fray-text-faint hover:border-fray-primary hover:text-fray-primary transition-colors duration-200 shrink-0 ml-4"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeRow && (
        <EditPrompt
          title={`Edit ${activeRow.label}`}
          fields={activeRow.fields}
          onSubmit={handleSubmit}
          onClose={() => setActiveField(null)}
        />
      )}
    </PageLayout>
  );
}
