"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChevronRight, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DetailModalTrigger,
  CreateModalTrigger,
} from "@/components/ui-modal/modal-trigger";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, Clock, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample tasks
const initialTasks = [
  {
    id: uuidv4(),
    title: "Main Task 1",
    createdAt: "2025-01-22",
    assignee: "Alice",
    task_type: "Feature",
    dueDate: "2025-05-10",
    priority: "High",
    status: "In Progress",
    startDate: "2025-04-28",
    expanded: false,
    lists: ["Backlog", "Sprint 1"],
    product: "Website",
    team: "Frontend",
    progress: 60,
    children: [
      {
        id: uuidv4(),
        title: "Subtask 1.1",
        createdAt: "2025-01-22",
        task_type: "Feature",
        assignee: "Bob",
        dueDate: "2025-05-08",
        priority: "Medium",
        status: "Todo",
        startDate: "2025-04-29",
        expanded: false,
        lists: ["Backlog"],
        product: "Website",
        team: "Frontend",
        progress: 40,
        children: [],
      },
    ],
  },
  {
    id: uuidv4(),
    title: "Main Task 2",
    createdAt: "2025-01-22",
    assignee: "Charlie",
    dueDate: "2025-05-12",
    task_type: "Feature",
    priority: "Low",
    status: "Todo",
    startDate: "2025-04-30",
    expanded: false,
    lists: ["Sprint 2"],
    product: "Mobile App",
    team: "Backend",
    progress: 20,
    children: [],
  },
];

export function ListView() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleExpand = (task) => {
    task.expanded = !task.expanded;
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

  const renderHeaders = () => (
    <div className="w-full h-12 table bg-muted border-b border-muted/20 sticky top-0 z-20">
      <div className="table-row text-xs font-medium text-muted-foreground">
        <div className="table-cell min-w-[50px] p-3 pl-4 bg-muted"></div>
        <div className="table-cell min-w-[255px] p-3  pl-4 bg-muted">
          Task Name
        </div>
        <div className="table-cell min-w-[120px] p-3  pl-4 bg-muted">
          Created
        </div>
        <div className="table-cell min-w-[120px] p-3  pl-4 bg-muted">
          Task Type
        </div>
        <div className="table-cell min-w-[150px] p-3  pl-4 bg-muted">
          Assignee
        </div>
        <div className="table-cell min-w-[120px] p-3  pl-4 bg-muted">
          Start Date
        </div>
        <div className="table-cell min-w-[120px] p-3  pl-4 bg-muted">
          Due Date
        </div>
        <div className="table-cell min-w-[100px] p-3  pl-4 bg-muted">
          Priority
        </div>
        <div className="table-cell min-w-[100px] p-3  pl-4 bg-muted">
          Status
        </div>
        <div className="table-cell min-w-[160px] p-3  pl-4 bg-muted">Lists</div>
        <div className="table-cell min-w-[120px] p-3  pl-4 bg-muted">
          Product
        </div>
        <div className="table-cell min-w-[120px] p-3  pl-4 bg-muted">Team</div>
        <div className="table-cell min-w-[160px] p-3  pl-4 bg-muted">
          Progress
        </div>
        <div className="table-cell min-w-[100px] p-3  pl-4 text-right bg-muted">
          Actions
        </div>
      </div>
    </div>
  );

  const renderTasks = (taskList, level = 0) =>
    taskList.map((task) => (
      <div
        key={task.id}
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
              parentTaskId={task.id}
              modalSubtitle={""}
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
              {task.expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <DetailModalTrigger
              trigger={
                <span className="text-blue-500 hover:underline">
                  {task.title}
                </span>
              }
              modalTitle="Task Details"
              modalSubtitle="Created on May 1, 2025"
              sidebarContent={<p>Sidebar content here</p>}
            >
              <p>Modal content here</p>
            </DetailModalTrigger>
          </div>
          <div className="min-w-[120px] p-2">{formatDate(task.createdAt)}</div>
          <div className="min-w-[120px] p-2">
            <span className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm">
              {task.task_type || "General"}
            </span>
          </div>
          <div className="min-w-[150px] p-2">{task.assignee}</div>
          <div className="min-w-[120px] p-2">{formatDate(task.startDate)}</div>
          <div className="min-w-[120px] p-2">{formatDate(task.dueDate)}</div>
          <div className="min-w-[100px] p-2">{task.priority}</div>
          <div className="min-w-[100px] p-2">{task.status}</div>
          <div className="min-w-[160px] p-2 flex gap-1 flex-wrap">
            {task.lists?.map((list, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm"
              >
                {list}
              </span>
            ))}
          </div>
          <div className="min-w-[120px] p-2">
            <span className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm">
              {task.product || "-"}
            </span>
          </div>
          <div className="min-w-[120px] p-2">
            <span className="text-xs px-2 py-0.5 border border-muted-foreground/20 rounded-sm">
              {task.team || "-"}
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
        {task.expanded && task.children?.length > 0 && (
          <div className="w-full">{renderTasks(task.children, level + 1)}</div>
        )}
      </div>
    ));

  return (
    <div className="flex-1 overflow-auto w-full h-screen">
      <div className="min-w-[50px] p-2 flex justify-left">
        <CreateModalTrigger
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-18 border border-green-500 text-green-600 font-medium rounded-md hover:bg-green-500 hover:text-white transition-colors"
            >
              ADD
              <Plus className="h-4 w-4" />
            </Button>
          }
          modalTitle="Create Task"
          parentTaskId={"0"}
          modalSubtitle={""}
          sidebarContent={<p></p>}
        />
      </div>
      <div className="w-full table-auto">
        {renderHeaders()}
        <div className="table-row-group">{renderTasks(tasks)}</div>
      </div>
    </div>
  );
}
