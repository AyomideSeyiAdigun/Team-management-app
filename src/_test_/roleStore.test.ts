import { useAuthStore } from "@/stores/authStore";
import { useRoleStore } from "@/stores/roleStore";

describe("Role Store", () => {
  const role = {
    id: "role-1",
    name: "Manager",
    permissions: ["view_users"],
  };

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ activeOrg: {
        orgId: "org-123",
        role: "",
        permissions: []
    } });
    useRoleStore.setState({ roles: [] });
  });

  it("adds a role", () => {
    useRoleStore.getState().addRole(role);
    expect(useRoleStore.getState().roles).toContainEqual(role);
  });

  it("updates a role", () => {
    useRoleStore.getState().addRole(role);
    const updated = { ...role, name: "Super Manager" };
    useRoleStore.getState().updateRole(updated);
    expect(useRoleStore.getState().roles[0].name).toBe("Super Manager");
  });

  it("deletes a role", () => {
    useRoleStore.getState().addRole(role);
    useRoleStore.getState().deleteRole("role-1");
    expect(useRoleStore.getState().roles).toHaveLength(0);
  });
});
