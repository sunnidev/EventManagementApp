import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../api/apiClient";

export interface User {
  id: string;
  name: string;
  email: string;
  profilePic: string;
}

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        setAuthToken(accessToken);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      setAccessToken: (token) => {
        setAuthToken(token);
        set({ accessToken: token });
      },

      logout: () => {
        setAuthToken(null);
        AsyncStorage.removeItem("auth-storage");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAuthToken(state.accessToken);
        }
      },
    }
  )
);
