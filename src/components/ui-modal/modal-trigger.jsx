"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskCreateModal } from "./createTask";
import { TaskDetailModalV2 } from "./detailTask";

export function CreateModalTrigger({
  trigger, // New prop for custom trigger element
  buttonText = "Create Task",
  buttonVariant = "default",
  modalTitle = "Create New Task",
  modalSubtitle = "Fill in the details below to create a new task",
  showSidebar = true,
  children,
  sidebarContent,
  parentTaskId,
  fetchTasks,
  selectData,
  initialValues,
  isOpen,
  setIsOpen,
}) {
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {trigger ? (
        // Render custom trigger if provided
        <span onClick={handleOpen} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        // Default button trigger
        <Button variant={buttonVariant} onClick={handleOpen}>
          {buttonText}
        </Button>
      )}

      <TaskCreateModal
        parentTaskId={parentTaskId}
        fetchTasks={fetchTasks}
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        subtitle={modalSubtitle}
        showSidebar={showSidebar}
        sidebarContent={sidebarContent}
        selectData={selectData}
        initialValues={initialValues}
      >
        {children}
      </TaskCreateModal>
    </>
  );
}

export function DetailModalTrigger({
  trigger, // New prop for custom trigger element
  buttonText = "Create Task",
  buttonVariant = "default",
  modalTitle = "Create New Task",
  modalSubtitle = "Fill in the details below to create a new task",
  showSidebar = true,
  children,
  sidebarContent,
  task,
  fetchTasks,
  selectData,
  initialValues,
  isOpen,
  setIsOpen,
}) {
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {trigger ? (
        // Render custom trigger if provided
        <span onClick={handleOpen} className="cursor-pointer">
          {trigger}
        </span>
      ) : (
        // Default button trigger
        <Button variant={buttonVariant} onClick={handleOpen}>
          {buttonText}
        </Button>
      )}{" "}
      <TaskDetailModalV2
        fetchTasks={fetchTasks}
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        subtitle={modalSubtitle}
        showSidebar={showSidebar}
        sidebarContent={sidebarContent}
        selectData={selectData}
        initialValues={initialValues}
        task={task}
      >
        {children}
      </TaskDetailModalV2>
    </>
  );
}
