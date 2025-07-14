"use client";

import { useEffect, useState } from "react";

export default function SuperAdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orgFilter, setOrgFilter] = useState("");

  useEffect(() => {
    const orgs = JSON.parse(localStorage.getItem("organizations") || "[]");
    setOrgs(orgs);

    // Collect teams from all org-specific keys like "teams_<orgId>"
    const allTeamKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("teams_")
    );

    let allTeams: any[] = [];
    for (const key of allTeamKeys) {
      const orgId = key.split("_")[1];
     
      
      const teamList = JSON.parse(localStorage.getItem(key) || "[]");
      const teamsWithOrg = teamList.map((t: any) => ({
        ...t,
        orgId:  key.split("_")[2], // Prefix orgId to match the format used in other parts
      }));
      allTeams = [...allTeams, ...teamsWithOrg];
    }

    setTeams(allTeams);
  }, []);

  const getOrgName = (orgId: string) =>  orgs.find((org: any) => org.id === `org_${orgId}`)?.name || "Unknown";

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesOrg = orgFilter ? team.orgId === orgFilter : true;

    return matchesSearch && matchesOrg;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Teams</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by team name"
          className="border p-2 rounded w-full md:w-1/2 dark:bg-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="border p-2 rounded dark:bg-gray-800 w-full md:w-auto"
        >
          <option value="">All Organizations</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[70vh] border rounded shadow">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="text-left p-2">Team Name</th>
              <th className="text-left p-2">Organization</th>
              <th className="text-left p-2"># Members</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No teams found.
                </td>
              </tr>
            )}
            {filteredTeams.map((team, index) => (
              <tr
                key={index}
                className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-2">{team.name}</td>
                <td className="p-2">{getOrgName(team.orgId)}</td>
                <td className="p-2">{team.members?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
