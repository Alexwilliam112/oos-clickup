"use client";
import * as React from "react";
import { ChevronDown, Plus, Inbox } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Folders({
  teams,
  folders,
  lists,
  loading,
  loadingFolders,
  loadingLists,
  openFolderModal,
  openModal,
}) {
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

  return (
    <div className="ml-3 mt-3 border-l pl-2">
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
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
                  onClick={() => navigateTo("team", team.id_team)} // Navigate to team
                >
                  <Avatar className="h-7 w-7 bg-blue-500 text-white">
                    <AvatarFallback className="bg-purple-700 text-xs">
                      {/* {team.name ? team.name.charAt(0).toUpperCase() : "?"} */}
                      {team.name.slice(0, 2).toUpperCase()}
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
                      .filter((folder) => folder.team_id === team.id_team)
                      .map((folder) => (
                        <div key={folder.id_folder} className="py-1">
                          <Collapsible className="w-full" defaultOpen>
                            <div className="flex items-center py-1">
                              <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-center mr-2 h-4 w-4 cursor-pointer">
                                  <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform" />
                                </div>
                              </CollapsibleTrigger>
                              <a
                                href="#"
                                className="text-sm truncate line-clamp-1 font-medium"
                                title={folder.name}
                                onClick={() =>
                                  navigateTo("folder", folder.id_folder)
                                } // Navigate to folder
                              >
                                {folder.name || "Unnamed Folder"}
                              </a>
                              <button
                                className="ml-auto h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200"
                                onClick={() => openModal(folder.id_folder)}
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
                                  (list) => list.folder_id === folder.id_folder
                                ).length > 0 ? (
                                lists
                                  .filter(
                                    (list) =>
                                      list.folder_id === folder.id_folder
                                  )
                                  .map((list) => (
                                    <div
                                      key={list.id_list}
                                      className="py-2 flex items-center gap-2 ml-4"
                                    >
                                      <Inbox className="h-4 w-4 text-muted-foreground" />
                                      <a
                                        href="#"
                                        className="text-sm truncate line-clamp-1"
                                        title={list.name}
                                        onClick={() =>
                                          navigateTo("list", list.id_list)
                                        } // Navigate to list
                                      >
                                        {list.name || "Unnamed List"}
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
        <div className="text-sm text-muted-foreground">No teams available.</div>
      )}
    </div>
  );
}