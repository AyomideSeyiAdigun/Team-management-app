"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useTeamStore } from "@/stores/teamStore";
import { useUserStore } from "@/stores/userStore";
import { useRoleStore } from "@/stores/roleStore";

export default function DashboardPage() {
  const { activeOrg } = useAuthStore();
  const orgId = activeOrg?.orgId;

  const [userCount, setUserCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
 const loadTeams = useTeamStore((state) => state.loadTeams);
  const loadUsers = useUserStore((state) => state.loadUsers);
  const loadRoles = useRoleStore((state) => state.loadRoles);

  useEffect(() => {
 
    loadTeams();
    loadUsers();
    loadRoles();
    setUserCount(useUserStore.getState().users.length);
    setRoleCount(useRoleStore.getState().roles.length);
    setTeamCount(useTeamStore.getState().teams.length);
  }, [orgId,loadRoles, loadUsers, loadTeams]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card title="Users" value={userCount} icon="👤" />
        <Card title="Roles" value={roleCount} icon="🛡️" />
        <Card title="Teams" value={teamCount} icon="👥" />
      </div>
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-5 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{title}</div>
    </div>
  );
}
