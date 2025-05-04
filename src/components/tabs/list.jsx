"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateModalTrigger } from "@/components/ui-modal/modal-trigger";
import { CalendarIcon, Clock, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateChildren } from "@/lib/utils";
import Task from "./task";

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
        <div
          className="table-cell min-w-[50px] p-3 pl-4 bg-muted"
          style={{ position: "sticky", left: 0, zIndex: 30 }}
        ></div>
        <div
          className="table-cell min-w-[255px] p-3 pl-4 bg-muted"
          style={{ position: "sticky", left: 50, zIndex: 30 }}
        >
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
        <div className="table-cell min-w-[130px] p-3  pl-4 bg-muted">
          Status
        </div>
        <div className="table-cell min-w-[160px] p-3  pl-4 bg-muted">Lists</div>
        <div className="table-cell min-w-[120px] p-3  pl-4 bg-muted">
          Product
        </div>
        <div className="table-cell min-w-[190px] p-3  pl-4 bg-muted">Team</div>
        <div className="table-cell min-w-[160px] p-3  pl-4 bg-muted">
          Progress
        </div>
        <div className="table-cell min-w-[100px] p-3  pl-4 text-right bg-muted">
          Actions
        </div>
      </div>
    </div>
  );

  const [isOpen, setIsOpen] = useState(false)

  const renderTasks = (taskList, level = 0) =>
    taskList.map((task) => {
      task.expanded = true; // Initialize expanded property

      return (
        <Task
          key={task.id_task}
          level={level}
          task={task}
          fetchTasks={fetchTasks}
          renderTasks={renderTasks}
          tasks={tasks}
          setTasks={setTasks}
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
      );
    });

  return (
    <>
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
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
      <div className="flex-1 overflow-auto w-full h-screen">
        <div className="w-full table-auto mb-40">
          {renderHeaders()}
          <div
            className="table-row-group overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          >
            {renderTasks(tasks)}
          </div>
        </div>
        <div className="mb-10 color-white">a</div>
      </div>
    </>
  );
}
