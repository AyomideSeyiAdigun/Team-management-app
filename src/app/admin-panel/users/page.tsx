"use client";

import type { Membership, Organization, User } from "@/types";
import { useEffect, useState } from "react";

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orgFilter, setOrgFilter] = useState("");

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const allOrgs = JSON.parse(localStorage.getItem("organizations") || "[]");
    setUsers(allUsers);
    setOrgs(allOrgs);
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const matchesOrg = orgFilter
      ? user.memberships?.some((m: Membership) => m.orgId === orgFilter)
      : true;

    return matchesSearch && matchesOrg;
  });

  const getOrgName = (orgId: string) =>
    orgs.find((org: Organization) => org.id === orgId)?.name || "Unknown";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border p-2 rounded w-full md:w-1/2 dark:bg-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800 w-full md:w-auto"
        >
          <option value="">All Organizations</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[70vh] border rounded shadow">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Organizations</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
            {filteredUsers.map((user, index) => (
              <tr
                key={index}
                className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {user.memberships?.map((m: Membership, i: number) => (
                    <span key={i} className="block">
                      {getOrgName(m.orgId)} ({m.role})
                    </span>
                  )) || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
