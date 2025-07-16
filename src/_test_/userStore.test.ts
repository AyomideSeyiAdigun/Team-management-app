import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { act } from "react";
import { Membership, User } from "../types";

const testOrgId = "org-1";

describe("User Store", () => {
  const user = {
    id: "u1",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    password: "123",
    memberships: [
      {
        orgId: testOrgId,
        role: "support",
        permissions: ["view_users"],
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ activeOrg: {
      orgId: testOrgId,
      role: "support",
      permissions: ["view_users"]
    } });
    useUserStore.setState({ users: [] });
  });

  it("updates a user correctly and persists to localStorage", () => {
    const allUsers = [user];
    localStorage.setItem("users", JSON.stringify(allUsers));

    const updatedUser = {
      ...user,
      firstName: "Johnny",
    };

    act(() => {
      useUserStore.getState().updateUser(updatedUser);
    });

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    expect(storedUsers.find((u: User) => u.id === user.id).firstName).toBe("Johnny");

    const scopedUsers = useUserStore.getState().users;
    expect(scopedUsers).toHaveLength(1);
    expect(scopedUsers[0].firstName).toBe("Johnny");
  });

  it("removes user membership from a specific org", () => {
    const userWithMultipleOrgs = {
      ...user,
      memberships: [
        {
          orgId: testOrgId,
          role: "support",
          permissions: [],
        },
        {
          orgId: "org-2",
          role: "member",
          permissions: [],
        },
      ],
    };

    localStorage.setItem("users", JSON.stringify([userWithMultipleOrgs]));

    // Remove membership for testOrgId
    const updatedUser = {
      ...userWithMultipleOrgs,
      memberships: userWithMultipleOrgs.memberships.filter(
        (m) => m.orgId !== testOrgId
      ),
    };

    act(() => {
      useUserStore.getState().updateUser(updatedUser);
    });

    const stored = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = stored.find((u: User) => u.id === user.id);
    expect(updated.memberships.some((m: Membership) => m.orgId === testOrgId)).toBe(false);
  });
});
