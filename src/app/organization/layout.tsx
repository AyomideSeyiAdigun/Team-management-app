"use client";
import DashboardNavbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const loadActiveOrg = useAuthStore((s) => s.loadActiveOrg);

  useEffect(() => {
    loadActiveOrg();
  }, [loadActiveOrg]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}