// types
import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  auth: { token: null, userInfo: null, isAuthenticated: false },
};

// ==============================|| SLICE - CUSTOMER ||============================== //

const userAuth = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.auth = action.payload;
    },
    setLogOut(state, action) {
      state.auth = initialState.auth;
    },
  },
});

export default userAuth.reducer;

export const { setAuth, setLogOut } = userAuth.actions;
export const auth = (state: { userAuth: { auth: any } }) => state.userAuth.auth;
