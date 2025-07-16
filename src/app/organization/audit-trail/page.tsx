"use client";

import UserPermissionGuard from "@/components/UserPermissionGuard";
import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function AuditPage() {
  const { activeOrg } = useAuthStore();
  const logs = useAuditStore((state) => state.logs);
  const loadLogs = useAuditStore((state) => state.loadLogs);

  useEffect(() => {
    loadLogs(); // load on mount
  }, [loadLogs,activeOrg]);

  
  if (!activeOrg?.orgId) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        No active organization selected.
      </div>
    );
  }

  return (
     <UserPermissionGuard requiredPermissions={["view_audit_trail"]}>

    <div className="p-6 h-full overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Audit Trail</h1>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No logs found.</p>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto ">
          <table className="min-w-full text-sm text-left border dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="p-3 border-r dark:border-gray-600">Actor</th>
                <th className="p-3 border-r dark:border-gray-600">Action</th>
                <th className="p-3 border-r dark:border-gray-600">Target</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-t dark:border-gray-600">
                  <td className="p-3">{log.actor}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.target}</td>
                  <td className="p-3 text-xs text-gray-500">
                    {dayjs(log.timestamp).format("YYYY-MM-DD HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
         </UserPermissionGuard>
  );
}
