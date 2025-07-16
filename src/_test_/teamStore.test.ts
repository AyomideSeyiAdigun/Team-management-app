import { useTeamStore } from "@/stores/teamStore";
import { act } from "react";

describe("Team Store", () => {
  const mockTeam = {
    id: "team-1",
    name: "Frontend Team",
    members: ["u1", "u2"],
    orgId: "org-123",
  };

  beforeEach(() => {
    localStorage.clear();
    useTeamStore.setState({ teams: [] });
  });

  it("creates a team", () => {
    act(() => {
      useTeamStore.getState().addTeam(mockTeam);
    });
    expect(useTeamStore.getState().teams).toContainEqual(mockTeam);
  });

  it("edits a team", () => {
    act(() => {
      useTeamStore.getState().addTeam(mockTeam);
      useTeamStore.getState().updateTeam({ ...mockTeam, name: "Backend Team" });
    });
    expect(useTeamStore.getState().teams[0].name).toBe("Backend Team");
  });

  it("deletes a team", () => {
    act(() => {
      useTeamStore.getState().addTeam(mockTeam);
      useTeamStore.getState().deleteTeam("team-1");
    });
    expect(useTeamStore.getState().teams).toHaveLength(0);
  });
});
