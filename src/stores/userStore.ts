import type { Membership, User } from "@/types";
import { create } from "zustand";
import { useAuthStore } from "./authStore";
 

interface UserStore {
  users: User[];
  setUsers: (users:User[]) => void;
  loadUsers: () => void;
  updateUser: (updatedUser: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],

  // setUsers: (users) => set({ users }),
    setUsers: (users) => {
    localStorage.setItem(`users`, JSON.stringify(users));
    set({ users });
  },

  loadUsers: () => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    // const allUsers:User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // const filtered:User[] = allUsers.filter((u: User) =>
    //   u.memberships?.some((m: Membership) => m.orgId === orgId)
    // );
    const stored = localStorage.getItem("users");
let allUsers: User[] = [];

try {
  const parsed = JSON.parse(stored || "[]");
  allUsers = Array.isArray(parsed) ? parsed : [];
} catch (error) {
  console.error("Failed to parse users from localStorage", error);
  allUsers = [];
}

const filtered: User[] = allUsers.filter((u: User) =>
  u.memberships?.some((m: Membership) => m.orgId === orgId)
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
      u.memberships?.some((m: Membership) => m.orgId === orgId)
    );

    set({ users: filtered });
  },
}));
