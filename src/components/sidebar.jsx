"use client";

import * as React from "react";
import { Inbox, Megaphone, Plus } from "lucide-react";
import { Folders } from "@/components/navigationBars/folders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
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
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function SidebarNav() {
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [teams, setTeams] = React.useState([]);
  const [folders, setFolders] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const [loadingFolders, setLoadingFolders] = React.useState(true);
  const [loadingLists, setLoadingLists] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = React.useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = React.useState(false);
  const [currentFolderId, setCurrentFolderId] = React.useState(null);
  const [currentTeamId, setCurrentTeamId] = React.useState(null);
  const [newListName, setNewListName] = React.useState("");
  const [newFolderName, setNewFolderName] = React.useState("");
  const [newTeamName, setNewTeamName] = React.useState("");
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;

  const navigateTo = (page, paramId) => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      const url = `/dashboard?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`;
      window.location.href = url; // Navigate to the constructed URL
    } else {
      console.error("workspace_id is missing in the query parameters.");
    }
  };

  const fetchTeams = React.useCallback(() => {
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      setLoading(true);
      fetch(`${baseUrl}/team/index?workspace_id=${workspaceId}`)
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
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      setLoadingFolders(true);
      fetch(`${baseUrl}/folder/index?workspace_id=${workspaceId}`)
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
    const workspaceId = params.get("workspace_id");

    if (workspaceId) {
      setLoadingLists(true);
      fetch(`${baseUrl}/lists/index?workspace_id=${workspaceId}`)
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

  const handleAddTeam = () => {
    if (!newTeamName) {
      setError("Team name cannot be empty.");
      return;
    }

    const workspaceId = params.get("workspace_id");

    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    fetch(`${baseUrl}/team/create?workspace_id=${workspaceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newTeamName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create team.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to create team.");
        }
        setNewTeamName(""); // Clear the input field
        setIsTeamModalOpen(false); // Close the modal
        fetchTeams(); // Refetch the teams to update the UI
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        setError("Failed to create team. Please try again.");
      });
  };

  const handleAddFolder = () => {
    if (!newFolderName) {
      setError("Folder name cannot be empty.");
      return;
    }

    const workspaceId = params.get("workspace_id");

    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    fetch(`${baseUrl}/folder/create?workspace_id=${workspaceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newFolderName,
        team_id: currentTeamId,
      }),
    })
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

    const workspaceId = params.get("workspace_id");

    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    fetch(`${baseUrl}/lists/create?workspace_id=${workspaceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newListName,
        folder_id: currentFolderId,
      }),
    })
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

  const openTeamModal = () => {
    setIsTeamModalOpen(true);
  };

  const openFolderModal = (teamId) => {
    setCurrentTeamId(teamId);
    setIsFolderModalOpen(true);
  };

  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
    setNewTeamName("");
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
      <Sidebar className="z-50">
        <SidebarHeader className="gap-4 p-4  border-muted-foreground">
          <div className="flex items-center justify-between">
            {/* <span className="text-lg font-semibold">Task Management</span> */}
            <img src="/officeless_brand.png" alt="" />
          </div>
        </SidebarHeader>

        <SidebarContent className="gap-0 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a
                  href="#"
                  className="text-sm truncate line-clamp-1 font-medium"
                  title={"My Tasks"}
                  onClick={() => navigateTo("my_tasks", "abc")} // Navigate to folder
                >
                  <Inbox className="h-5 w-5" />
                  <span className="text-sm font-medium">My Tasks</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/notifications" className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5" />
                  <span className="text-sm font-medium">Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Teams Section */}
          <SidebarMenuItem className="mt-4 mb-10">
            <Collapsible className="w-full" defaultOpen>
              <div className="flex items-center justify-between py-1">
                <span className="text-xm font-medium">Teams</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 flex items-center justify-center"
                  onClick={openTeamModal}
                  title="Add Team"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CollapsibleContent>
                <Folders
                  teams={teams}
                  folders={folders}
                  lists={lists}
                  loading={loading}
                  loadingFolders={loadingFolders}
                  loadingLists={loadingLists}
                  openFolderModal={openFolderModal}
                  openModal={openModal}
                />
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      {/* Add Team Modal */}
      <Modal isOpen={isTeamModalOpen} onClose={closeTeamModal}>
        <ModalHeader>Add New Team</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Enter team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeTeamModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTeam}>
            Add Team
          </Button>
        </ModalFooter>
      </Modal>

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
