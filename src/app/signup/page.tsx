"use client";

import { useAuthStore } from "@/stores/authStore";
import type { Role, User, UserInvite } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const {  setActiveOrg,setCurrentUser } = useAuthStore();

  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
const handlePostSignup = (email: string) => {
  const userInvites = JSON.parse(localStorage.getItem("userInvites") || "[]");
  // Retrieve the newly created user from localStorage or define how to get it
  const newUser = JSON.parse(localStorage.getItem("user") || "null");
  const matchedInvite = userInvites.find((i: UserInvite) => i.email === email);

  if (matchedInvite) {

      const { orgId, role } = matchedInvite;

  const roles = JSON.parse(localStorage.getItem(`roles_${orgId}`) || "[]");
  const roleObj = roles.find((r: Role) => r.id === role);

  const membership = {
    orgId,
    role: roleObj?.id,
    permissions: roleObj?.permissions || [],
  };


  // Add user to org
  const orgUsers = JSON.parse(localStorage.getItem(`users`) || "[]");
    const updatedUser = orgUsers.filter(
    (i: User) => i.id !== newUser.id  
  );

  const memberships = newUser.memberships || [];
  memberships.push(membership);
  updatedUser.push({
    ...newUser,
    memberships: memberships,
  });
  localStorage.setItem(`users`, JSON.stringify(updatedUser));
  localStorage.setItem(`user`, JSON.stringify( updatedUser[updatedUser.length - 1]));
  
  

 
  
      // Remove invite
  const updatedInvites = userInvites.filter(
    (i: UserInvite) => i.email !== email  
  );
  localStorage.setItem("userInvites", JSON.stringify(updatedInvites));
  setActiveOrg (membership);
  if (newUser) {
    setCurrentUser({
      ...newUser,
      firstName: form.firstName,
      lastName: form.lastName,
      email: newUser.email,
      id: newUser.id,
      password: newUser.password,
      memberships: memberships,
    });
    // Redirect to dashboard
    router.push("/organization");
  } 
  } else {
    // User is new, send to create workspace
    router.push("/create-workspace");
  }
};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

 

signUp({
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    rawPassword: form.password,
    password: ""
});

handlePostSignup(form.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:border-gray-600"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full p-2 mb-6 border rounded dark:bg-gray-700 dark:border-gray-600"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Continue
        </button>
     

  <p className="mt-4 text-center text-sm">
  Already have an account?{" "}
  <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
 Log in
</Link>
</p>
      </form>
    </div>
  );
}
