import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/useAuthStore";

/**
 * ⚠️ IMPORTANT:
 * Android Emulator  → http://10.0.2.2:3000
 * Physical Device   → http://YOUR_PC_IP:3000
 */
const API_BASE_URL = "http://192.168.20.129:3000/api/v1";

/* =========================
   AXIOS INSTANCE
========================= */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   AUTH TOKEN INTERCEPTOR
========================= */
let authInterceptor: number | null = null;

export function setAuthToken(token: string | null) {
  if (authInterceptor !== null) {
    api.interceptors.request.eject(authInterceptor);
  }

  if (token) {
    authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  } else {
    authInterceptor = null;
  }
}

/* =========================
   REFRESH TOKEN HANDLING
========================= */
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // ❌ No response → Network / Server down
    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    // 🔁 Handle 401 → Refresh Token
    if (
      error.response.status === 401 &&
      originalRequest?.url !== "/auth/refresh" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const res = await api.post("/auth/refresh", { refreshToken });
        const { accessToken } = res.data;

        useAuthStore.getState().setAccessToken(accessToken);
        setAuthToken(accessToken);
        onRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ❌ Other errors
    return Promise.reject(
      new Error(
        (error.response.data as any)?.message || "Something went wrong"
      )
    );
  }
);

/* =========================
   API FUNCTIONS
========================= */
export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const googleLogin = async (idToken: string) => {
  const res = await api.post("/auth/google-login", { idToken });
  return res.data;
};
