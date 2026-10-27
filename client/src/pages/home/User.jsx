import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../store/slice/user/user.slice";

const User = ({ userDetails }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers, typingUsers } = useSelector(
    (state) => state.socketReducer
  );

  const isUserOnline =
    Array.isArray(onlineUsers) &&
    onlineUsers.some((id) => String(id) === String(userDetails?._id));
  const isTyping =
    Array.isArray(typingUsers) &&
    typingUsers.some((id) => String(id) === String(userDetails?._id));
  const isSelected =
    String(userDetails?._id) === String(selectedUser?._id);

  const handleUserClick = () => {
    dispatch(setSelectedUser(userDetails));
  };

  return (
    <div
      onClick={handleUserClick}
      className={`group relative flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-primary/15 border border-primary/30 shadow-md shadow-primary/5"
          : "hover:bg-base-200/70 border border-transparent"
      }`}
    >
      {/* Active Indicator Bar on the left */}
      {isSelected && (
        <span className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
      )}

      {/* Avatar with Status Ring */}
      <div className="relative shrink-0">
        <div
          className={`w-12 h-12 rounded-full overflow-hidden transition-transform group-hover:scale-105 shadow-sm bg-base-300 ring-2 ${
            isUserOnline ? "ring-emerald-500/80" : "ring-white/10"
          }`}
        >
          <img
            src={
              userDetails?.avatar ||
              "https://avatar.iran.liara.run/public/boy"
            }
            alt={userDetails?.username || "Avatar"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Online Dot */}
        {isUserOnline && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-base-100 online-pulse" />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3
            className={`text-sm font-semibold truncate ${
              isSelected ? "text-primary" : "text-base-content"
            }`}
          >
            {userDetails?.fullName}
          </h3>
          {isUserOnline && (
            <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10">
              Online
            </span>
          )}
        </div>

        {isTyping ? (
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <span>typing</span>
            <span className="flex gap-0.5 items-center">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
          </div>
        ) : (
          <p className="text-xs text-base-content/60 truncate">
            @{userDetails?.username}
          </p>
        )}
      </div>
    </div>
  );
};

export default User;
