"use client";
import { ErrorModal } from "@/components/utils/errorModal";

import * as React from "react";
import { ChevronDown, Inbox, Megaphone, Plus, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function SidebarNav() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [teams, setTeams] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null); // State for error handling
  const [newTeamName, setNewTeamName] = React.useState(""); // State for new team name
  const [isAdding, setIsAdding] = React.useState(false); // State for add team loading
  const [isModalOpen, setIsModalOpen] = React.useState(false); // State for modal visibility

  const fetchTeams = React.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      setLoading(true);
      fetch(
        `https://api-oos.jojonomic.com/27414/clickup/v2/team/index?workspace_id=${workspaceId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch teams.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to fetch teams.");
          }
          setTeams(data.data || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
          setError(error.message); // Set error message
          setLoading(false);
        });
    } else {
      setError("workspace_id is missing in the query parameters.");
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleAddTeam = () => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (!workspaceId) {
      setError("workspace_id is missing in the query parameters.");
      return;
    }

    if (!newTeamName.trim()) {
      setError("Team name cannot be empty.");
      return;
    }

    setIsAdding(true);

    fetch(
      `https://api-oos.jojonomic.com/27414/clickup/v2/team/create?workspace_id=${workspaceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTeamName }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create a new team.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to create a new team.");
        }
        setNewTeamName(""); // Clear the input field
        setIsAdding(false);
        setIsModalOpen(false); // Close the modal
        fetchTeams(); // Refetch the list of teams
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        setError(error.message); // Set error message
        setIsAdding(false);
      });
  };

  return (
    <>
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader className="gap-4 p-4 border-b border-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Home</span>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sidebar..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="gap-0 p-4">
          <SidebarMenu>
            {/* My Tasks */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-3">
                  <Inbox className="h-5 w-5" />
                  <span className="text-sm font-medium">My Tasks</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Notifications */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5" />
                  <span className="text-sm font-medium">Notifications</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Team Space Section */}
          <SidebarMenuItem className="mt-6">
          <span className="text-sm font-medium flex items-center gap-3 mb-2">Teams</span>

            {/* Add New Team Button */}
            <SidebarMenuButton asChild>
              <a
                href="#"
                className="flex items-center gap-3 text-muted-foreground"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">New Space</span>
              </a>
            </SidebarMenuButton>

            {/* List of Teams */}
            <div className="ml-6 mt-4 border-l pl-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : teams.length > 0 ? (
                teams.map((team) => (
                  <div key={team._id || team.id} className="py-2">
                    <a href="#" className="flex items-center gap-3 text-sm">
                      <Avatar className="h-6 w-6 bg-blue-500 text-white">
                        <AvatarFallback className="text-xs">
                          {team.name ? team.name.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{team.name || "Unnamed Team"}</span>
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No teams available.
                </div>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      {/* Modal for Adding New Team */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold">Create New Space</h2>
            <Input
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="mt-4"
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTeam}
                disabled={isAdding}
                className="bg-blue-600 text-white"
              >
                {isAdding ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={!!error}
        onClose={() => setError(null)}
        errorMessage={error}
      />
    </>
  );
}
