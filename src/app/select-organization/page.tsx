"use client";

import { useAuthStore } from "@/stores/authStore";
import type { Membership, Organization } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SelectOrganizationPage() {
  const router = useRouter();
  const { currentUser, setActiveOrg } = useAuthStore();

  const [orgList, setOrgList] = useState<Organization[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);

  useEffect(() => {
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]");
    setOrgList(orgs);

    if (currentUser?.memberships?.length) {
      setMemberships(currentUser.memberships);
    }
  }, [currentUser]);

  const getOrgName = (orgId: string) =>
    orgList.find((o) => o.id === orgId)?.name || "Unnamed Organization";

  const handleSelect = (membership: Membership) => {
    setActiveOrg(membership);
    router.push("/organization");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Select an Organization</h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {memberships.map((membership: Membership) => (
          <div
            key={membership.orgId}
            className="cursor-pointer border rounded-lg p-6 shadow hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
            onClick={() => handleSelect(membership)}
          >
            <h2 className="text-lg font-semibold mb-2">{getOrgName(membership.orgId)}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Role: {membership.role}</p>
          </div>
        ))}
      </div>
            <button
        onClick={() => router.push("/create-workspace")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Create Organization
      </button>

    </div>
  );
}
