'use client'

import { ChevronRight } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { workspaceService } from '@/service'
import { Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FolderOpen } from 'lucide-react'
import { Circle } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/modals/general.jsx'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Inbox } from 'lucide-react'

const baseUrl = process.env.PUBLIC_NEXT_BASE_URL

export function NavMain() {
  const router = useRouter()
  const params = useSearchParams()

  const { setOpenMobile } = useSidebar()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

  const [newListName, setNewListName] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [newTeamName, setNewTeamName] = useState('')

  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [currentTeamId, setCurrentTeamId] = useState(null)

  const handleAddTeam = () => {
    if (!newTeamName) {
      setError('Team name cannot be empty.')
      return
    }

    const workspaceId = params.get('workspace_id')

    if (!workspaceId) {
      setError('Workspace ID is missing.')
      return
    }

    fetch(`${baseUrl}/team/create?workspace_id=${workspaceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newTeamName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create team.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to create team.')
        }
        setNewTeamName('') // Clear the input field
        setIsTeamModalOpen(false) // Close the modal
        refetchTeams() // Refetch the teams to update the UI
      })
      .catch((error) => {
        console.error('Error creating team:', error)
        setError('Failed to create team. Please try again.')
      })
  }

  const handleAddFolder = () => {
    if (!newFolderName) {
      setError('Folder name cannot be empty.')
      return
    }

    const workspaceId = params.get('workspace_id')

    if (!workspaceId) {
      setError('Workspace ID is missing.')
      return
    }

    fetch(`${baseUrl}/folder/create?workspace_id=${workspaceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newFolderName,
        team_id: currentTeamId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create folder.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to create folder.')
        }
        setNewFolderName('') // Clear the input field
        setIsFolderModalOpen(false) // Close the modal
        refetchFolders()
      })
      .catch((error) => {
        console.error('Error creating folder:', error)
        setError('Failed to create folder. Please try again.')
      })
  }

  const handleAddList = () => {
    if (!newListName) {
      setError('List name cannot be empty.')
      return
    }

    const workspaceId = params.get('workspace_id')

    if (!workspaceId) {
      setError('Workspace ID is missing.')
      return
    }

    fetch(`${baseUrl}/lists/create?workspace_id=${workspaceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newListName,
        folder_id: currentFolderId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create list.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to create list.')
        }
        setNewListName('') // Clear the input field
        setIsModalOpen(false) // Close the modal
        refetchLists() // Refetch the lists to update the UI
      })
      .catch((error) => {
        console.error('Error creating list:', error)
        setError('Failed to create list. Please try again.')
      })
  }

  const openModal = (folderId) => {
    setCurrentFolderId(folderId)
    setIsModalOpen(true)
  }

  const openTeamModal = () => {
    setIsTeamModalOpen(true)
  }

  const openFolderModal = (teamId) => {
    setCurrentTeamId(teamId)
    setIsFolderModalOpen(true)
  }

  const closeTeamModal = () => {
    setIsTeamModalOpen(false)
    setNewTeamName('')
  }

  const closeFolderModal = () => {
    setIsFolderModalOpen(false)
    setNewFolderName('')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewListName('')
  }

  const {
    data: teamsData,
    isSuccess: teamsSuccess,
    isLoading: teamsLoading,
    refetch: refetchTeams,
  } = useQuery({
    queryFn: workspaceService.getTeams,
    queryKey: ['workspaceService.getTeams'],
  })

  const {
    data: foldersData,
    isSuccess: foldersSuccess,
    isLoading: foldersLoading,
    refetch: refetchFolders,
  } = useQuery({
    queryFn: workspaceService.getFolders,
    queryKey: ['workspaceService.getFolders'],
  })

  const {
    data: listData,
    isSuccess: listSuccess,
    isLoading: listLoading,
    refetch: refetchLists,
  } = useQuery({
    queryFn: workspaceService.getList,
    queryKey: ['workspaceService.getList'],
  })

  const navigateTo = (page, param_id) => {
    const workspace_id = params.get('workspace_id')

    if (workspace_id) {
      const url = `/dashboard?workspace_id=${workspace_id}&page=${page}&param_id=${param_id}`
      router.push(url)
      setOpenMobile(false)
    } else {
      console.error('workspace_id is missing in the query parameters.')
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teams</SidebarGroupLabel>
      <SidebarGroupAction tooltip="Add team" onClick={openTeamModal}>
        <Plus /> <span className="sr-only">Add team</span>
      </SidebarGroupAction>
      <SidebarMenu>
        {teamsData?.map((team) => (
          <Collapsible
            key={team.name}
            asChild
            defaultOpen={team.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={team.name}>
                  <Users />
                  <span
                    onClick={() => navigateTo('team', team.id_team)}
                    className="hover:text-blue-500 hover:cursor-pointer line-clamp-1"
                  >
                    {team.name}
                  </span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubButton
                    className="hover:cursor-pointer hover:text-blue-500"
                    onClick={() => navigateTo('default_list', team.id_team)}
                  >
                    <Inbox />

                    <span>Team list</span>
                  </SidebarMenuSubButton>

                  <SidebarMenuSubButton
                    className="hover:cursor-pointer text-muted-foreground"
                    onClick={() => openFolderModal(team.id_team)}
                  >
                    <Plus />
                    Add folder
                  </SidebarMenuSubButton>
                  {foldersData
                    ?.filter((folder) => folder.team_id === team.id_team)
                    .map((folder) => (
                      <Collapsible className="group/subcollapsible" key={folder.name}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton>
                            <FolderOpen />
                            <span
                              onClick={() => navigateTo('folder', folder.id_folder)}
                              className="hover:text-blue-500 hover:cursor-pointer"
                            >
                              {folder.name}
                            </span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/subcollapsible:rotate-90" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubButton
                              className="hover:cursor-pointer text-muted-foreground"
                              onClick={() => openModal(folder.id_folder)}
                            >
                              <Plus />
                              Add list
                            </SidebarMenuSubButton>
                            {listData
                              ?.filter((list) => list.folder_id === folder.id_folder)
                              .map((list) => (
                                <SidebarMenuSubItem key={list.name}>
                                  <SidebarMenuSubButton asChild>
                                    <span>
                                      <Inbox />{' '}
                                      <span
                                        onClick={() => navigateTo('list', list.id_list)}
                                        className="hover:text-blue-500 hover:cursor-pointer"
                                      >
                                        {list.name}
                                      </span>
                                    </span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}

        {teamsLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
      </SidebarMenu>

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
    </SidebarGroup>
  )
}
