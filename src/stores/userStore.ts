import { create } from "zustand";
import { useAuthStore } from "./authStore";

interface User {
  id: string;
  email: string;
  memberships: any[];
  [key: string]: any;
}

interface UserStore {
  users: User[];
  setUsers: (users: User[]) => void;
  loadUsers: () => void;
  updateUser: (updatedUser: User) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],

  // setUsers: (users) => set({ users }),
    setUsers: (users) => {
    localStorage.setItem(`users`, JSON.stringify(users));
    set({ users });
  },

  loadUsers: () => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const filtered = allUsers.filter((u: User) =>
      u.memberships?.some((m: any) => m.orgId === orgId)
    );

    set({ users: filtered });
  },

  updateUser: (updatedUser: User) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Replace the old user
    const updatedUserList = allUsers.map((u: User) =>
      u.id === updatedUser.id ? updatedUser : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUserList));

    // Update users list scoped to activeOrg
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const filtered = updatedUserList.filter((u: User) =>
      u.memberships?.some((m: any) => m.orgId === orgId)
    );

    set({ users: filtered });
  },
}));
