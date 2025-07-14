"use client";

import { useEffect, useState } from "react";

export default function AdminPanelDashboard() {
  const [orgCount, setOrgCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Aggregate all teams across all organizations
    const allTeamKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("teams_")
    );

    let allTeams: any[] = [];
    for (const key of allTeamKeys) {
      const teams = JSON.parse(localStorage.getItem(key) || "[]");
      allTeams = [...allTeams, ...teams];
    }

    setOrgCount(orgs.length);
    setUserCount(users.length);
    setTeamCount(allTeams.length);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Organizations" count={orgCount} color="bg-blue-500" />
        <Card title="Users" count={userCount} color="bg-green-500" />
        <Card title="Teams" count={teamCount} color="bg-purple-500" />
      </div>
    </div>
  );
}

function Card({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) {
  return (
    <div
      className={`rounded-lg p-6 text-white shadow-md ${color} dark:bg-opacity-80`}
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}
