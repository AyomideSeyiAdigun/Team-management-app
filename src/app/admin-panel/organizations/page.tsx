"use client";

import ChangeAdminModal from "@/components/super-admin/ChangeAdminModal";
import CreateOrganizationModal from "@/components/super-admin/CreateOrganizationModal";
import type { Membership, Organization, User } from "@/types";
import { useEffect, useState } from "react";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filter] = useState("");
  const [editOrgId, setEditOrgId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setOrgs(JSON.parse(localStorage.getItem("organizations") || "[]"));
    setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
  }, []);

  const handleDelete = (orgId: string) => {
    if (!confirm("Delete this organization?")) return;

    const newOrgs = orgs.filter((o) => o.id !== orgId);
    localStorage.setItem("organizations", JSON.stringify(newOrgs));

    localStorage.removeItem(`teams_${orgId}`);
    localStorage.removeItem(`roles_${orgId}`);

    const updatedUsers = users.map((user) => {
      const filtered = user.memberships?.filter((m: Membership) => m.orgId !== orgId) || [];
      return { ...user, memberships: filtered };
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const logs = JSON.parse(localStorage.getItem("auditLogs") || "[]");
    logs.push({
      actor: "Super Admin",
      action: "Deleted Organization",
      target: orgId,
      timestamp: new Date().toISOString(),
      orgId,
    });
    localStorage.setItem("auditLogs", JSON.stringify(logs));

    setOrgs(newOrgs);
    setUsers(updatedUsers);
  };

  const getUserCount = (orgId: string) =>
    users.filter((u) => u.memberships?.some((m: Membership) => m.orgId === orgId)).length;

  const getTeamCount = (orgId: string) =>
    JSON.parse(localStorage.getItem(`teams_${orgId}`) || "[]").length;

  const getAdmins = (orgId: string) => {
    return users
      .filter((u) =>
        u.memberships?.some((m: Membership) => m.orgId === orgId && m.role === "org_admin")
      )
      .map((u) => u.email)
      .join(", ") || "—";
  };

  const filteredOrgs = orgs.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filter || o.id === filter)
  );

  return (
    <div  className="relative">
 
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <button onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Organization
        </button>
      </div>


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          placeholder="Search organization"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2 dark:bg-gray-800"
        />
 
      </div>

      <div className="overflow-auto max-h-[70vh] border rounded shadow">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Users</th>
              <th className="p-2 text-left">Teams</th>
              <th className="p-2 text-left">Admins</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrgs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4">No organizations found.</td></tr>
            ) : (
              filteredOrgs.map((org) => (
                <tr key={org.id} className="border-t dark:border-gray-700">
                  <td className="p-2">{org.name}</td>
                  <td className="p-2">{org.address}</td>
                  <td className="p-2">{getUserCount(org.id)}</td>
                  <td className="p-2">{getTeamCount(org.id)}</td>
                  <td className="p-2">{getAdmins(org.id)}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => setEditOrgId(org.id)}
                      className="bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(org.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editOrgId && (
        <ChangeAdminModal
          orgId={editOrgId}
          onClose={() => setEditOrgId(null)}
          onSave={() => {
            setOrgs(JSON.parse(localStorage.getItem("organizations") || "[]"));
            setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
          }}
        />
      )}
       {showCreateModal && (
        <CreateOrganizationModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
