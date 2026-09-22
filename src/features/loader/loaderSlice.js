import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.count += 1;
    },

    hideLoader: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;