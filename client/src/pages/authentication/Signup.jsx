import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoKeySharp, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../../store/slice/user/user.thunk";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, buttonLoading } = useSelector(
    (state) => state.userReducer
  );
  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    if (
      !signupData.fullName.trim() ||
      !signupData.username.trim() ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      return toast.error("All fields are required");
    }
    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (signupData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const response = await dispatch(
      registerUserThunk({
        ...signupData,
        fullName: signupData.fullName.trim(),
        username: signupData.username.trim().toLowerCase().replace(/\s+/g, ""),
      })
    );
    if (response?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-base-100 relative overflow-hidden select-none">
      {/* Background ambient decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-lg w-full bg-base-200/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-message-in">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-content mx-auto mb-3 shadow-xl shadow-primary/25">
            <HiChatBubbleLeftRight size={30} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight brand-font">
            Create your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              BhatChat
            </span>{" "}
            Account
          </h1>
          <p className="text-xs text-base-content/60 mt-1">
            Join the conversation and connect with friends instantly
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3.5">
          {/* Full Name & Username in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1">
                Full Name
              </label>
              <label className="input input-bordered input-sm flex items-center gap-2.5 bg-base-100/60 rounded-xl focus-within:input-primary">
                <FaUser className="opacity-40 text-xs" />
                <input
                  type="text"
                  name="fullName"
                  className="grow text-xs"
                  placeholder="John Doe"
                  value={signupData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1">
                Username
              </label>
              <label className="input input-bordered input-sm flex items-center gap-2.5 bg-base-100/60 rounded-xl focus-within:input-primary">
                <span className="opacity-40 text-xs font-mono">@</span>
                <input
                  type="text"
                  name="username"
                  className="grow text-xs"
                  placeholder="johndoe"
                  value={signupData.username}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1">
                Password
              </label>
              <label className="input input-bordered input-sm flex items-center gap-2.5 bg-base-100/60 rounded-xl focus-within:input-primary">
                <IoKeySharp className="opacity-40 text-xs" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 chars"
                  className="grow text-xs"
                  value={signupData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={15} />
                  ) : (
                    <IoEyeOutline size={15} />
                  )}
                </button>
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1">
                Confirm Password
              </label>
              <label className="input input-bordered input-sm flex items-center gap-2.5 bg-base-100/60 rounded-xl focus-within:input-primary">
                <IoKeySharp className="opacity-40 text-xs" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  className="grow text-xs"
                  value={signupData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
          </div>

          {/* Gender Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1">
              Select Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  signupData.gender === "male"
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-white/10 bg-base-100/40 text-base-content/70 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={signupData.gender === "male"}
                  onChange={handleInputChange}
                  className="radio radio-primary radio-xs"
                />
                <span className="text-xs">Male 👨</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  signupData.gender === "female"
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-white/10 bg-base-100/40 text-base-content/70 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={signupData.gender === "female"}
                  onChange={handleInputChange}
                  className="radio radio-primary radio-xs"
                />
                <span className="text-xs">Female 👩</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={buttonLoading}
            className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/25 mt-4 font-semibold text-sm"
          >
            {buttonLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Complete Registration"
            )}
          </button>

          <p className="text-center text-xs text-base-content/70 pt-2">
            Already have an account? &nbsp;
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
