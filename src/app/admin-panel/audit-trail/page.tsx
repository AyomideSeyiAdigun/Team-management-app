"use client";

import type { LogEntry, Organization } from "@/types";
import { useEffect, useState } from "react";

export default function SuperAdminAuditTrailPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]");
    setOrganizations(orgs);

    const allLogs: LogEntry[] = [];

    // Load global super-admin logs
    const globalLogs = JSON.parse(localStorage.getItem("auditLogs") || "[]").map((log: Organization) => ({
      ...log,
      orgId: "super_admin",
      orgName: "Super Admin",
    }));

    allLogs.push(...globalLogs);

    // Load each org's audit logs
    orgs.forEach((org: Organization) => {
      const orgLogs = JSON.parse(localStorage.getItem(`audit_${org.id}`) || "[]");
      allLogs.push(
        ...orgLogs.map((log: Organization) => ({
          ...log,
          orgId: org.id,
          orgName: org.name,
        }))
      );
    });

    // Sort all logs by timestamp (descending)
    const sorted = allLogs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setLogs(sorted);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.orgId === filter;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audit Trail</h1>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Filter by:</label>
        <select
          className="border px-3 py-2 rounded dark:bg-gray-800"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Logs</option>
          <option value="super_admin">Super Admin</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto max-h-[70vh] border rounded">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0">
            <tr>
              <th className="p-2 text-left">Actor</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Target</th>
              <th className="p-2 text-left">Organization</th>
              <th className="p-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr key={idx} className="border-t dark:border-gray-700">
                  <td className="p-2">{log.actor}</td>
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{log.target}</td>
                  <td className="p-2">{log.orgName || "—"}</td>
                  <td className="p-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
