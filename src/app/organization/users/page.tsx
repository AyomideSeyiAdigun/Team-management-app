"use client";
import UserPermissionGuard from "@/components/UserPermissionGuard";
import AddUserModal from "@/components/users/AddUserModal";
import UserTable from "@/components/users/UserTable";
import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";
import { useRoleStore } from "@/stores/roleStore";
import { useUserStore } from "@/stores/userStore";
import type { User, UserInvite } from "@/types";
 
import { useEffect, useState } from "react";

export default function UsersPage() {


 
  const [search, setSearch] = useState("");
    const { currentUser, activeOrg } = useAuthStore();
 
const orgId = activeOrg?.orgId;
  const canManageUsers = currentUser?.memberships[0]?.permissions.includes("manage_users");
  const loadUsers = useUserStore((state) => state.loadUsers);
    const loadRoles = useRoleStore((state) => state.loadRoles);
    const [combineUsers, setCombineUsers] = useState< User[]>([]);
useEffect(() => { 
 loadRoles();
 loadUsers();
  // Filter invites for the current org only
      const invites:UserInvite[] = JSON.parse(localStorage.getItem("userInvites") || "[]");
const orgInvites:UserInvite[] = invites.filter((invite: UserInvite) => invite.orgId === orgId);

// Convert to placeholder user objects
const invitedUsers:User[] = orgInvites.map((invite: UserInvite) => ({
  email: invite.email,
  role: "pending",
  status: "pending",
  orgId,
  id: invite.email, // Use email as a unique ID for simplicity
  firstName: "", // Placeholder
  lastName: "", // Placeholder
  memberships: []  , // Empty memberships
  password: '', // encrypted

  // Add any other fields you need to match User type
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
  (i: UserInvite) => i.email === invite.email && i.orgId === invite.orgId
);
    if (!alreadyInvited) {
      invites.push(invite);
      localStorage.setItem("userInvites", JSON.stringify(invites));
      setCombineUsers((prev) => [...prev, { email, role: "pending", status: "pending" , orgId, id: invite.email, firstName: "", lastName: "", memberships: [] ,password: '',}]);
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

 

   const filteredUsers:User[] = combineUsers.filter((user) => {
    const nameMatch = user.email.toLowerCase().includes(search.toLowerCase());
    return nameMatch ;
  });
  

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
 
 
        </div>
      </div>

      <UserTable
        users={filteredUsers}
      />
    </div>
                </UserPermissionGuard>
  );
}
