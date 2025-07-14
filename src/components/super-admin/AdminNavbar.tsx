"use client";

import { useSuperAdminAuthStore } from "@/stores/admin-store/superAdminAuthStore";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function AdminNavbar() {
  const { currentAdmin, logout } = useSuperAdminAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/admin-login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-end items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white"
        >
          {currentAdmin?.firstName?.[0]}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded shadow-lg z-10">
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <p className="font-semibold">{currentAdmin?.firstName} {currentAdmin?.lastName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentAdmin?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
