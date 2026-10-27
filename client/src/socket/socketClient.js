import { io } from "socket.io-client";

let socket = null;
let currentUserId = null;

export const initSocket = (userId) => {
  if (!userId) return null;

  const targetUserId = String(userId);
  const socketUrl = import.meta.env.VITE_DB_ORIGIN || "http://localhost:5000";

  // If socket is already active for this exact user
  if (socket && currentUserId === targetUserId) {
    if (socket.connected) {
      socket.emit("getOnlineUsers");
    } else {
      socket.connect();
    }
    return socket;
  }

  // Disconnect any existing socket before creating new one
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  currentUserId = targetUserId;
  socket = io(socketUrl, {
    query: {
      userId: targetUserId,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected to server as user:", targetUserId);
    socket.emit("getOnlineUsers");
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected from server:", reason);
  });

  socket.on("connect_error", (error) => {
    console.warn("[Socket] Connection error:", error.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const requestOnlineUsers = () => {
  if (socket && socket.connected) {
    socket.emit("getOnlineUsers");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }
};
