import type { Organization } from "@/types"; // define this in your types
import { create } from "zustand";

interface OrganizationStore {
  organizations: Organization[];
  setOrganizations: (orgs: Organization[]) => void;
  addOrganization: (org: Organization) => void;
  deleteOrganization: (orgId: string) => void;
  loadOrganizations: () => void;
}

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
  organizations: [],

  setOrganizations: (orgs) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("organizations", JSON.stringify(orgs));
    }
    set({ organizations: orgs });
  },

  addOrganization: (org) => {
    const current = get().organizations;
    const updated = [...current, org];
    if (typeof window !== "undefined") {
      localStorage.setItem("organizations", JSON.stringify(updated));
    }
    set({ organizations: updated });
  },

  deleteOrganization: (orgId) => {
    const filtered = get().organizations.filter((o) => o.id !== orgId);
    if (typeof window !== "undefined") {
      localStorage.setItem("organizations", JSON.stringify(filtered));
    }
    set({ organizations: filtered });
  },

  loadOrganizations: () => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("organizations") || "[]");
      set({ organizations: data });
    }
  },
}));
