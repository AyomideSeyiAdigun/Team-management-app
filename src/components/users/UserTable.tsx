"use client";
import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import type { User, UserInvite } from "@/types";
import { Membership, Role } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserTable({
  users,
}: {
  users: User[];
}) {
  const { currentUser, activeOrg } = useAuthStore();
  const orgId = activeOrg?.orgId;
  const rolesKey = `roles_${orgId}`;
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();
  const canManageUsers = currentUser?.memberships[0]?.permissions.includes("manage_users");
  useEffect(() => {
    const r = JSON.parse(localStorage.getItem(rolesKey) || "[]");
    setRoles(r);
  }, [orgId,rolesKey]);


   const getUserStatus = (user: User) => {
    if (!user) return "unknown";
    
    const isSignedUp = user.firstName || user.lastName;
    return isSignedUp ? "active" : "pending";
 
  };

  const handleRoleChange = (email: string, newRole: string) => {
  if (!canManageUsers) {
      alert("You do not have permission to change user roles.");
      return;
    }

  // Step 2: Map through users and update role if email + org match
  const updatedUsers:User[] = users.map((user: User) => {

    if (user.email === email && user.status!== "pending") {
      
      const updatedMemberships = user.memberships?.map((membership: Membership) => {
        if (membership.role === "Org Admin" || newRole === "Org Admin") {
          alert("You cannot change the role of an organization admin or assign that role to a user.");
          return membership;
          
        }
        if (membership.orgId === orgId) {
          return {
            ...membership,
            role: newRole,
          };
        }
        return membership;
      });

      return {
        ...user,
        memberships: updatedMemberships,
      };
    }
    return user;
  });

  useUserStore.getState().setUsers(updatedUsers);

     useAuditStore.getState().addLog({
      actor: currentUser?.email || "unknown",
      action: "changed user role",
      target: `${email} → ${newRole}`,
      orgId: orgId || "",
      timestamp: new Date().toISOString(),
    });



  
    router.refresh();
  };

  function formatRole(role: string) {
  return role
    .split("_") // split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each part
    .join(" ");
}

  const handleDelete = (email: string) => { 
    if (!canManageUsers) {
      alert("You do not have permission to change user roles.");
      return;
    }
    const user:User|undefined = users.find((u) => u.email === email);
    if (!user) {
      alert("User not found.");
      return;
    }

    if (user.status === "pending") {
      alert("Deleting this user means their invite will be cancelled.");
      const invites = JSON.parse(localStorage.getItem("userInvites") || "[]");
      const remainingInvites = invites.filter((invite: UserInvite) => invite.email !== user.email);
     localStorage.setItem("userInvites", JSON.stringify(remainingInvites));
      window.location.reload();
      return;
    }
 

 

    if (user?.memberships[0]?.role === "org_admin") {
      alert("You cannot delete an organization admin.");
      return;
    }
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;
    
    // const filtered = users.filter((u) => u.email !== email);

const updatedGlobalUsers:User[] = users.map((u: User) => {
  if (u.email === email ) {
    return {
      ...u,
      memberships: ( u.memberships || []).filter((m: Membership) => m.orgId !== orgId),
    };
  }
  return u;
});

    useUserStore.getState().setUsers(updatedGlobalUsers);

     useAuditStore.getState().addLog({
      actor: currentUser?.email || "unknown",
      action: "deleted user",
      target: email,
      orgId: orgId || "",
      timestamp: new Date().toISOString(),
    });
    router.refresh();
       
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700">
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Role</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user:User) =>{

  const membership =   user?.memberships?.find(
    (m: Membership) => m.orgId === orgId
  );
  
  const roleNow = membership?.role || "N/A";
  const displayRole = formatRole(roleNow); 
        return(
          
          <tr key={user.email} className="border-b dark:border-gray-600">
            <td className="p-3">
              {user.firstName || "-"} {user.lastName || "-"}
            </td>
            <td className="p-3">{user.email}</td>
            <td className="p-3">
              <select
                value={displayRole}
                onChange={(e) => handleRoleChange(user.email, e.target.value)}
                className="border rounded px-2 py-1 dark:bg-gray-700"
              >
                {roles.map((role: Role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </td>
                 <td className="p-3 text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    getUserStatus(user) === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {getUserStatus(user)}
                </span>
              </td>
            <td className="p-3">
              {user.role === "org_admin" ? (
                <span className="text-gray-400 text-sm italic">
                  Cannot delete
                </span>
              ) : (
                <button
                  onClick={() => handleDelete(user.email)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        )})}
      </tbody>
    </table>
  );
}
