"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Check,
  ChevronDown,
  MoreHorizontal,
  Plus,
} from "lucide-react";

export function SubtasksTable({ subtasks = [], onAddSubtask, onSubtaskClick }) {
  const [sortOrder, setSortOrder] = (useState < "asc") | ("desc" > "desc");

  const completedSubtasks = subtasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalSubtasks = subtasks.length;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">
            {completedSubtasks}/{totalSubtasks}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 flex items-center gap-1"
            onClick={toggleSortOrder}
          >
            Sort
            <ChevronDown
              size={14}
              className={sortOrder === "asc" ? "rotate-180 transform" : ""}
            />
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        {/* Header row */}
        <div className="grid grid-cols-[1fr,100px,100px,168px] border-b text-sm font-medium text-gray-500 bg-gray-50">
          <div className="p-2 pl-10">Name</div>
          <div className="p-2">Assignee</div>
          <div className="p-2">Priority</div>
          <div className="p-2">Due date</div>
        </div>

        {/* Task rows */}
        {subtasks.length > 0 ? (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="grid grid-cols-[1fr,100px,100px,168px] items-center border-b hover:bg-gray-50 cursor-pointer text-sm"
              onClick={() => onSubtaskClick?.(subtask.id)}
            >
              <div className="p-2 flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    {subtask.status === "completed" ? (
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <circle cx="12" cy="12" r="10" strokeDasharray="2" />
                      </svg>
                    )}
                  </div>
                </div>
                <span
                  className={
                    subtask.status === "completed"
                      ? "line-through text-gray-400"
                      : ""
                  }
                >
                  {subtask.name}
                </span>
              </div>
              <div className="p-2">
                {subtask.assignee ? (
                  <Avatar className="h-6 w-6">
                    {subtask.assignee.avatarUrl && (
                      <AvatarImage
                        src={subtask.assignee.avatarUrl || "/placeholder.svg"}
                        alt={subtask.assignee.name}
                      />
                    )}
                    <AvatarFallback
                      className={`text-white text-xs ${
                        subtask.assignee.color || "bg-red-500"
                      }`}
                    >
                      {subtask.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Plus size={12} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-2">
                {subtask.priority ? (
                  <div className="flex items-center">
                    {subtask.priority === "urgent" && (
                      <div className="w-4 h-4 rounded-sm bg-red-500"></div>
                    )}
                    {subtask.priority === "high" && (
                      <div className="w-4 h-4 rounded-sm bg-orange-500"></div>
                    )}
                    {subtask.priority === "normal" && (
                      <div className="w-4 h-4 rounded-sm bg-yellow-500"></div>
                    )}
                    {subtask.priority === "low" && (
                      <div className="w-4 h-4 rounded-sm bg-blue-500"></div>
                    )}
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M2 20V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
                    <path d="M2 12h20" />
                    <path d="M12 2v20" />
                  </svg>
                )}
              </div>
              <div className="p-2 flex justify-between items-center">
                {subtask.dueDate ? (
                  <span className="text-xs">{subtask.dueDate}</span>
                ) : (
                  <CalendarIcon size={16} className="text-gray-400" />
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal size={14} />
                  <span className="sr-only">More options</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No subtasks found
          </div>
        )}

        {/* Footer */}
        <div className="p-2 flex items-center gap-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500"
            onClick={onAddSubtask}
          >
            <Plus size={14} className="mr-1" />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
}
