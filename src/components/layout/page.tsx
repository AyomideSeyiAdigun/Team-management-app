import DashboardNavbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const activeOrg = JSON.parse(localStorage.getItem("activeOrg") || "null");
    if (!activeOrg) return 
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