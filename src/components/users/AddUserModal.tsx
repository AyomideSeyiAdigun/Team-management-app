"use client";
import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";

export default function AddUserModal({ onInvite }: { onInvite: (email: string) => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
    const { currentUser, activeOrg } = useAuthStore();

  const invite = () => {
    if (!email.includes("@")) return alert("Enter a valid email");
    onInvite(email.trim());
    setEmail("");
    setOpen(false);
     useAuditStore.getState().addLog({
  actor: currentUser?.email || "unknown",
  action: "invited user",
  target: email,
  orgId: activeOrg?.orgId ?? "",
  timestamp: new Date().toISOString(),
  
});

  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setOpen(true)}
      >
        Add User
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-96 space-y-4">
            <h2 className="text-lg font-semibold">Invite User by Email</h2>
            <input
              type="email"
              className="w-full p-2 border rounded dark:bg-gray-700"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setOpen(false)} className="text-gray-500">
                Cancel
              </button>
              <button onClick={invite} className="bg-blue-600 text-white px-3 py-1 rounded">
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
