 
"use client";

import { useAuthStore } from "@/stores/authStore"; // Zustand
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function CreateWorkspacePage() {
  const [form, setForm] = useState({ name: "", address: "" });
  const [error, setError] = useState("");

  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setActiveOrg = useAuthStore((s) => s.setActiveOrg);
  const currentUser = useAuthStore((s) => s.currentUser);

  const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.name.trim().length < 3) {
      setError("Company name must be at least 3 characters.");
      return;
    }

    if (!form.address.trim()) {
      setError("Company address is required.");
      return;
    }


  const existingOrgs = JSON.parse(localStorage.getItem("organizations") || "[]");

  // 🔍 Check if name already exists (case-insensitive)
  const duplicate = existingOrgs.find(
    (org: any) => org.name.toLowerCase() === form.name.toLowerCase()
  );

  if (duplicate) {
    setError("A company with this name already exists.");
    return;
  }

 const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
    const orgId = `org_${uuidv4()}`;



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

    const newMembership = {
      orgId,
      role: "org_admin" as "org_admin",
      permissions: adminRole.permissions,
      orgName: form.name,
    };

 const updatedUser = {
  ...user,
  memberships: [...user.memberships, newMembership],
};
    // Save org
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]");
    localStorage.setItem("organizations", JSON.stringify([...orgs, {
      id: orgId,
      name: form.name,
      address: form.address,
    }]));

    // Save user
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setActiveOrg(newMembership);

    // Update in users list
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = allUsers.map((u: any) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    //  localStorage.setItem(`users_${orgId}`, JSON.stringify(updatedUser));

    router.push("/organization");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Create Your Workspace</h2>

        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
        />

        <input
          type="text"
          name="address"
          placeholder="Company Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Workspace
        </button>
      </form>
    </div>
  );
}
