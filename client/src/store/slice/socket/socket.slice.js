import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
  typingUsers: [],
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload || [];
    },
    setUserTyping: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    setUserStopTyping: (state, action) => {
      state.typingUsers = state.typingUsers.filter((id) => id !== action.payload);
    },
  },
});

export const { setOnlineUsers, setUserTyping, setUserStopTyping } =
  socketSlice.actions;

export default socketSlice.reducer;
