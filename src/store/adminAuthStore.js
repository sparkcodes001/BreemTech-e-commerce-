import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_CREDENTIALS = {
  email: "admin@nexus.com",
  password: "admin123",
};

const useAdminAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      error: null,

      login: (email, password) => {
        if (
          email === ADMIN_CREDENTIALS.email &&
          password === ADMIN_CREDENTIALS.password
        ) {
          set({
            isAuthenticated: true,
            admin: {
              name: "Admin",
              email,
              avatar: "A",
              role: "Super Admin",
            },
            error: null,
          });
          return true;
        } else {
          set({ error: "Invalid email or password" });
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          admin: null,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth",
    },
  ),
);

export default useAdminAuthStore;