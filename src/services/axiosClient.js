

import axios from "axios";
import { store } from "../app/store";
import {
  showLoader,
  hideLoader,
} from "../features/loader/loaderSlice";

const api = axios.create({
  baseURL: "https://www.googleapis.com/calendar/v3/calendars/primary",
});

api.interceptors.request.use(
  (config) => {
    store.dispatch(showLoader());

  const token = sessionStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
  },
  (error) => {
    store.dispatch(hideLoader());

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoader());

    return response;
  },
  (error) => {
    store.dispatch(hideLoader());

    return Promise.reject(error);
  }
);

export default api;