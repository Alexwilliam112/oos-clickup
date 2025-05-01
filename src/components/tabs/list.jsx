'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  GripVertical,
  Expand,
  MoreHorizontal,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const initialTasks = [
  {
    id: uuidv4(),
    title: 'Main Task 1',
    createdAt: '22-01-2025',
    assignee: 'Alice',
    dueDate: '2025-05-10',
    priority: 'High',
    status: 'In Progress',
    startDate: '2025-04-28',
    expanded: false,
    children: [
      {
        id: uuidv4(),
        title: 'Subtask 1.1',
        createdAt: '22-01-2025',
        assignee: 'Bob',
        dueDate: '2025-05-08',
        priority: 'Medium',
        status: 'Todo',
        startDate: '2025-04-29',
        expanded: false,
        children: [],
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Main Task 2',
    createdAt: '22-01-2025',
    assignee: 'Charlie',
    dueDate: '2025-05-12',
    priority: 'Low',
    status: 'Todo',
    startDate: '2025-04-30',
    expanded: false,
    children: [],
  },
];

export function ListView() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleExpand = (task) => {
    task.expanded = !task.expanded;
    setTasks([...tasks]);
  };

  const addSubtask = (parentId) => {
    const newTasks = [...tasks];

    const insertSubtask = (items) => {
      items.forEach((task) => {
        if (task.id === parentId) {
          task.children = task.children || [];
          task.children.push({
            id: uuidv4(),
            title: `New Subtask ${task.children.length + 1}`,
            createdAt: new Date().toISOString(),
            assignee: '',
            dueDate: '',
            priority: 'Low',
            status: 'Todo',
            startDate: '',
            expanded: false,
            children: [],
          });
          task.expanded = true;
        } else if (task.children?.length) {
          insertSubtask(task.children);
        }
      });
    };

    insertSubtask(newTasks);
    setTasks(newTasks);
  };

  const renderHeaders = () => (
    <div className="flex items-center px-2 py-2 text-xs font-medium text-muted-foreground bg-muted/40 border-b border-muted/20">
      <div className="w-5" />
      <div className="min-w-[200px] flex-1 p-2">Task Name</div>
      <div className="w-32 p-2">Created</div>
      <div className="w-32 p-2">Assignee</div>
      <div className="w-32 p-2">Start Date</div>
      <div className="w-32 p-2">Due Date</div>
      <div className="w-24 p-2">Priority</div>
      <div className="w-24 p-2">Status</div>
      <div className="w-28 p-2 text-right">Actions</div>
    </div>
  );

  const renderTasks = (taskList, level = 0) =>
    taskList.map((task) => (
      <div key={task.id} className="flex flex-col w-full border-b border-muted/20 hover:bg-muted/10 transition">
        <div className="flex items-center px-2 py-2 text-sm w-full">
          <div className="w-5">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div
            className="min-w-[200px] flex-1 p-2"
            style={{ paddingLeft: `${level * 20}px` }}
          >
            {task.title}
          </div>
          <div className="w-32 p-2">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
          <div className="w-32 p-2">{task.assignee}</div>
          <div className="w-32 p-2">{task.startDate}</div>
          <div className="w-32 p-2">{task.dueDate}</div>
          <div className="w-24 p-2">{task.priority}</div>
          <div className="w-24 p-2">{task.status}</div>
          <div className="w-28 p-2 flex justify-end gap-1">
            {task.children?.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => toggleExpand(task)}
              >
                <Expand className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => addSubtask(task.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
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
    <div className="flex-1 overflow-auto p-4 sm:p-6 w-full h-screen">
      <div className="w-full rounded-md">
        {renderHeaders()}
        {renderTasks(tasks)}
      </div>
    </div>
  );
}
