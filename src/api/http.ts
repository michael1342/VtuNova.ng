import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import useAuthStore from "./store";
import ApiError from "./ApiError";

const BASE_URL ='https://vtunova-ng-backend-v1.onrender.com/api' 

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

// Attach access token
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses/errors
http.interceptors.response.use(
  (response) => response.data,


  async (error: AxiosError<any>) => {
      
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // ------------------------------------------------
    // 1. Try refreshing an expired access token
    // ------------------------------------------------
    if (
      error.response?.status === 401 &&
          
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
            console.log(error.response)
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(
              `${BASE_URL}/auth/refresh-token`,
              {},
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              const token = res.data.token;

              if (!token) {
                throw new Error("No access token returned");
              }

              useAuthStore.getState().setAccessToken(token);

              return token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const token = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${token}`;
        // refreshPromise = null;
        // originalRequest._retry = false;
        return http(originalRequest);
      } catch (err) {
        // console.log(refreshError)
      
        useAuthStore.getState().clearAuth();
      }
    }

    // ------------------------------------------------
    // 2. Request cancelled
    // ------------------------------------------------
    if (axios.isCancel(error)) {
      return Promise.reject(
        new ApiError({
          message: "Request cancelled.",
          isCancel: true,
        })
      );
    }

    // ------------------------------------------------
    // 3. Network / timeout error
    // ------------------------------------------------
    if (!error.response) {
      console.error(error);
      return Promise.reject(
        new ApiError({
          message:
            error.code === "ECONNABORTED"
              ? "The request timed out. Please try again."
              : "Network error. Check your connection.",
          code: error.code,
          isNetwork: true,
        })
      );
    }

    // ------------------------------------------------
    // 4. Server responded with an error
    // ------------------------------------------------
    const { status, data } = error.response;
     console.error(error);
    if (status === 404) {
     
      return Promise.reject(
        new ApiError({
          message:
            data?.message ||
            "The requested resource could not be found.",
          code: "NOT_FOUND",
          status: 404,
        })
      );
    }

    if (status === 401) {
      
      return Promise.reject(
        new ApiError({
          message: data?.message || "User is unauthorized.",
          code: "INVALID_CREDENTIALS",
          status: 401,
        })
      );
    }

    if (status === 403) {
      return Promise.reject(
        new ApiError({
          message: data?.message || "Forbidden request.",
          code: "FORBIDDEN",
          status: 403,
        })
      );
    }

    if (status === 429) {
      return Promise.reject(
        new ApiError({
          message:
            data?.message || "Too many requests. Try again later.",
          code: "TOO_MANY_REQUESTS",
          status: 429,
        })
      );
    }

    if (status === 400) {
      return Promise.reject(
        new ApiError({
          message:
            data?.message ||
            "Bad request. Please check your request.",
          status: 400,
        })
      );
    }

    // ------------------------------------------------
    // 5. Other API errors
    // ------------------------------------------------
    return Promise.reject(
      new ApiError({
        message:
          data?.message || "Something went wrong.",
        status,
        code: error.code,
      })
    );
  }
);

export default http;