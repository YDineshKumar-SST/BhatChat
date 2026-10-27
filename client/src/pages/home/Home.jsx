import { useEffect, useRef, useState } from "react";
import UserSidebar from "./UserSidebar";
import MessageContainer from "./MessageContainer";
import SettingsModal from "../../components/SettingsModal";
import { useDispatch, useSelector } from "react-redux";
import {
  setOnlineUsers,
  setUserTyping,
  setUserStopTyping,
} from "../../store/slice/socket/socket.slice";
import { setNewMessage } from "../../store/slice/message/message.slice";
import { handleUserUpdated } from "../../store/slice/user/user.slice";
import { initSocket } from "../../socket/socketClient";
import { playNotificationSound } from "../../utils/sound";

const Home = () => {
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isAuthenticated, userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!isAuthenticated || !userProfile?._id) return;

    const socket = initSocket(userProfile._id);
    if (!socket) return;

    const handleOnlineUsers = (onlineUsers) => {
      console.log("[Client] Received onlineUsers:", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    };

    const handleNewMessage = (newMessage) => {
      // Play sound for incoming message
      if (newMessage.senderId !== userProfile._id) {
        playNotificationSound();
      }

      // Only append if message belongs to current active conversation
      const activeUser = selectedUserRef.current;
      if (
        activeUser?._id &&
        (newMessage.senderId === activeUser._id ||
          newMessage.receiverId === activeUser._id)
      ) {
        dispatch(setNewMessage(newMessage));
      }
    };

    const handleUserTyping = ({ senderId }) => {
      dispatch(setUserTyping(senderId));
    };

    const handleUserStopTyping = ({ senderId }) => {
      dispatch(setUserStopTyping(senderId));
    };

    const handleUserUpdatedEvent = (updatedUser) => {
      dispatch(handleUserUpdated(updatedUser));
    };

    // Clean any prior duplicate listeners
    socket.off("onlineUsers", handleOnlineUsers);
    socket.off("newMessage", handleNewMessage);
    socket.off("userTyping", handleUserTyping);
    socket.off("userStopTyping", handleUserStopTyping);
    socket.off("userUpdated", handleUserUpdatedEvent);

    // Register active listeners
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStopTyping", handleUserStopTyping);
    socket.on("userUpdated", handleUserUpdatedEvent);

    // Actively query online users immediately
    socket.emit("getOnlineUsers");

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStopTyping", handleUserStopTyping);
      socket.off("userUpdated", handleUserUpdatedEvent);
    };
  }, [isAuthenticated, userProfile?._id, dispatch]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base-100 select-none">
      {/* Sidebar: hidden on mobile if a user is selected */}
      <div
        className={`h-full ${
          selectedUser ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-96 shrink-0 transition-all duration-300`}
      >
        <UserSidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>

      {/* Message Area: hidden on mobile if no user is selected */}
      <div
        className={`h-full flex-1 ${
          !selectedUser ? "hidden md:flex" : "flex"
        } transition-all duration-300`}
      >
        <MessageContainer />
      </div>

      {/* Interactive Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Home;
