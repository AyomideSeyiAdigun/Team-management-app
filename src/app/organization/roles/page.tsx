"use client";
import RoleModal from "@/components/roles/AddRoleModal";
import RoleList from "@/components/roles/RoleList";
import UserPermissionGuard from "@/components/UserPermissionGuard";
import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";
import { useRoleStore } from "@/stores/roleStore";
import { useUserStore } from "@/stores/userStore";
import type { Membership, Role } from "@/types";
import { useEffect, useState } from "react";

export default function RolesPage() {
  const { currentUser, activeOrg } = useAuthStore();
  const orgId = activeOrg?.orgId;
  const canManageRoles = currentUser?.memberships[0]?.permissions.includes("manage_roles");

  // const [roles, setRoles] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role|null>(null);

   const roles = useRoleStore((state) => state.roles);
  const loadRoles = useRoleStore((state) => state.loadRoles);


const users = useUserStore((state) => state.users);
const loadUsers = useUserStore((state) => state.loadUsers);


  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [loadRoles,orgId,loadUsers]);

  const saveRole = (role: Role) => {

     if (role.id === "default" || role.id === "org_admin" || role.id === "support") {
      alert("You cannot edit the default role.");
      return;
    }
    if (!canManageRoles) {
      alert("You do not have permission to manage roles.");
      return;
    }
    const exists = roles.some((r) => r.id === role.id);

    if (exists) {
        useRoleStore.getState().updateRole(role)
    }else{
    useRoleStore.getState().addRole(role);;
    }
    
      //  Log the creation or update

  useAuditStore.getState().addLog({
   actor: currentUser?.email || "unknown",
    action: exists ? "updated role" : "created role",
    target: role.name,
    orgId: activeOrg?.orgId || "unknown_org",
  timestamp: new Date().toISOString(),
});
  };

  const handleDelete = (role:Role) => {

    if (role.id === "default" || role.id === "org_admin" || role.id === "support") {
      alert("You cannot delete the default role.");
      return;
    }
    
      if (!canManageRoles) {
      alert("You do not have permission to manage roles.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to delete this role?");
    if (!confirmed) return;
    useRoleStore.getState().deleteRole(role.id);

  //  Get support role from updated roles
  const supportRole = roles.find((r) => r.id === "support");
  if (!supportRole) {
    alert("Support role not found. Cannot fallback users.");
    return;
  }

  //  Update users with deleted role
  const updatedUsers = users.map((user) => {
    const updatedMemberships = user.memberships?.map((membership: Membership) => {
      if (membership.orgId === orgId && membership.role === role.name) {
        return {
          ...membership,
          role: "Support",
          permissions: supportRole.permissions,
        };
      }
      return membership;
    });

    return {
      ...user,
      memberships: updatedMemberships,
    };
  });

    useUserStore.getState().setUsers(updatedUsers);

 

    useAuditStore.getState().addLog({
  actor: currentUser?.email || "unknown",
    action:  "deleted role",
    target: role.name,
    orgId: activeOrg?.orgId || "unknown_org",
  timestamp: new Date().toISOString(),
});
  alert("Role deleted. Affected users updated to support.");
  };


  return (
         <UserPermissionGuard requiredPermissions={["view_roles"]}>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Roles</h1>

      {canManageRoles&&<button
        onClick={() => {
          
          setEditingRole(null);
          setModalOpen(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Role
      </button>
}
      <RoleList
        roles={roles}
        onEdit={(role) => {
             if (!canManageRoles) {
      alert("You do not have permission to manage roles.");
      return;

    }

     if (role.id === "default" || role.id === "org_admin" || role.id === "support") {
      alert("You cannot Edit the default role.");
      return;
    }
          setEditingRole(role);
          setModalOpen(true);
        }}

            onDelete={(role) => {
             if (!canManageRoles) {
      alert("You do not have permission to manage roles.");
      return;
    }
          handleDelete(role);
           
        }}
      />

      <RoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveRole}
        initialRole={editingRole}
      />
    </div>
             </UserPermissionGuard>
  );
}
