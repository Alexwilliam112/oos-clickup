"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


import {
  CreateModalTrigger,
  DetailModalTrigger,
} from "@/components/ui-modal/modal-trigger";

export function CalendarView() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const workspaceId = params.get("workspace_id");
  const page = params.get("page");
  const paramId = params.get("param_id");

  const fetchTasks = () => {
    fetch(
      `${baseUrl}/task/index?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
    )
      .then((res) => res.json())
      .then((data) => setTasks(data.data || []))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!workspaceId) return;

    const fetchAll = async () => {
      try {
        const [
          init,
          types,
          statuses,
          priorities,
          products,
          members,
          teams,
          folders,
          lists,
        ] = await Promise.all([
          fetch(
            `${baseUrl}/utils/task-initial-values?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
          ).then((r) => r.json()),
          fetch(`${baseUrl}/task-type/index?workspace_id=${workspaceId}`).then(
            (r) => r.json()
          ),
          fetch(`${baseUrl}/status/index?workspace_id=${workspaceId}`).then(
            (r) => r.json()
          ),
          fetch(`${baseUrl}/priority/index?workspace_id=${workspaceId}`).then(
            (r) => r.json()
          ),
          fetch(`${baseUrl}/product/index?workspace_id=${workspaceId}`).then(
            (r) => r.json()
          ),
          fetch(
            `${baseUrl}/workspace-member/index?workspace_id=${workspaceId}`
          ).then((r) => r.json()),
          fetch(
            `${baseUrl}/team-select/index?workspace_id=${workspaceId}`
          ).then((r) => r.json()),
          fetch(
            `${baseUrl}/folder-select/index?workspace_id=${workspaceId}`
          ).then((r) => r.json()),
          fetch(
            `${baseUrl}/list-select/index?workspace_id=${workspaceId}`
          ).then((r) => r.json()),
        ]);

        setTeam(init.data?.team_id || null);
        setFolder(init.data?.folder_id || null);
        setLists(init.data?.list_ids || []);
        setIndexTaskType(types.data || []);
        setIndexStatus((statuses.data || []).sort((a, b) => a.order - b.order));
        setIndexPriority(priorities.data || []);
        setIndexProduct(products.data || []);
        setIndexMember(members.data || []);
        setIndexTeam(teams.data || []);
        setIndexFolder(folders.data || []);
        setIndexList(lists.data || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchAll();
  }, [workspaceId]);

  const events = tasks.map((task) => ({
    id: task.id_task,
    title: task.name,
    start: task.date_start,
    end: task.date_end ? new Date(new Date(task.date_end).setDate(new Date(task.date_end).getDate() + 1)) : null,
    extendedProps: task,
  }));

  const handleEventClick = (info) => {
    setSelectedTask(info.event.extendedProps);
    setIsOpenDetail(true);
  };

  return (
    <div className="p-4 h-[90vh] overflow-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-end mb-2">
        <CreateModalTrigger
          trigger={
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Add Task
            </button>
          }
          modalTitle="Create Task"
          parentTaskId="0"
          modalSubtitle=""
          sidebarContent={<p></p>}
          fetchTasks={fetchTasks}
          initialValues={{ team, folder, lists }}
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

      <div className="h-full mb-20">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="100%"
        />
      </div>

      {selectedTask && isOpenDetail && (
        <DetailModalTrigger
          task={selectedTask}
          modalTitle="Task Details"
          modalSubtitle={selectedTask.created_at}
          fetchTasks={fetchTasks}
          showSidebar={true}
          sidebarContent={<p>Sidebar content here</p>}
          isOpen={isOpenDetail}
          setIsOpen={setIsOpenDetail}
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
        >
          <p>Task details modal</p>
        </DetailModalTrigger>
      )}
    </div>
  );
}