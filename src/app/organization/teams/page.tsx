"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Plus, Eye, Edit, Trash2, X } from "lucide-react";
 
import { v4  as uuidv4} from "uuid";
import UserPermissionGuard from "@/components/UserPermissionGuard";
import { useAuditStore } from "@/stores/auditStore";
import { useTeamStore } from "@/stores/teamStore";
import { useUserStore } from "@/stores/userStore";

export default function TeamsPage() {
  const { activeOrg, currentUser } = useAuthStore();
  const orgId = activeOrg?.orgId;
  const canManageTeams = currentUser?.memberships[0]?.permissions.includes("manage_teams");
  const loadTeams = useTeamStore((state) => state.loadTeams);
  const teams = useTeamStore((state) => state.teams);
  const loadUsers = useUserStore((state) => state.loadUsers);
  const userList = useUserStore((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teamName, setTeamName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
   loadTeams();
   loadUsers();
  }, [orgId,loadTeams, loadUsers]);

 

  const handleCreate = () => {
      if (canManageTeams === false) {
      alert("You do not have permission to create teams.");
      return;
      
    }   
    const newTeam = {
      id: uuidv4(),
      name: teamName,
      members: selectedMembers,
      orgId: orgId || "unknown",
    };
      useTeamStore.getState().addTeam(newTeam);
    useAuditStore.getState().addLog({ actor: currentUser?.email || "unknown", action: "created team", target: teamName, orgId: orgId || "unknown" ,    timestamp: new Date().toISOString(),});
   
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
      if (canManageTeams === false) {
      alert("You do not have permission to edit teams.");
      return;
      
    }
    const teamToUpdate = teams.find((t:any) => t.id === selectedTeam.id);
    if (!teamToUpdate) {
      alert("Team not found.");
      return;
    }
    const updatedTeam = {
      ...teamToUpdate,
      name: teamName,
      members: selectedMembers, 
    }
     useTeamStore.getState().updateTeam(updatedTeam);
  
    useAuditStore.getState().addLog({ actor: currentUser?.email || "unknown", action: "edited team", target: `${selectedTeam.name} → ${teamName}`, orgId: orgId || "unknown",    timestamp: new Date().toISOString(),});
    setShowEditModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
      if (canManageTeams === false) {
      alert("You do not have permission to edit teams.");
      return;
      
    }
    const team = teams.find((t) => t.id === id);
    if (confirm("Are you sure you want to delete this team?") && team) {
      useTeamStore.getState().deleteTeam(id);
      useAuditStore.getState().addLog({ actor: currentUser?.email || "unknown", action: "deleted team", target: team.name, orgId: orgId || "unknown" ,    timestamp: new Date().toISOString(),});
 
    }
  };

  const resetForm = () => {
    setTeamName("");
    setSelectedMembers([]);
    setSelectedTeam(null);
  };

  const openEdit = (team: any) => {
    if (canManageTeams === false) {
      alert("You do not have permission to edit teams.");
      return;
      
    }
    setSelectedTeam(team);
    setTeamName(team.name);
    setSelectedMembers(team.members);
    setShowEditModal(true);
  };

  const filteredTeams = teams.filter((team) => {
    const nameMatch = team.name.toLowerCase().includes(searchTerm);
    const memberMatch = team.members.some((m: string) => m.toLowerCase().includes(searchTerm));
    return nameMatch || memberMatch;
  });

  return (

          <UserPermissionGuard requiredPermissions={["view_teams"]}>



    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Teams</h1>
        {canManageTeams && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Create Team
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search teams or members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className="border px-3 py-2 rounded mb-4 w-full sm:w-1/2 dark:bg-gray-800"
      />

      <table className="w-full text-left border dark:border-gray-600 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Members</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map((team) => (
            <tr key={team.id} className="border-t dark:border-gray-600">
              <td className="p-3">{team.name}</td>
              <td className="p-3">{team.members.length}</td>
              <td className="p-3 flex gap-3">
                <button onClick={() => { setSelectedTeam(team); setShowViewModal(true); }} className="text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
                {canManageTeams && (
                  <>
                    <button onClick={() => openEdit(team)} className="text-green-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(team.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {showCreateModal ? "Create Team" : "Edit Team"}
            </h2>
            <input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
            />
            <label className="block mb-2 font-medium text-sm">Select Members:</label>
            <div className="max-h-48 overflow-y-auto mb-4">
              {userList.map((u:any) => (
                <label key={u.email} className="block text-sm">
                  <input
                    type="checkbox"
                    value={u.email}
                    checked={selectedMembers.includes(u.email)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedMembers((prev) =>
                        checked ? [...prev, u.email] : prev.filter((em) => em !== u.email)
                      );
                    }}
                    className="mr-2"
                  />
                  {u.firstName} {u.lastName} ({u.email})
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { showCreateModal ? setShowCreateModal(false) : setShowEditModal(false); resetForm(); }} className="text-sm px-3 py-1 rounded border">Cancel</button>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                onClick={showCreateModal ? handleCreate : handleEdit}
              >
                {showCreateModal ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Team Members</h2>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <ul className="text-sm">
              {selectedTeam.members.map((email: string) => {
                const user = userList.find((u:any) => u.email === email);
                return (
                  <li key={email} className="mb-1">
                    {user ? `${user.firstName} ${user.lastName} (${user.email})` : email}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowViewModal(false)} className="text-sm border px-3 py-1 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
              </UserPermissionGuard>
  );
}