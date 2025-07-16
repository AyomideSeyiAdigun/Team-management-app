import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";

describe("Audit Store", () => {
  const mockEntry = {
    actor: "admin@example.com",
    action: "created user",
    target: "John Doe",
    timestamp: new Date().toISOString(),
    orgId: "org-123",
  };

  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ activeOrg: {
      orgId: "org-123",
      role: "support",
      permissions: ["manage_users"]
    } });
    useAuditStore.setState({ logs: [] });
  });

  it("adds a log entry and saves to localStorage", () => {
    useAuditStore.getState().addLog(mockEntry);
    const logs = useAuditStore.getState().logs;
    expect(logs[0].action).toBe("created user");
    expect(JSON.parse(localStorage.getItem("audit_org-123") || "[]").length).toBeGreaterThan(0);
  });

  it("loads logs for the active organization", () => {
    localStorage.setItem("audit_org-123", JSON.stringify([mockEntry]));
    useAuditStore.getState().loadLogs();
    expect(useAuditStore.getState().logs[0].target).toBe("John Doe");
  });
});
