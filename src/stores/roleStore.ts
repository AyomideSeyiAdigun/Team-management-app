import { create } from "zustand";
import { useAuthStore } from "./authStore";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface RoleStore {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  addRole: (role: Role) => void;
  updateRole: (role: Role) => void;
  deleteRole: (id: string) => void;
  loadRoles: () => void;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],

  setRoles: (roles) => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    localStorage.setItem(`roles_${orgId}`, JSON.stringify(roles));
    set({ roles });
  },

  addRole: (role) => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const updated = [...get().roles, role];
    localStorage.setItem(`roles_${orgId}`, JSON.stringify(updated));
    set({ roles: updated });
  },

  updateRole: (role) => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const updated = get().roles.map((r) => (r.id === role.id ? role : r));
    localStorage.setItem(`roles_${orgId}`, JSON.stringify(updated));
    set({ roles: updated });
  },

  deleteRole: (id) => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const updated = get().roles.filter((r) => r.id !== id);
    localStorage.setItem(`roles_${orgId}`, JSON.stringify(updated));
    set({ roles: updated });
  },

  loadRoles: () => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const stored = JSON.parse(localStorage.getItem(`roles_${orgId}`) || "[]");
    set({ roles: stored });
  },
}));
