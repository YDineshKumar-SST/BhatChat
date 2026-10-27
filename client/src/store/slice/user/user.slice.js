import { createSlice } from "@reduxjs/toolkit";
import {
  getOtherUsersThunk,
  getUserProfileThunk,
  loginUserThunk,
  logoutUserThunk,
  registerUserThunk,
  updateProfileThunk,
} from "./user.thunk";

const safeGetSelectedUser = () => {
  try {
    const stored = localStorage.getItem("selectedUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialState = {
  isAuthenticated: false,
  userProfile: null,
  otherUsers: [],
  selectedUser: safeGetSelectedUser(),
  buttonLoading: false,
  screenLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      if (action.payload) {
        localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("selectedUser");
      }
      state.selectedUser = action.payload;
    },
    handleUserUpdated: (state, action) => {
      const updatedUser = action.payload;
      if (!updatedUser?._id) return;

      // If it's me
      if (state.userProfile?._id === updatedUser._id) {
        state.userProfile = { ...state.userProfile, ...updatedUser };
      }

      // If it's the currently selected user
      if (state.selectedUser?._id === updatedUser._id) {
        state.selectedUser = { ...state.selectedUser, ...updatedUser };
        localStorage.setItem("selectedUser", JSON.stringify(state.selectedUser));
      }

      // Update in otherUsers array
      if (Array.isArray(state.otherUsers)) {
        state.otherUsers = state.otherUsers.map((u) =>
          u._id === updatedUser._id ? { ...u, ...updatedUser } : u
        );
      }
    },
  },
  extraReducers: (builder) => {
    // login user
    builder.addCase(loginUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      const user =
        action.payload?.responseData?.user ||
        action.payload?.responseData?.newUser;
      const token = action.payload?.responseData?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      state.userProfile = user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // register user
    builder.addCase(registerUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      const user =
        action.payload?.responseData?.user ||
        action.payload?.responseData?.newUser;
      const token = action.payload?.responseData?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      state.userProfile = user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // logout user
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = [];
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("selectedUser");
    });
    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = [];
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("selectedUser");
    });

    // get user profile
    builder.addCase(getUserProfileThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.screenLoading = false;
      state.userProfile = action.payload?.responseData;
    });
    builder.addCase(getUserProfileThunk.rejected, (state) => {
      state.screenLoading = false;
      state.isAuthenticated = false;
      state.userProfile = null;
    });

    // get other users
    builder.addCase(getOtherUsersThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
      state.otherUsers = action.payload?.responseData ?? [];
    });
    builder.addCase(getOtherUsersThunk.rejected, (state) => {
      state.buttonLoading = false;
      state.otherUsers = [];
    });

    // update profile
    builder.addCase(updateProfileThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
      const updated = action.payload?.responseData;
      if (updated) {
        state.userProfile = updated;
        if (state.selectedUser?._id === updated._id) {
          state.selectedUser = updated;
          localStorage.setItem("selectedUser", JSON.stringify(updated));
        }
      }
    });
    builder.addCase(updateProfileThunk.rejected, (state) => {
      state.buttonLoading = false;
    });
  },
});

export const { setSelectedUser, handleUserUpdated } = userSlice.actions;

export default userSlice.reducer;
