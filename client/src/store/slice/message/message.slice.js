import { createSlice } from "@reduxjs/toolkit";
import { getMessageThunk, sendMessageThunk } from "./message.thunk";
import { logoutUserThunk } from "../user/user.thunk";

const initialState = {
  buttonLoading: false,
  screenLoading: false,
  messages: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setNewMessage: (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload];
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    // send message
    builder.addCase(sendMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload?.responseData];
      state.buttonLoading = false;
    });
    builder.addCase(sendMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // get messages
    builder.addCase(getMessageThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getMessageThunk.fulfilled, (state, action) => {
      state.messages = action.payload?.responseData?.messages ?? [];
      state.screenLoading = false;
    });
    builder.addCase(getMessageThunk.rejected, (state) => {
      state.screenLoading = false;
      state.messages = [];
    });

    // clear on logout
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.messages = [];
    });
  },
});

export const { setNewMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
