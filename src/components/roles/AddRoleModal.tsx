// components/roles/RoleModal.tsx

"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const allPermissions = [
  "view_users",
  "manage_users",
  "view_teams",
  "manage_teams",
  "view_roles",
  "manage_roles",
  "view_organizations",
  "manage_organizations",
  "view_audit_trail",
];

export default function RoleModal({
  open,
  onClose,
  onSave,
  initialRole = null,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (role: any) => void;
  initialRole?: any;
}) {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  // pre-fill on edit
  useEffect(() => {
    if (initialRole) {
      setRoleName(initialRole.name);
      setPermissions(initialRole.permissions);
    } else {
      setRoleName("");
      setPermissions([]);
    }
  }, [initialRole]);

    function formatRole(role: string) {
  return role
    .split("_") // split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each part
    .join(" ");
}


  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const submit = () => {
    if (!roleName.trim()) return alert("Role name is required");

    const newRole = {
      id: initialRole?.id || uuidv4(),
      name: roleName.trim(),
      permissions,
    };

    onSave(newRole);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-lg font-bold">
          {initialRole ? "Edit Role" : "Create Role"}
        </h2>

        <input
          placeholder="Role name"
          value={roleName}
          onChange={(e) => setRoleName(formatRole(e.target.value))}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />

        <div className="max-h-40 overflow-y-auto space-y-2">
          {allPermissions.map((perm) => (
            <label key={perm} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={permissions.includes(perm)}
                onChange={() => togglePermission(perm)}
              />
              {perm}
            </label>
          ))}
        </div>

        <div className="text-right space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            {initialRole ? "Update Role" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
