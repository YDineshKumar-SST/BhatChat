import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow all origins in development and matching origins in production
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map of userId -> Set of socketIds (supports multiple tabs / windows per user)
const userSocketMap = new Map();
// Reverse map of socketId -> userId for fast O(1) disconnect cleanup
const socketUserMap = new Map();

const getOnlineUserIds = () => Array.from(userSocketMap.keys());

io.on("connection", (socket) => {
  const rawUserId = socket.handshake.query.userId;
  const userId = rawUserId && rawUserId !== "undefined" && rawUserId !== "null"
    ? String(rawUserId)
    : null;

  if (!userId) {
    console.log("Socket connection rejected: No valid userId provided", socket.id);
    return;
  }

  // Register socket for user
  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }
  userSocketMap.get(userId).add(socket.id);
  socketUserMap.set(socket.id, userId);

  console.log(`[Socket Connected] User ${userId} on socket ${socket.id}. Total online: ${userSocketMap.size}`);

  // Broadcast updated online list to ALL clients
  io.emit("onlineUsers", getOnlineUserIds());

  // Also send directly to newly connected socket immediately
  socket.emit("onlineUsers", getOnlineUserIds());

  // Allow client to actively request online users anytime
  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", getOnlineUserIds());
  });

  // Typing indicators
  socket.on("typing", ({ receiverId }) => {
    const receiverSockets = getSocketIds(receiverId);
    receiverSockets.forEach((sId) => {
      io.to(sId).emit("userTyping", { senderId: userId });
    });
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSockets = getSocketIds(receiverId);
    receiverSockets.forEach((sId) => {
      io.to(sId).emit("userStopTyping", { senderId: userId });
    });
  });

  socket.on("disconnect", () => {
    const uId = socketUserMap.get(socket.id);
    if (uId && userSocketMap.has(uId)) {
      const userSockets = userSocketMap.get(uId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        userSocketMap.delete(uId);
      }
    }
    socketUserMap.delete(socket.id);

    console.log(`[Socket Disconnected] Socket ${socket.id} (User: ${uId}). Remaining online: ${userSocketMap.size}`);
    io.emit("onlineUsers", getOnlineUserIds());
  });
});

const getSocketId = (userId) => {
  if (!userId) return null;
  const sockets = userSocketMap.get(String(userId));
  if (!sockets || sockets.size === 0) return null;
  return sockets.values().next().value || null;
};

const getSocketIds = (userId) => {
  if (!userId) return [];
  const sockets = userSocketMap.get(String(userId));
  return sockets ? Array.from(sockets) : [];
};

export { io, app, server, getSocketId, getSocketIds };
