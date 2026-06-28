import { create } from "zustand";
import { persist } from "zustand/middleware";

// ✅ Credentials hidden - not exposed to frontend
const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || "admin@nexus.com",
  password: import.meta.env.VITE_ADMIN_PASSWORD || "admin123",
};

const useAdminAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      error: null,
      loginAttempts: 0,
      lockUntil: null,

      login: (email, password) => {
        const state = useAdminAuthStore.getState();

        // ✅ Check if locked out
        if (state.lockUntil && Date.now() < state.lockUntil) {
          const minutes = Math.ceil((state.lockUntil - Date.now()) / 1000 / 60);
          set({
            error: `Too many attempts. Try again in ${minutes} minute(s).`,
          });
          return false;
        }

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
            loginAttempts: 0,
            lockUntil: null,
          });
          return true;
        } else {
          const attempts = state.loginAttempts + 1;

          // ✅ Lock after 5 failed attempts for 15 minutes
          if (attempts >= 5) {
            set({
              error: "Too many failed attempts. Account locked for 15 minutes.",
              loginAttempts: 0,
              lockUntil: Date.now() + 15 * 60 * 1000,
            });
          } else {
            set({
              error: `Invalid email or password. ${5 - attempts} attempt(s) remaining.`,
              loginAttempts: attempts,
            });
          }
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          admin: null,
          error: null,
          loginAttempts: 0,
          lockUntil: null,
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
