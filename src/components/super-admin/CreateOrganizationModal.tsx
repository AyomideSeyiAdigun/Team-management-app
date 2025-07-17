"use client";

import { useState } from "react";
 
import { v4 as uuidv4 } from "uuid";



// Modal Component
export default function CreateOrganizationModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const handleCreate = () => {
    if (name.length < 3 || !address || !adminEmail) return alert("All fields required");

    const orgId = `org_${uuidv4()}`;
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]");
    const newOrg = { id: orgId, name, address, adminEmail: [adminEmail] };
    localStorage.setItem("organizations", JSON.stringify([...orgs, newOrg]));

 
    // Step 1: Create roles
const adminRole = {
  id: "org_admin",
  name: "Org Admin",
   permissions: [
        "view_users",
        "manage_users",
        "view_teams",
        "manage_teams",
        "view_roles",
        "manage_roles",
        "view_audit_trail",
      ],
};

const supportRole = {
  id: "support",
  name: "Support",
  permissions: ["view_teams", "view_roles", "view_users"],
};

// Save roles to localStorage


localStorage.setItem(`roles_${orgId}`, JSON.stringify([adminRole, supportRole]));

    // Save invite
    const invites = JSON.parse(localStorage.getItem("userInvites") || "[]");
    invites.push({
      email: adminEmail.toLowerCase(),
      orgId,
      role: "org_admin"
    });
    localStorage.setItem("userInvites", JSON.stringify(invites));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Organization</h2>
        <input className="w-full p-2 mb-6 border rounded dark:bg-gray-700"
          placeholder="Organization Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full p-2 mb-6 border rounded dark:bg-gray-700"
          placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input className="w-full p-2 mb-6 border rounded dark:bg-gray-700"
          placeholder="Admin Email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </div>
      </div>
    </div>
  );
}