"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DetailModalTrigger,
  CreateModalTrigger,
} from "@/components/ui-modal/modal-trigger";
import { TableRow, TableCell } from "@/components/ui/table";

function getContrastColor(hexColor) {
  // Remove the hash if it exists
  const color = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black for light backgrounds, white for dark backgrounds
  return brightness > 128 ? "#000000" : "#FFFFFF";
}

export default function Task({
  task,
  fetchTasks,
  selectData,
  initialValues,
  level,
  renderTasks,
  setTasks,
  tasks,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    // Set as expanded only on the first load
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }, []);

  useEffect(() => {
    // Set the taskId to the current task's id_task
    setTaskId(task.id_task);
  }, [task]);

  const toggleExpand = (task) => {
    setIsExpanded(!isExpanded);
    setTasks([...tasks]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const multiplier = 5; // Adjust this value to control the color change speed
  const startColor = 255; // Starting color value (white)
  const transparency = 1; // Adjust this value to control the transparency level
  const rowBg = `rgba(${startColor - level * multiplier}, ${
    startColor - level * multiplier
  }, ${startColor - level * multiplier}, ${transparency})`;

  return (
    <>
      <TableRow style={{ backgroundColor: rowBg }}>
        <TableCell
          className="p-2 min-w-[50px]"
          style={{
            position: isOpenCreate ? "static" : "sticky",
            left: 0,
            zIndex: isOpenCreate ? undefined : 10,
            backgroundColor: rowBg,
          }}
        >
          <CreateModalTrigger
            trigger={
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            }
            modalTitle="Create Task"
            parentTaskId={task.id_task}
            fetchTasks={fetchTasks}
            modalSubtitle={""}
            initialValues={initialValues}
            selectData={selectData}
            sidebarContent={<p></p>}
            isOpen={isOpenCreate}
            setIsOpen={setIsOpenCreate}
          />
        </TableCell>

        <TableCell
          className="p-2 min-w-[255px]"
          style={{
            paddingLeft: `${level * 20}px`,
            position: isOpenDetail ? "static" : "sticky",
            left: 50,
            zIndex: isOpenDetail ? undefined : 10,
            backgroundColor: rowBg,
          }}
        >
          <button
            className="text-muted-foreground hover:text-foreground transition mr-2"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <DetailModalTrigger
            trigger={
              <span className="text-blue-500 hover:underline">{task.name}</span>
            }
            modalTitle="Task Details"
            fetchTasks={fetchTasks}
            showSidebar={true}
            task={task}
            selectData={selectData}
            modalSubtitle={task.created_at}
            sidebarContent={<p>Sidebar content here</p>}
            isOpen={isOpenDetail}
            setIsOpen={setIsOpenDetail}
          >
            <p>Modal content here</p>
          </DetailModalTrigger>
        </TableCell>

        <TableCell className="p-2 min-w-[120px]">
          {formatDate(task.created_at)}
        </TableCell>

        <TableCell className="p-2 min-w-[120px]">
          <span
            className="text-xs px-2 py-1 border border-muted-foreground/20 rounded-sm"
            style={{
              backgroundColor: task.task_type_id.color,
              color: getContrastColor(task.task_type_id.color),
            }}
          >
            {task.task_type_id.name}
          </span>
        </TableCell>

        <TableCell className="p-2 min-w-[150px] gap-1 flex flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Avatar>
                  <AvatarImage
                    src={task.assignee_ids?.avatar}
                    alt={task.assignee_ids?.name}
                  />
                  <AvatarFallback
                    style={{
                      backgroundColor: "#F5B1FF",
                      color: getContrastColor("#F5B1FF"),
                      cursor: "pointer",
                    }}
                  >
                    {task.assignee_ids?.name
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>{task.assignee_ids?.name}</span>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="p-2 min-w-[120px]">
          {formatDate(task.date_start)}
        </TableCell>

        <TableCell className="p-2 min-w-[120px]">
          {formatDate(task.date_end)}
        </TableCell>

        <TableCell className="p-2 min-w-[100px]">
          <span
            className="text-xs px-2 min-w-[120px] py-1 border border-muted-foreground/20 rounded-sm"
            style={{
              backgroundColor: task.priority_id.color,
              color: getContrastColor(task.priority_id.color),
            }}
          >
            {task.priority_id.name}
          </span>
        </TableCell>

        <TableCell className="p-2 min-w-[130px]">
          <span
            className="text-xs px-2 py-1 border border-muted-foreground/20 rounded-sm"
            style={{
              backgroundColor: task.status_id.color,
              color: getContrastColor(task.status_id.color),
            }}
          >
            {task.status_id.name}
          </span>
        </TableCell>

        <TableCell className="p-2 min-w-[160px] flex gap-1 flex-wrap">
          {task.list_ids?.map((list, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 border border-muted-foreground/20 rounded-sm"
              style={{
                backgroundColor: "#B1D9FF",
                color: getContrastColor("#B1D9FF"),
              }}
            >
              {list.name}
            </span>
          ))}
        </TableCell>

        <TableCell className="p-2 min-w-[120px]">
          <span
            className="text-xs px-2 py-1 border border-muted-foreground/20 rounded-sm"
            style={{
              backgroundColor: task.product_id.color,
              color: getContrastColor(task.product_id.color),
            }}
          >
            {task.product_id.name}
          </span>
        </TableCell>

        <TableCell className="p-2 min-w-[190px]">
          <span
            className="text-xs px-2 py-1.5 border border-muted-foreground/20 rounded-sm"
            style={{
              backgroundColor: "#B1D9FF",
              color: getContrastColor("#B1D9FF"),
            }}
          >
            {task.team_id.name.toUpperCase()}
          </span>
        </TableCell>

        <TableCell className="p-2 min-w-[100px] flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
      {isExpanded &&
        task.children?.length > 0 &&
        renderTasks(task.children, level + 1)}
    </>
  );
}
