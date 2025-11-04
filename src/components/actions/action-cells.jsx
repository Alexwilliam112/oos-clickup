import { TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DetailModalTrigger } from "../ui-modal/modal-trigger"

export function ActionCells({ modalTitle, fetchTasks, showSidebar, task, tasks, setTasks, selectData, initialValues, modalSubtitle, sidebarContent, isOpen, setIsOpen }) {
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
  const handleDelete = async (id_task) => {
    try {
      const response = await fetch(`${baseUrl}/delete-task?task_id=${id_task}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      fetchTasks();
    } catch (error) {
      console.log(`Error deleting task ${id_task}`)
    }
  };

  return (
    <TableCell className="p-2 min-w-[100px] flex justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <DetailModalTrigger
              trigger={'View Detail'}
              modalTitle={modalTitle}
              fetchTasks={fetchTasks}
              showSidebar={showSidebar}
              task={task}
              tasks={tasks}
              setTasks={setTasks}
              selectData={selectData}
              initialValues={initialValues}
              modalSubtitle={modalSubtitle}
              sidebarContent={sidebarContent}
              isOpen={isOpen}
              setIsOpen={setIsOpen}>
            </DetailModalTrigger>
          </DropdownMenuItem>

          <DropdownMenuItem className={'cursor-pointer'}  onClick={() => handleDelete(task.id_task)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  )
}
