"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskDetailModal } from "./taskDetail";
import { TaskCreateModal } from "./createTask";

export function CreateModalTrigger({
  trigger, // New prop for custom trigger element
  buttonText = "Create Task",
  buttonVariant = "default",
  modalTitle = "Create New Task",
  modalSubtitle = "Fill in the details below to create a new task",
  showSidebar = true,
  children,
  sidebarContent,
}) {
  const [isOpen, setIsOpen] = useState(false);

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
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        subtitle={modalSubtitle}
        showSidebar={showSidebar}
        sidebarContent={sidebarContent}
      >
        {children}
      </TaskCreateModal>
    </>
  );
}

export function DetailModalTrigger({
  trigger, // New prop for custom trigger element
  buttonText = "Open Modal",
  buttonVariant = "default",
  modalTitle,
  modalSubtitle,
  showSidebar = true,
  children,
  sidebarContent,
}) {
  const [isOpen, setIsOpen] = useState(false);

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

      <TaskDetailModal
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        subtitle={modalSubtitle}
        showSidebar={showSidebar}
        sidebarContent={sidebarContent}
      >
        {children}
      </TaskDetailModal>
    </>
  );
}
