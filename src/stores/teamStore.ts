import { create } from "zustand";
import { useAuthStore } from "./authStore";

interface Team {
  id: string;
  name: string;
  members: string[]; // user emails or ids
}

interface TeamStore {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  loadTeams: () => void;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],

  setTeams: (teams) => set({ teams }),

  addTeam: (team) => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const updated = [...get()?.teams, team];
    localStorage.setItem(`teams_${orgId}`, JSON.stringify(updated));
    set({ teams: updated });
  },

  updateTeam: (team) => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const updated = get().teams.map((t) => (t.id === team.id ? team : t));
    localStorage.setItem(`teams_${orgId}`, JSON.stringify(updated));
    set({ teams: updated });
  },

  deleteTeam: (id) => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const updated = get().teams.filter((t) => t.id !== id);
    localStorage.setItem(`teams_${orgId}`, JSON.stringify(updated));
    set({ teams: updated });
  },

  loadTeams: () => {
    const orgId = useAuthStore.getState().activeOrg?.orgId;
    const stored = JSON.parse(localStorage.getItem(`teams_${orgId}`) || "[]");
    set({ teams: stored });
  },
}));
