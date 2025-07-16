import { useAuthStore } from "@/stores/authStore";

describe("Auth Store", () => {
  beforeEach(() => localStorage.clear());

  it("sets and gets current user", () => {
    const user = { id: "u1", email: "a@b.com", firstName: "A", lastName: "B", password: "", memberships: [] };
    useAuthStore.getState().setCurrentUser(user);
    expect(useAuthStore.getState().currentUser?.email).toBe("a@b.com");
  });

  it("logs out", () => {
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().currentUser).toBeNull();
  });
});
