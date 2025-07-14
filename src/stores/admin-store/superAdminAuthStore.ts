import { create } from "zustand";

interface SuperAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isSuperAdmin: true;
}

interface SuperAdminAuthState {
  currentAdmin: SuperAdmin | null;
  login: (admin: SuperAdmin) => void;
  logout: () => void;
}

export const useSuperAdminAuthStore = create<SuperAdminAuthState>((set) => ({
  currentAdmin: null,
  login: (admin) => {
    localStorage.setItem("superAdminSession", JSON.stringify(admin));
    set({ currentAdmin: admin });
  },
  logout: () => {
    localStorage.removeItem("superAdminSession");
    set({ currentAdmin: null });
  },
}));
