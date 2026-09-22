import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/notifications/notificationSlice";
import loaderReducer from '../features/loader/loaderSlice'

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
     loader: loaderReducer,
  },
});