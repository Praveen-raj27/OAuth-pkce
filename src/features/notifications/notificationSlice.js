import { createSlice } from "@reduxjs/toolkit";

const MAX_VISIBLE = 3;

const initialState = {
  active: [],
  queue: [],
};

const notificationSlice = createSlice({
  name: "notifications",

  initialState,

  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: crypto.randomUUID(),
        type: "info",
        duration: 3000,
        ...action.payload,
      };
      console.log(notification,'notification')
      // Prevent duplicate notifications
      if (notification.dedupeKey) {
        const exists =
          state.active.some(
            (item) =>
              item.dedupeKey === notification.dedupeKey
          ) ||
          state.queue.some(
            (item) =>
              item.dedupeKey === notification.dedupeKey
          );

        if (exists) {
          return;
        }
      }

      // Show immediately if there is space
      if (state.active.length < MAX_VISIBLE) {
        state.active.push(notification);
      } else {
        // Otherwise put it into queue
        state.queue.push(notification);
      }
    },

    removeNotification: (state, action) => {
      state.active = state.active.filter(
        (notification) =>
          notification.id !== action.payload
      );

      // Move next queued notification into active
      if (
        state.active.length < MAX_VISIBLE &&
        state.queue.length > 0
      ) {
        const nextNotification = state.queue.shift();

        state.active.push(nextNotification);
      }
    },

    clearNotifications: (state) => {
      state.active = [];
      state.queue = [];
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;