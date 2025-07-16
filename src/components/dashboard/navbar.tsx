"use client";

import { useAuthStore } from "@/stores/authStore";
import type { Organization } from "@/types";
import { ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrganizationStore } from "../../stores/organizationStore";

export default function DashboardNavbar() {
  const { currentUser, activeOrg, setActiveOrg, logout } = useAuthStore();
  const router = useRouter();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const orgs = useOrganizationStore((state) => state.organizations);
  const loadOrganizations = useOrganizationStore((state) => state.loadOrganizations);
  
 

    useEffect(() => {
       loadOrganizations()
  }, [loadOrganizations]);


 
 
const otherOrgs = currentUser?.memberships
    ?.filter((m) => m.orgId !== activeOrg?.orgId)
    .map((m) => {
      const orgInfo = orgs.find((o) => o.id === m.orgId);
      return {
        ...m,
        orgName: orgInfo?.name || "Unknown Org",
      };
    });
  const handleOrgSwitch = (orgId: string) => {
    const membership = otherOrgs?.find((m) => m.orgId === orgId);
    if (membership) {
      setActiveOrg(membership);
      setOrgDropdownOpen(false);
      useAuthStore.getState().setActiveOrg(membership);
      router.refresh(); // or push to /dashboard
    }
  };
  const getOrgNameById=(orgId: string): string =>{
  const org:Organization|undefined = orgs.find((o: Organization) => o.id === orgId);
  return org?.name || "Unknown Organization";
}

  const fullName = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    :  'Anonymous User';

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 shadow-md">
      {/* LEFT: Current Org + Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOrgDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-2 font-semibold text-lg text-gray-800 dark:text-white"
        >
          <span>{getOrgNameById(activeOrg?.orgId||'' )|| "No Org"}</span>
            <ChevronDown className="w-4 h-4" />
        </button>

        {/* Org Dropdown */}
        {orgDropdownOpen && (otherOrgs ?? []).length > 0 && (
          <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded z-50">
            {(otherOrgs ?? []).map((m) => (
              <button
                key={m.orgId}
                onClick={() => handleOrgSwitch(m.orgId)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                {m.orgName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setUserDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-2 text-gray-800 dark:text-white hover:opacity-90"
        >
          <User className="w-6 h-6" />
          <ChevronDown className="w-4 h-4" />
        </button>

        {userDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded z-50 text-sm">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">
                {fullName}
              </p>
              <p className="text-gray-600 dark:text-gray-300">{currentUser?.email}</p>
            </div>
            <div className="flex flex-col px-4 py-2">
              <button
                onClick={() => {
                  router.push("/create-workspace");
                  setUserDropdownOpen(false);
                }}
                className="text-left w-full py-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Create Organization
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-left w-full py-2 text-red-600 dark:text-red-400 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
