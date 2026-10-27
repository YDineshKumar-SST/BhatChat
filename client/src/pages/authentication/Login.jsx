import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoKeySharp, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk } from "../../store/slice/user/user.thunk";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, buttonLoading } = useSelector(
    (state) => state.userReducer
  );
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginData.username.trim() || !loginData.password) return;
    const response = await dispatch(
      loginUserThunk({
        username: loginData.username.trim(),
        password: loginData.password,
      })
    );
    if (response?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-base-100 relative overflow-hidden select-none">
      {/* Background ambient decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-base-200/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 animate-message-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-content mx-auto mb-4 shadow-xl shadow-primary/25">
            <HiChatBubbleLeftRight size={30} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight brand-font">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              BhatChat
            </span>
          </h1>
          <p className="text-xs text-base-content/60 mt-1">
            Sign in to reconnect with friends and continue your chats
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1.5">
              Username
            </label>
            <label className="input input-bordered flex items-center gap-3 bg-base-100/60 rounded-xl focus-within:input-primary transition-all">
              <FaUser className="opacity-40 text-sm" />
              <input
                type="text"
                name="username"
                className="grow text-sm"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-base-content/70 block mb-1.5">
              Password
            </label>
            <label className="input input-bordered flex items-center gap-3 bg-base-100/60 rounded-xl focus-within:input-primary transition-all">
              <IoKeySharp className="opacity-40 text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="grow text-sm"
                value={loginData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                {showPassword ? (
                  <IoEyeOffOutline size={18} />
                ) : (
                  <IoEyeOutline size={18} />
                )}
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={buttonLoading || !loginData.username || !loginData.password}
            className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/25 mt-2 font-semibold text-sm"
          >
            {buttonLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-xs text-base-content/70 pt-3">
            Don&apos;t have an account yet? &nbsp;
            <Link
              to="/signup"
              className="text-primary hover:underline font-semibold"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
