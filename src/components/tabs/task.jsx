"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DetailModalTrigger,
  CreateModalTrigger,
} from "@/components/ui-modal/modal-trigger";

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

  useEffect(() => {
    // Set as expanded only on the first load
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }, []);

  const toggleExpand = (task) => {
    setIsExpanded(!isExpanded)
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

  return (
    <div
      key={task.id_task}
      className="flex flex-col w-full border-b border-muted/20 hover:bg-muted/10 transition z-10"
    >
      <div className="flex items-center px-2 py-2 text-sm w-full">
        <div className="min-w-[50px] p-2 flex justify-center">
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
          />
        </div>

        <div
          className="min-w-[255px] p-2 flex items-center"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          <button
            className="text-muted-foreground hover:text-foreground transition mr-2"
            onClick={() => toggleExpand(task)}
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
            parentTaskId={task.id_task}
            fetchTasks={fetchTasks}
            showSidebar={true}
            selectData={selectData}
            modalSubtitle={task.created_at}
            sidebarContent={<p>Sidebar content here</p>}
          >
            <p>Modal content here</p>
          </DetailModalTrigger>
        </div>
        <div className="min-w-[120px] p-2">{formatDate(task.created_at)}</div>
        <div className="min-w-[120px] p-2">
          <span className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm">
            {task.task_type_id.name}
          </span>
        </div>
        <div className="min-w-[150px] p-2">{task.assignee}</div>
        <div className="min-w-[120px] p-2">{formatDate(task.date_start)}</div>
        <div className="min-w-[120px] p-2">{formatDate(task.date_end)}</div>
        <div className="min-w-[100px] p-2">{task.priority_id.name}</div>
        <div className="min-w-[130px] p-2">{task.status_id.name}</div>
        <div className="min-w-[160px] p-2 flex gap-1 flex-wrap">
          {task.list_ids?.map((list, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm"
            >
              {list.name}
            </span>
          ))}
        </div>
        <div className="min-w-[120px] p-2">
          <span className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm">
            {task.product_id.name}
          </span>
        </div>
        <div className="min-w-[170px] p-2">
          <span className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm">
            {task.team_id.name}
          </span>
        </div>
        <div className="min-w-[160px] p-2">
          <div className="h-2 w-full bg-muted rounded-sm">
            <div
              className="h-2 bg-primary rounded-sm"
              style={{ width: `${task.progress || 0}%` }}
            ></div>
          </div>
        </div>
        <div className="min-w-[100px] p-2 flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isExpanded && task.children?.length > 0 && (
        <div className="w-full">{renderTasks(task.children, level + 1)}</div>
      )}
    </div>
  );
}
