"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSuperAdminAuthStore } from "@/stores/admin-store/superAdminAuthStore";
import { decryptPassword, encryptPassword } from "@/lib/auth";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { login } = useSuperAdminAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Default super admin details
  const defaultAdmin = {
    id: "superadmin-001",
    firstName: "Team",
    lastName: "Admin",
    email: "superadmin@app.com",
    password: "password", // encrypted with CryptoJS.AES
    isSuperAdmin: true,
    memberships: [],
  };

  useEffect(() => {
    const admins = JSON.parse(localStorage.getItem("super-admin") || "[]");

    const exists = admins.find((u: any) => u.isSuperAdmin);
    if (!exists) {
      // Seed default super admin
        defaultAdmin.password =  encryptPassword(defaultAdmin.password);
      const updated = [...admins, defaultAdmin];
      localStorage.setItem("super-admin", JSON.stringify(updated));
    }
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("super-admin") || "[]");

    const match = users.find(
      (u: any) =>
        u.isSuperAdmin &&
        u.email === email &&
        decrypt(u.password) === password
    );

    if (match) {
      login(match);
      router.push("/admin-panel");
    } else {
      setError("Invalid credentials.");
    }
  };

  const decrypt = (cipherText: string) => {
    try {
      const bytes =decryptPassword(cipherText);
      return bytes
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Super Admin Login</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded dark:bg-gray-800"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded dark:bg-gray-800"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
