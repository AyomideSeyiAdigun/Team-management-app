import { decryptPassword, encryptPassword } from "@/lib/auth";
import { v4 as uuidv4 } from 'uuid';
import { create } from "zustand";
import { Membership, User } from "../types";


 ;

 
type AuthStore = {
  currentUser: User | null;
  activeOrg: Membership | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  signUp: (data: Omit<User, "id" | "memberships"> & {
    rawPassword: string;
  }) => void;
  selectOrg: (orgId: string) => void;
   setCurrentUser: (user: User) => void;
  setActiveOrg: (org: Membership) => void;
    loadActiveOrg: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({

  
  currentUser:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,

  activeOrg:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("activeOrg") || "null")
      : null,

login: (email, password) => {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email);

  if (!user) return alert("User not found.");

  const decrypted = decryptPassword(user.password);
  if (decrypted !== password) return alert("Invalid password.");

  localStorage.setItem("user", JSON.stringify(user));
  set({ currentUser: user });

  if (user.memberships.length === 1) {
    const activeOrg = user.memberships[0];
    set({ activeOrg });
    localStorage.setItem("activeOrg", JSON.stringify(activeOrg));
    window.location.href = "/organization";
  } else {
    window.location.href = "/select-organization";
  }
},


  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("activeOrg");

    set({ currentUser: null, activeOrg: null });
  },

  signUp: ({ firstName, lastName, email, rawPassword }) => {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.find((u) => u.email === email)) {
    alert("Username already exists.");
    return;
  }


  const newUser: User = {
    id: uuidv4(),
    firstName,
    lastName,
    email,
    password: encryptPassword(rawPassword),
    memberships: [], // No org yet,
    isSuperAdmin: false, // Default to false
  };

  localStorage.setItem("users", JSON.stringify([...users, newUser]));
  localStorage.setItem("user", JSON.stringify(newUser));
  set({ currentUser: newUser, activeOrg: null });
},



  selectOrg: (orgId: string) => {
    const user: User | null = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
    if (!user) return;
    const membership = user.memberships.find((m) => m.orgId === orgId) || null;
    localStorage.setItem("activeOrg", JSON.stringify(membership));
    set({ activeOrg: membership });
  },
   setCurrentUser: (user: User) => set({ currentUser: user }),
  // setActiveOrg: (org) => set({ activeOrg: org }),
    setActiveOrg: (org) => {
    localStorage.setItem("activeOrg", JSON.stringify(org));
    set({ activeOrg: org });
  },
  loadActiveOrg: () => {
    const stored = localStorage.getItem("activeOrg");
    if (stored) {
      set({ activeOrg: JSON.parse(stored) });
    }
  }

}));
