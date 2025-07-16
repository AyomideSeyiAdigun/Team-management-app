"use client";

import { useAuditStore } from "@/stores/auditStore";
import { useAuthStore } from "@/stores/authStore";
import type { Membership, Role, User, UserInvite } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
    const {  setActiveOrg,setCurrentUser } = useAuthStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
 handleInvite(username)
  };

  const handleInvite =  (loginEmail:string) => {
const userEmail:string = loginEmail.toLowerCase();
const invites:UserInvite[] = JSON.parse(localStorage.getItem("userInvites") || "[]");
 const newUser:User = JSON.parse(localStorage.getItem("user") || "null");
 
// 1. Filter invites for this user
const acceptedInvites:UserInvite[]= invites.filter((invite: UserInvite) => invite.email === userEmail);

// 2. Go through each invite (in case multiple orgs invited them)
const newMemberships:Membership[] = [];

for (const invite of acceptedInvites) {
  const { orgId, role } = invite;

  // Get role details
  const roles = JSON.parse(localStorage.getItem(`roles_${orgId}`) || "[]");
  const roleObj = roles.find((r: Role) => r.id === role);

  const permissions = roleObj?.permissions || [];

  // Add user to org's user list if not already added
  const orgUsers = JSON.parse(localStorage.getItem(`users`) || "[]");
  const isAlreadyAdded = orgUsers.some((u: User) => u.id === newUser.id);

  if (!isAlreadyAdded) {
    orgUsers.push({
      ...newUser,
     memberships: [...(newUser.memberships || []), ...newMemberships],
    });
    localStorage.setItem(`users`, JSON.stringify(orgUsers));
  }

   

  // Log acceptance
   useAuditStore.getState().addLog({
    actor: userEmail,
    action: "accepted invitation",
    target: `Org ID: ${orgId}`,
    orgId,
    timestamp: new Date().toISOString(),
  });

  newMemberships.push({
    orgId,
    role: role || "",
    permissions,
  });
}
  const orgUsers:User[] = JSON.parse(localStorage.getItem(`users`) || "[]");
  const isAlreadyAdded:boolean = orgUsers.some((u: User) => u.id === newUser.id);

  if (isAlreadyAdded) {
     const updatedUser:User[] = orgUsers.filter(
    (i: User) => i.id !== newUser.id  
  );

  updatedUser.push({
    ...newUser,
    memberships: [...(newUser?.memberships || []), ...newMemberships],
  });
  localStorage.setItem(`users`, JSON.stringify(updatedUser));
  }


// 3. Remove invites for this email
const remainingInvites:UserInvite[] = invites.filter((invite: UserInvite) => invite.email !== userEmail);
localStorage.setItem("userInvites", JSON.stringify(remainingInvites));

 


  if (newUser) {
    setCurrentUser({
      ...newUser,
      memberships: [...(newUser.memberships || []), ...newMemberships],
    });
    // Redirect to dashboard
    if (newMemberships.length === 1) {
      router.push("/organization");
      setActiveOrg (newMemberships[0]);
    } else {
      router.push("/select-organization");
    }
  } 

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="mt-4 text-center text-sm">
  Don’t have an account yet?{" "}
  <Link href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
  Sign up
</Link>
</p>

      </form>
    </div>
  );
}
