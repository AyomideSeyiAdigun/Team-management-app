"use client";
import UserPermissionGuard from "@/components/UserPermissionGuard";
import AddUserModal from "@/components/users/AddUserModal";
import UserTable from "@/components/users/UserTable";
import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";
import { useRoleStore } from "@/stores/roleStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

export default function UsersPage() {
 
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
    const { currentUser, activeOrg } = useAuthStore();
 
const orgId = activeOrg?.orgId;
  const canManageUsers = currentUser?.memberships[0]?.permissions.includes("manage_users");

  const users = useUserStore((state) => state.users);
  const loadUsers = useUserStore((state) => state.loadUsers);
     const roles = useRoleStore((state) => state.roles);
    const loadRoles = useRoleStore((state) => state.loadRoles);
    const [combineUsers, setCombineUsers] = useState<any[]>([]);
useEffect(() => { 
 loadRoles();
 loadUsers();
  // Filter invites for the current org only
      const invites = JSON.parse(localStorage.getItem("userInvites") || "[]");
const orgInvites = invites.filter((invite: any) => invite.orgId === orgId);

// Convert to placeholder user objects
const invitedUsers = orgInvites.map((invite: any) => ({
  email: invite.email,
  role: "pending",
  status: "pending",
  orgId,
}));


 setCombineUsers([...useUserStore.getState().users, ...invitedUsers]);
}, [orgId, loadRoles, loadUsers]);

 

  const inviteUser = (email: string) => {
    if (!canManageUsers) {
      alert("You do not have permission to invite users.");
      return;
    }
   
    const invites = JSON.parse(localStorage.getItem("userInvites") || "[]");
const invite = {
  email: email.toLowerCase(),
  orgId: activeOrg?.orgId ?? "",
  role: "support", // auto-assign support role
};
 const alreadyInvited = invites.some(
  (i: any) => i.email === invite.email && i.orgId === invite.orgId
);
    if (!alreadyInvited) {
      invites.push(invite);
      localStorage.setItem("userInvites", JSON.stringify(invites));
      setCombineUsers((prev) => [...prev, { email, role: "pending", status: "pending" }]);
    }
     // log it
   useAuditStore.getState().addLog({
    actor: currentUser?.email ?? "unknown",
    action: "invited user",
    target: invite.email,
    orgId: activeOrg?.orgId ?? "",
    timestamp: new Date().toISOString(),
  });
  };

const filteredUsers = filter
  ? combineUsers.filter((u) => u.role === filter)
  : combineUsers;

  return (
            <UserPermissionGuard requiredPermissions={["view_users"]}>



    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Users</h1>

      <div className="flex justify-between mb-4">
    { canManageUsers&&   <AddUserModal onInvite={inviteUser} />}
        <div className="flex items-center space-x-2">
          <input
            placeholder="Search by email"
            className="border px-3 py-2 rounded dark:bg-gray-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
 <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="border px-3 py-2 rounded dark:bg-gray-800"
>
  <option value="">All Roles</option>
  {roles.map((role: any) => (
    <option key={role.id} value={role.name}>
      {role.name}
    </option>
  ))}
</select>
        </div>
      </div>

      <UserTable
        users={filteredUsers}
      />
    </div>
                </UserPermissionGuard>
  );
}
