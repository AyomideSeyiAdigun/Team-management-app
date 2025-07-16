"use client";
import type { Role } from "@/types";
export default function RoleList({ roles, onEdit,onDelete }: { roles: Role[]; onEdit: (r: Role) => void; onDelete: (r: Role) => void  }) {
  
  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className="border rounded p-4 bg-white dark:bg-gray-800 shadow"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{role.name}</h3>
            <div className="flex space-x-4">

    
            <button
              onClick={() => onEdit(role)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>

             <button
              onClick={() => onDelete(role)}
              className="text-red-700 hover:underline text-sm"
            >
              Delete
            </button>
                    </div>
          </div>
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Permissions:</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
              {role.permissions.map((p: string) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
