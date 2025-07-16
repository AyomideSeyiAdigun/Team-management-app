"use client";
import type { Membership, Organization } from "@/types";
import { User } from "@/types";
import { useEffect, useState } from "react";

export default function ChangeAdminModal({
  orgId,
  onClose,
  onSave,
}: {
  orgId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [orgData, setOrgData] = useState<Organization>( {  id: "",
  name: "",
  address: "",
  admins: []});

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]");

    const org = orgs.find((o: Organization) => o.id === orgId);
    setOrgData(org || {});

    const orgUsers = allUsers.filter((u: User) =>
      u.memberships?.some((m: Membership) => m.orgId === orgId)
    );

    const currentAdmins = orgUsers
      .filter((u: User) =>
        u.memberships?.some((m: Membership) => m.orgId === orgId && m.role === "org_admin")
      )
      .map((u: User) => u.email);

    setSelectedAdmins(currentAdmins);
    setUsers(orgUsers);
  }, [orgId]);

  const toggleAdmin = (email: string) => {
    if (selectedAdmins.includes(email)) {
      setSelectedAdmins(selectedAdmins.filter((e) => e !== email));
    } else {
      setSelectedAdmins([...selectedAdmins, email]);
    }
  };

  const handleSave = () => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const updatedUsers = allUsers.map((user: User) => {
      if (user.memberships) {
        user.memberships = user.memberships.map((m: Membership) => {
          if (m.orgId === orgId) {
            if (selectedAdmins.includes(user.email)) {
              m.role = "org_admin";
              m.permissions = [
                "view_users",
                "manage_users",
                "view_teams",
                "manage_teams",
                "view_roles",
                "manage_roles",
                "view_audit_trail",
              ];
            } else if (m.role === "org_admin") {
              m.role = "support";
              m.permissions = ["view_teams", "view_roles", "view_users"];
            }
          }
          return m;
        });
      }
      return user;
    });

    const updatedOrgs = JSON.parse(localStorage.getItem("organizations") || "[]").map((o: Organization) => {
      if (o.id === orgId) return { ...o, name: orgData.name, address: orgData.address };
      return o;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("organizations", JSON.stringify(updatedOrgs));

    const logs = JSON.parse(localStorage.getItem("auditLogs") || "[]");
    logs.push({
      actor: "Super Admin",
      action: "Edited Organization + Admins",
      target: orgData.name,
      timestamp: new Date().toISOString(),
      orgId,
    });
    localStorage.setItem("auditLogs", JSON.stringify(logs));

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded w-[90%] max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Organization</h2>

        <input
          className="w-full mb-2 p-2 rounded border dark:bg-gray-700"
          placeholder="Organization Name"
          value={orgData.name}
          onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
        />
        <input
          className="w-full mb-4 p-2 rounded border dark:bg-gray-700"
          placeholder="Address"
          value={orgData.address}
          onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
        />

        <p className="font-semibold mb-2">Assign Admins:</p>
        <div className="max-h-[200px] overflow-y-auto space-y-1 mb-4">
          {users.map((u) => (
            <label key={u.email} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedAdmins.includes(u.email)}
                onChange={() => toggleAdmin(u.email)}
              />
              <span>{u.firstName} {u.lastName} ({u.email})</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
