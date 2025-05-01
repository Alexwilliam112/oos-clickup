"use client";
import * as React from "react";
import { ChevronDown, Inbox, Megaphone, Plus, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/modals/general.jsx";
import { ErrorModal } from "@/components/utils/errorModal";

export function SidebarNav() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [teams, setTeams] = React.useState([]);
  const [folders, setFolders] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const [loadingFolders, setLoadingFolders] = React.useState(true);
  const [loadingLists, setLoadingLists] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");
  const [currentFolderId, setCurrentFolderId] = React.useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [currentTeamId, setCurrentTeamId] = React.useState(null);

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
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError("workspace_id is missing in the query parameters.");
      setLoading(false);
    }
  }, []);

  const fetchFolders = React.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      setLoadingFolders(true);
      fetch(
        `https://api-oos.jojonomic.com/27414/clickup/v2/folder/index?workspace_id=${workspaceId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch folders.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to fetch folders.");
          }
          setFolders(data.data || []);
          setLoadingFolders(false);
        })
        .catch((error) => {
          console.error("Error fetching folders:", error);
          setError(error.message);
          setLoadingFolders(false);
        });
    } else {
      setError("workspace_id is missing in the query parameters.");
      setLoadingFolders(false);
    }
  }, []);

  const fetchLists = React.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      setLoadingLists(true);
      fetch(
        `https://api-oos.jojonomic.com/27414/clickup/v2/lists/index?workspace_id=${workspaceId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch lists.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to fetch lists.");
          }
          setLists(data.data || []);
          setLoadingLists(false);
        })
        .catch((error) => {
          console.error("Error fetching lists:", error);
          setError(error.message);
          setLoadingLists(false);
        });
    } else {
      setError("workspace_id is missing in the query parameters.");
      setLoadingLists(false);
    }
  }, []);

  const handleAddFolder = () => {
    if (!newFolderName) {
      setError("Folder name cannot be empty.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    fetch(
      `https://api-oos.jojonomic.com/27414/clickup/v2/folder/create?workspace_id=${workspaceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newFolderName,
          team_id: currentTeamId,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create folder.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to create folder.");
        }
        setNewFolderName(""); // Clear the input field
        setIsFolderModalOpen(false); // Close the modal
        fetchFolders(); // Refetch the folders to update the UI
      })
      .catch((error) => {
        console.error("Error creating folder:", error);
        setError("Failed to create folder. Please try again.");
      });
  };

  const handleAddList = () => {
    if (!newListName) {
      setError("List name cannot be empty.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    fetch(
      `https://api-oos.jojonomic.com/27414/clickup/v2/lists/create?workspace_id=${workspaceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newListName,
          folder_id: currentFolderId,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create list.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to create list.");
        }
        setNewListName(""); // Clear the input field
        setIsModalOpen(false); // Close the modal
        fetchLists(); // Refetch the lists to update the UI
      })
      .catch((error) => {
        console.error("Error creating list:", error);
        setError("Failed to create list. Please try again.");
      });
  };

  const openModal = (folderId) => {
    setCurrentFolderId(folderId);
    setIsModalOpen(true);
  };

  const openFolderModal = (teamId) => {
    setCurrentTeamId(teamId);
    setIsFolderModalOpen(true);
  };

  const closeFolderModal = () => {
    setIsFolderModalOpen(false);
    setNewFolderName("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewListName("");
  };

  React.useEffect(() => {
    fetchTeams();
    fetchFolders();
    fetchLists();
  }, [fetchTeams, fetchFolders, fetchLists]);

  return (
    <>
      <Sidebar>
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

        <SidebarContent className="gap-0 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-3">
                  <Inbox className="h-5 w-5" />
                  <span className="text-sm font-medium">My Tasks</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#" className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5" />
                  <span className="text-sm font-medium">Notifications</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Teams Section */}
          <SidebarMenuItem className="mt-4 mb-10">
            <Collapsible className="w-full" defaultOpen>
              <div className="flex items-center py-1">
                <span className="text-xm font-medium">Teams</span>
              </div>
              <CollapsibleContent>
                <div className="ml-3 mt-3 border-l pl-2">
                  {loading ? (
                    <div className="text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : teams.length > 0 ? (
                    teams.map((team) => (
                      <div key={team.id_team} className="py-1">
                        <Collapsible className="w-full" defaultOpen>
                          <div className="flex items-center py-1">
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center justify-center mr-2 h-4 w-4 cursor-pointer">
                                <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform" />
                              </div>
                            </CollapsibleTrigger>
                            <a
                              href="#"
                              className="flex items-center gap-2 text-sm font-medium truncate line-clamp-1"
                              title={team.name}
                            >
                              <Avatar className="h-6 w-6 bg-blue-500 text-white">
                                <AvatarFallback className="text-xs">
                                  {team.name
                                    ? team.name.charAt(0).toUpperCase()
                                    : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span>{team.name || "Unnamed Team"}</span>
                            </a>
                          </div>
                          <CollapsibleContent>
                            <div className="ml-3 mt-2 border-l pl-2">
                              <div className="flex items-center py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Folders
                                </span>
                                <button
                                  className="ml-auto h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200"
                                  onClick={() => openFolderModal(team.id_team)}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              {loadingFolders ? (
                                <div className="text-xs text-muted-foreground">
                                  Loading...
                                </div>
                              ) : folders.filter(
                                  (folder) => folder.team_id === team.id_team
                                ).length > 0 ? (
                                folders
                                  .filter(
                                    (folder) => folder.team_id === team.id_team
                                  )
                                  .map((folder) => (
                                    <div
                                      key={folder.id_folder}
                                      className="py-1"
                                    >
                                      <Collapsible
                                        className="w-full"
                                        defaultOpen
                                      >
                                        <div className="flex items-center py-1">
                                          <CollapsibleTrigger asChild>
                                            <div className="flex items-center justify-center mr-2 h-4 w-4 cursor-pointer">
                                              <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform" />
                                            </div>
                                          </CollapsibleTrigger>
                                          <a
                                            href="#"
                                            className="text-sm truncate line-clamp-1"
                                            title={folder.name}
                                          >
                                            {folder.name || "Unnamed Folder"}
                                          </a>
                                          <button
                                            className="ml-auto h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200"
                                            onClick={() =>
                                              openModal(folder.id_folder)
                                            }
                                          >
                                            <Plus className="h-4 w-4" />
                                          </button>
                                        </div>
                                        <CollapsibleContent>
                                          {loadingLists ? (
                                            <div className="text-xs text-muted-foreground">
                                              Loading...
                                            </div>
                                          ) : lists.filter(
                                              (list) =>
                                                list.folder_id ===
                                                folder.id_folder
                                            ).length > 0 ? (
                                            lists
                                              .filter(
                                                (list) =>
                                                  list.folder_id ===
                                                  folder.id_folder
                                              )
                                              .map((list) => (
                                                <div
                                                  key={list.id_list}
                                                  className="py-1.5 flex items-center gap-2 ml-4"
                                                >
                                                  <Inbox className="h-4 w-4 text-muted-foreground" />
                                                  <a
                                                    href="#"
                                                    className="text-sm truncate line-clamp-1"
                                                    title={list.name}
                                                  >
                                                    {list.name ||
                                                      "Unnamed List"}
                                                  </a>
                                                </div>
                                              ))
                                          ) : (
                                            <div className="text-xs text-muted-foreground">
                                              No lists available.
                                            </div>
                                          )}
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  ))
                              ) : (
                                <div className="text-xs text-muted-foreground">
                                  No folders available.
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No teams available.
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      {/* Add List Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add New List</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Enter list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddList}>
            Add List
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Folder Modal */}
      <Modal isOpen={isFolderModalOpen} onClose={closeFolderModal}>
        <ModalHeader>Add New Folder</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Enter folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeFolderModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddFolder}>
            Add Folder
          </Button>
        </ModalFooter>
      </Modal>

      <ErrorModal
        isOpen={!!error}
        onClose={() => setError(null)}
        errorMessage={error}
      />

      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
    </>
  );
}
