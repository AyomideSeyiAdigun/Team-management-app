import { create } from "zustand";
import { LogEntry } from "../types";
import { useAuthStore } from "./authStore";

 
interface AuditStore {
  logs: LogEntry[];
  loadLogs: () => void;
  addLog: (entry: LogEntry) => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  logs: [],
  

  loadLogs: () => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
       const key = `audit_${orgId}`;
    const allLogs = JSON.parse(localStorage.getItem(key) || "[]");
    set({ logs: allLogs.reverse() }); // newest first
  },

  addLog: (entry) => {
      const orgId = useAuthStore.getState().activeOrg?.orgId;
       const key = `audit_${orgId}`;
    const logs = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [entry, ...logs];
    localStorage.setItem(key, JSON.stringify(updated));
 
    set({ logs: updated });
  },
}));
