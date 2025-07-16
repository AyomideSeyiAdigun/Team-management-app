"use client";

import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/stores/authStore";
import { FileSearch, LayoutDashboard, ShieldCheck, Users, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const mounted = useMounted();
  const { activeOrg } = useAuthStore();

  const permissions = activeOrg?.permissions || [];

  const hasPermission = (perm: string) => permissions.includes(perm);

  const links = [
    {
      label: "Dashboard",
      href: "/organization",
      icon: <LayoutDashboard className="w-5 h-5" />,
      alwaysShow: true,
    },
    {
      label: "Users",
      href: "/organization/users",
      icon: <Users className="w-5 h-5" />,
      permission: "view_users",
    },
      {
      label: "Teams",
      href: "/organization/teams",
      icon: <Users2 className="w-5 h-5" />, // 👈 New Teams route
      permission: "view_teams",
    },
    {
      label: "Roles",
      href: "/organization/roles",
      icon: <ShieldCheck className="w-5 h-5" />,
      permission: "view_roles",
    },
    {
      label: "Audit Trail",
      href: "/organization/audit-trail",
      icon: <FileSearch className="w-5 h-5" />,
      permission: "view_audit_trail",
    },
  ];

  return (
    <aside className="h-screen w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md">
      <div className="p-4 text-xl font-bold border-b border-gray-200 dark:border-gray-700">
        Team Manager
      </div>
      <nav className="mt-4 flex flex-col space-y-2 px-4">
        {mounted&&links.map((link) => {
          if (!link.alwaysShow && !hasPermission(link.permission!)) return null;

          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
