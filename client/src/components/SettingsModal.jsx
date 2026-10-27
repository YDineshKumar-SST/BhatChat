import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IoClose,
  IoCamera,
  IoColorPaletteOutline,
  IoKeySharp,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { FaUser, FaLock } from "react-icons/fa";
import { updateProfileThunk } from "../store/slice/user/user.thunk";
import toast from "react-hot-toast";

const THEMES = [
  { id: "night", name: "Night (Default)", bg: "#0f172a", primary: "#38bdf8" },
  { id: "dark", name: "Deep Dark", bg: "#1d232a", primary: "#7480ff" },
  { id: "luxury", name: "Luxury Gold", bg: "#09090b", primary: "#e0a82e" },
  { id: "synthwave", name: "Synthwave", bg: "#1a103c", primary: "#e779c1" },
  { id: "cyberpunk", name: "Cyberpunk", bg: "#ffee00", primary: "#ff7598" },
  { id: "dracula", name: "Dracula", bg: "#282a36", primary: "#ff79c6" },
  { id: "forest", name: "Forest", bg: "#171212", primary: "#1eb854" },
  { id: "cupcake", name: "Cupcake", bg: "#faf7f5", primary: "#65c3c8" },
  { id: "light", name: "Clean Light", bg: "#ffffff", primary: "#570df8" },
];

const PRESET_AVATARS = [
  "https://avatar.iran.liara.run/public/boy?username=alex",
  "https://avatar.iran.liara.run/public/boy?username=sam",
  "https://avatar.iran.liara.run/public/boy?username=ryan",
  "https://avatar.iran.liara.run/public/girl?username=emma",
  "https://avatar.iran.liara.run/public/girl?username=sophia",
  "https://avatar.iran.liara.run/public/girl?username=maya",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Zack",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
];

const SettingsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { userProfile, buttonLoading } = useSelector(
    (state) => state.userReducer
  );

  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "security" | "appearance"
  const [currentTheme, setCurrentTheme] = useState("night");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const fileInputRef = useRef(null);

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen && userProfile) {
      setFullName(userProfile.fullName || "");
      setUsername(userProfile.username || "");
      setAvatar(userProfile.avatar || "");
      setAvatarPreview(userProfile.avatar || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    const savedTheme = localStorage.getItem("bhatchat_theme") || "night";
    setCurrentTheme(savedTheme);
    const savedSound = localStorage.getItem("bhatchat_sound");
    setSoundEnabled(savedSound !== "false");
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  // Handle Photo File Upload with client-side compression
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file (PNG, JPG, WEBP)");
    }

    // Limit initial file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return toast.error("Image file is too large (max 10MB)");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setAvatar(compressedDataUrl);
        setAvatarPreview(compressedDataUrl);
        toast.success("Photo selected! Click 'Save Changes' to update.");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (presetUrl) => {
    setAvatar(presetUrl);
    setAvatarPreview(presetUrl);
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("bhatchat_theme", themeId);
  };

  const handleSoundToggle = (enabled) => {
    setSoundEnabled(enabled);
    localStorage.setItem("bhatchat_sound", enabled ? "true" : "false");
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();

    if (!fullName.trim() || !username.trim()) {
      return toast.error("Full Name and Username cannot be empty");
    }

    const payload = {
      fullName: fullName.trim(),
      username: username.trim(),
      avatar: avatar || userProfile?.avatar,
    };

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return toast.error("Please enter your current password to change password");
      }
      if (newPassword.length < 6) {
        return toast.error("New password must be at least 6 characters");
      }
      if (newPassword !== confirmPassword) {
        return toast.error("New password and confirmation do not match");
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const result = await dispatch(updateProfileThunk(payload));
    if (result?.payload?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-xl bg-base-100 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <IoPersonOutline size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Account Settings</h2>
              <p className="text-xs opacity-60">
                Customize your profile, security, and appearance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-base-content"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Tabs Nav */}
        <div className="flex border-b border-base-300 px-6 bg-base-200/30 gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-3 border-b-2 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <IoPersonOutline size={16} />
            Profile & Avatar
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-3 px-3 border-b-2 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <IoKeySharp size={16} />
            Security & Password
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`py-3 px-3 border-b-2 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "appearance"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <IoColorPaletteOutline size={16} />
            Appearance
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-base-200/50 border border-white/5">
                <div className="relative group cursor-pointer mb-3">
                  <div className="w-24 h-24 rounded-full ring-4 ring-primary/40 ring-offset-4 ring-offset-base-100 overflow-hidden shadow-lg bg-base-300">
                    <img
                      src={
                        avatarPreview ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt="Avatar Preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1"
                  >
                    <IoCamera size={22} />
                    <span>Upload</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-xs btn-outline btn-primary gap-1"
                  >
                    <IoCamera size={14} />
                    Upload from Device
                  </button>
                  {avatarPreview !== userProfile?.avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(userProfile?.avatar || "");
                        setAvatarPreview(userProfile?.avatar || "");
                      }}
                      className="btn btn-xs btn-ghost text-xs opacity-70"
                    >
                      Reset Photo
                    </button>
                  )}
                </div>

                {/* Preset Avatars */}
                <div className="w-full mt-4">
                  <p className="text-xs font-semibold opacity-70 mb-2">
                    Or choose a cool preset avatar:
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {PRESET_AVATARS.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(preset)}
                        className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 transition-all hover:scale-110 ${
                          avatarPreview === preset
                            ? "border-primary ring-2 ring-primary/50"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={preset}
                          alt={`Preset ${index + 1}`}
                          className="w-full h-full object-cover bg-base-300"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Username Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1.5">
                    Full Name
                  </label>
                  <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                    <FaUser className="opacity-50 text-sm" />
                    <input
                      type="text"
                      className="grow text-sm"
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1.5">
                    Username
                  </label>
                  <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                    <span className="opacity-50 text-sm font-mono">@</span>
                    <input
                      type="text"
                      className="grow text-sm"
                      placeholder="e.g. johndoe"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value.toLowerCase().replace(/\s+/g, "")
                        )
                      }
                    />
                  </label>
                  <p className="text-xs opacity-50 mt-1">
                    Your unique username used by others to find and chat with you.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-info/10 border border-info/20 text-xs text-info flex gap-2">
                <span>ℹ️</span>
                <span>
                  To change your password, provide your current password followed
                  by your new password. Leave blank if you don&apos;t want to
                  change your password.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1.5">
                  Current Password
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                  <FaLock className="opacity-50 text-sm" />
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    className="grow text-sm"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {showCurrentPw ? (
                      <IoEyeOffOutline size={18} />
                    ) : (
                      <IoEyeOutline size={18} />
                    )}
                  </button>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1.5">
                  New Password
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                  <IoKeySharp className="opacity-50 text-sm" />
                  <input
                    type={showNewPw ? "text" : "password"}
                    className="grow text-sm"
                    placeholder="Enter at least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {showNewPw ? (
                      <IoEyeOffOutline size={18} />
                    ) : (
                      <IoEyeOutline size={18} />
                    )}
                  </button>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1.5">
                  Confirm New Password
                </label>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                  <IoKeySharp className="opacity-50 text-sm" />
                  <input
                    type="password"
                    className="grow text-sm"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
                {newPassword && confirmPassword && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      newPassword === confirmPassword
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {newPassword === confirmPassword
                      ? "✓ Passwords match"
                      : "✕ Passwords do not match"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-3">
                  Color Themes
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {THEMES.map((theme) => {
                    const isSelected = currentTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleThemeChange(theme.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/40"
                            : "border-white/10 bg-base-200/50 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold">
                            {theme.name}
                          </span>
                          {isSelected && (
                            <IoCheckmarkCircle className="text-primary text-base" />
                          )}
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: theme.bg }}
                          />
                          <div
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: theme.primary }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-base-300">
                <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-2">
                  Preferences
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50 border border-white/5">
                  <div>
                    <h4 className="text-sm font-medium">Notification Sounds</h4>
                    <p className="text-xs opacity-60">
                      Play audio sound on receiving new messages
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={soundEnabled}
                    onChange={(e) => handleSoundToggle(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-300 bg-base-200/50">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            disabled={buttonLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={buttonLoading}
            className="btn btn-primary btn-sm px-5 gap-2 shadow-lg shadow-primary/20"
          >
            {buttonLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
