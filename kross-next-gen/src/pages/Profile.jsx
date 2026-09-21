import { useRef, useState } from "react";
import { Mail, Shield, Pencil, Camera, Lock } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";
import Badge from "../components/ui/Badge";
import { CURRENT_USER } from "../data/users";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(CURRENT_USER.name);
  const [image, setImage] = useState(CURRENT_USER.image);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    CURRENT_USER.name = name;
    CURRENT_USER.image = image;
    setEditing(false);
  };

  const handleCancel = () => {
    setName(CURRENT_USER.name);
    setImage(CURRENT_USER.image);
    setEditing(false);
  };

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleCancelPassword = () => {
    resetPasswordFields();
    setChangingPassword(false);
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    resetPasswordFields();
    setChangingPassword(false);
    window.alert("Password changed (demo)");
  };

  return (
    <AppLayout
      mobileView="list"
      sidebar={<Sidebar />}
      list={
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-5 sm:px-7">
            <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2
                           text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Avatar name={name} src={image} size="lg" />
                {editing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change photo"
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                               rounded-full bg-ink text-white ring-2 ring-white transition hover:bg-neutral-700"
                  >
                    <Camera size={13} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="min-w-0 flex-1">
                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2
                               text-xl font-bold tracking-tight outline-none focus:border-ink"
                  />
                ) : (
                  <p className="truncate text-xl font-bold tracking-tight">{CURRENT_USER.name}</p>
                )}
                <p className="truncate text-sm text-neutral-500">{CURRENT_USER.title}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
                <Mail size={16} className="text-neutral-400" />
                <span className="text-sm text-neutral-800">{CURRENT_USER.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
                <Shield size={16} className="text-neutral-400" />
                <Badge tone={CURRENT_USER.role === "admin" ? "lime" : "outline"}>
                  {CURRENT_USER.role}
                </Badge>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-neutral-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-neutral-400" />
                  <span className="text-sm font-semibold">Password</span>
                </div>
                {!changingPassword && (
                  <button
                    type="button"
                    onClick={() => setChangingPassword(true)}
                    className="text-sm font-medium text-rose-600 underline-offset-2 hover:underline"
                  >
                    Reset Password
                  </button>
                )}
              </div>

              {changingPassword && (
                <div className="mt-4 flex flex-col gap-3">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm
                               outline-none focus:border-ink"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm
                               outline-none focus:border-ink"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm
                               outline-none focus:border-ink"
                  />

                  {passwordError && (
                    <p className="text-sm text-rose-600">{passwordError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSavePassword}
                      className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold tracking-wide
                                 text-ink transition hover:brightness-95 "
                    >
                      Save Password
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPassword}
                      className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium
                                 text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {editing && (
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold tracking-wide
                             text-ink transition hover:brightness-95"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium
                             text-neutral-700 transition hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
