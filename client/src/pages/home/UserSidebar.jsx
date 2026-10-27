import { useEffect, useState } from "react";
import { IoSearch, IoClose, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtherUsersThunk,
  logoutUserThunk,
} from "../../store/slice/user/user.thunk";
import { requestOnlineUsers } from "../../socket/socketClient";

const UserSidebar = ({ onOpenSettings }) => {
  const [searchValue, setSearchValue] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // "all" | "online"
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const { otherUsers, userProfile, buttonLoading } = useSelector(
    (state) => state.userReducer
  );
  const { onlineUsers } = useSelector((state) => state.socketReducer);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
  };

  useEffect(() => {
    if (!otherUsers || !Array.isArray(otherUsers)) {
      setUsers([]);
      return;
    }

    let filtered = otherUsers;

    // Filter by online status if mode is "online"
    if (filterMode === "online") {
      filtered = filtered.filter((u) => {
        const uId = String(u._id);
        return onlineUsers?.some((id) => String(id) === uId);
      });
    }

    // Filter by search query
    if (searchValue.trim()) {
      const term = searchValue.toLowerCase().trim();
      filtered = filtered.filter((u) => {
        return (
          u.username?.toLowerCase().includes(term) ||
          u.fullName?.toLowerCase().includes(term)
        );
      });
    }

    setUsers(filtered);
  }, [searchValue, otherUsers, filterMode, onlineUsers]);

  useEffect(() => {
    dispatch(getOtherUsersThunk());
    requestOnlineUsers();
  }, [dispatch]);

  const onlineCount = Array.isArray(otherUsers)
    ? otherUsers.filter((u) => {
        const uId = String(u._id);
        return onlineUsers?.some((id) => String(id) === uId);
      }).length
    : 0;

  return (
    <div className="w-full h-full flex flex-col border-r border-base-300 bg-base-100/90 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-content shadow-lg shadow-primary/20">
            <HiChatBubbleLeftRight size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent brand-font">
              BhatChat
            </h1>
            <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 online-pulse inline-block" />
              <span>{onlineCount} online now</span>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <IoSettingsOutline size={19} />
          </button>
          <button
            onClick={handleLogout}
            disabled={buttonLoading}
            title="Logout"
            className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-error hover:bg-error/10 transition-colors"
          >
            {buttonLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <IoLogOutOutline size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 space-y-2 border-b border-base-300/60 bg-base-200/30">
        <div className="relative flex items-center">
          <IoSearch className="absolute left-3 text-base-content/40 text-sm" />
          <input
            type="text"
            className="input input-sm input-bordered w-full pl-9 pr-8 text-xs bg-base-100 rounded-xl focus:input-primary transition-all"
            placeholder="Search friends..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-2.5 text-base-content/40 hover:text-base-content"
            >
              <IoClose size={15} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterMode("all")}
            className={`btn btn-xs rounded-lg px-2.5 font-normal transition-all ${
              filterMode === "all"
                ? "btn-primary text-primary-content shadow-sm"
                : "btn-ghost text-base-content/60 hover:text-base-content"
            }`}
          >
            All ({otherUsers?.length || 0})
          </button>
          <button
            onClick={() => setFilterMode("online")}
            className={`btn btn-xs rounded-lg px-2.5 font-normal transition-all ${
              filterMode === "online"
                ? "btn-primary text-primary-content shadow-sm"
                : "btn-ghost text-base-content/60 hover:text-base-content"
            }`}
          >
            Online ({onlineCount})
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {users.length > 0 ? (
          users.map((userDetails) => (
            <User key={userDetails?._id} userDetails={userDetails} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-2">
              <IoSearch size={22} />
            </div>
            <p className="text-sm font-medium text-base-content/70">
              {searchValue
                ? "No matching users found"
                : filterMode === "online"
                ? "No friends online right now"
                : "No other users available"}
            </p>
            <p className="text-xs text-base-content/40 mt-1 max-w-[180px]">
              {searchValue
                ? "Try searching by full name or username"
                : "Invite friends to start chatting!"}
            </p>
          </div>
        )}
      </div>

      {/* Current User Bottom Bar */}
      <div className="p-3 border-t border-base-300 bg-base-200/50 flex items-center justify-between">
        <div
          onClick={onOpenSettings}
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0 mr-2 p-1 rounded-xl hover:bg-base-300/50 transition-colors"
          title="Click to edit profile"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full ring-2 ring-primary/60 ring-offset-2 ring-offset-base-100 overflow-hidden shadow-sm bg-base-300">
              <img
                src={
                  userProfile?.avatar ||
                  "https://avatar.iran.liara.run/public/boy"
                }
                alt="My Profile"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-base-100" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {userProfile?.fullName || userProfile?.username}
            </h2>
            <p className="text-xs text-base-content/60 truncate">
              @{userProfile?.username}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="btn btn-sm btn-outline btn-primary rounded-xl px-3 gap-1.5 shadow-sm text-xs"
        >
          <IoSettingsOutline size={14} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
