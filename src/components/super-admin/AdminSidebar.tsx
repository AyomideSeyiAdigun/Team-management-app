"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/util/cn"; // Optional class merge utility

const links = [
  { label: "Dashboard", href: "/admin-panel" },
  { label: "Users", href: "/admin-panel/users" },
  { label: "Teams", href: "/admin-panel/teams" },
  { label: "Organizations", href: "/admin-panel/organizations" },
  { label: "Audit Logs", href: "/admin-panel/audit-trail" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed top-0 left-0 flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Super Admin
      </div>

      <nav className="flex flex-col p-4 space-y-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "p-2 rounded hover:bg-gray-700 transition-colors",
              pathname === link.href && "bg-gray-700 font-semibold"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 text-sm text-center">
        © {new Date().getFullYear()} Platform Admin
      </div>
    </aside>
  );
}
