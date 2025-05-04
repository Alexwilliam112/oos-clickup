"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DetailModalTrigger,
  CreateModalTrigger,
} from "@/components/ui-modal/modal-trigger";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, Clock, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateChildren } from "@/lib/utils";

export function ListView() {
  const [tasks, setTasks] = useState([]);

  const [indexTaskType, setIndexTaskType] = useState([]);
  const [indexStatus, setIndexStatus] = useState([]);
  const [indexPriority, setIndexPriority] = useState([]);
  const [indexProduct, setIndexProduct] = useState([]);
  const [indexMember, setIndexMember] = useState([]);
  const [indexTeam, setIndexTeam] = useState([]);
  const [indexFolder, setIndexFolder] = useState([]);
  const [indexList, setIndexList] = useState([]);
  const [team, setTeam] = useState(null);
  const [folder, setFolder] = useState(null);
  const [lists, setLists] = useState([]);

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

  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
  const params = new URLSearchParams(window.location.search);
  const workspaceId = params.get("workspace_id");
  const page = params.get("page");
  const paramId = params.get("param_id");

  const fetchTasks = () => {
    let taskDataInitial = [];
    fetch(
      //GET TASKS
      `${baseUrl}/task/index?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch TASKS DATA.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to TASKS DATA.");
        }
        taskDataInitial = data.data;
        setTasks(generateChildren(taskDataInitial));
      })
      .catch((error) => {
        console.error("Error fetching TASKS DATA:", error);
      });
    console.log("SUCCESS FETCH TASKS DATA");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (workspaceId) {
      //GET INITIAL VALUES
      fetch(
        `${baseUrl}/utils/task-initial-values?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch initial values.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to initial values.");
          }
          const initialValues = data.data;
          setTeam(initialValues.team_id || null);
          setFolder(initialValues.folder_id || null);
          setLists(initialValues.list_ids || []);
        })
        .catch((error) => {
          console.error("Error fetching initial values:", error);
        });
      console.log("SUCCESS FETCH INITIAL VALUES");

      //GET TASK TYPES
      fetch(`${baseUrl}/task-type/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch task types.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to task types.");
          }
          setIndexTaskType(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching task types:", error);
        });
      console.log("Task types fetched successfully:", indexTaskType);

      //GET STATUS
      fetch(`${baseUrl}/status/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch Status.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to Status.");
          }
          setIndexStatus(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching Status:", error);
        });
      console.log("Status fetched successfully:", indexStatus);

      //GET PRIORITY
      fetch(`${baseUrl}/priority/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch Priority.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to Priority.");
          }
          setIndexPriority(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching Priority:", error);
        });
      console.log("Task Priority successfully:", indexPriority);

      //GET PRODUCTS
      fetch(`${baseUrl}/product/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch Products.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to Products.");
          }
          setIndexProduct(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching Products:", error);
        });
      console.log("Task Products successfully:", indexProduct);

      //GET MEMBERS
      fetch(`${baseUrl}/workspace-member/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch Members.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to Members.");
          }
          setIndexMember(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching Members:", error);
        });
      console.log("Members successfully:", indexMember);

      //GET TEAMS
      fetch(`${baseUrl}/team-select/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch teams.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to teams.");
          }
          setIndexTeam(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
        });
      console.log("teams successfully:", indexTeam);

      //GET FOLDERS
      fetch(`${baseUrl}/folder-select/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch folders.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to folders.");
          }
          setIndexFolder(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching folders:", error);
        });
      console.log("folders successfully:", indexFolder);

      //GET LIST
      fetch(`${baseUrl}/list-select/index?workspace_id=${workspaceId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch teams.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.message || "Failed to teams.");
          }
          setIndexList(data.data || []);
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
        });
      console.log("teams successfully:", indexList);
    }
  }, []);

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
        <div className="table-cell min-w-[170px] p-3  pl-4 bg-muted">Team</div>
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
              initialValues={{
                team,
                folder,
                lists,
              }}
              selectData={{
                indexTaskType,
                indexStatus,
                indexPriority,
                indexProduct,
                indexMember,
                indexTeam,
                indexFolder,
                indexList,
              }}
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
                  {task.name}
                </span>
              }
              modalTitle="Task Details"
              modalSubtitle="Created on May 1, 2025"
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
          <div className="min-w-[100px] p-2">{task.status_id.name}</div>
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
          fetchTasks={fetchTasks}
          initialValues={{
            team,
            folder,
            lists,
          }}
          selectData={{
            indexTaskType,
            indexStatus,
            indexPriority,
            indexProduct,
            indexMember,
            indexTeam,
            indexFolder,
            indexList,
          }}
        />
      </div>
      <div className="w-full table-auto">
        {renderHeaders()}
        <div className="table-row-group">{renderTasks(tasks)}</div>
      </div>
    </div>
  );
}
