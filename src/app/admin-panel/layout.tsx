import AdminSidebar from "@/components/super-admin/AdminSidebar";
import AdminNavbar from "@/components/super-admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 w-full min-h-screen flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
