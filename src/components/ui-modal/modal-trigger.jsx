"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./modal";

export function ModalTrigger({
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

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        subtitle={modalSubtitle}
        showSidebar={showSidebar}
        sidebarContent={sidebarContent}
      >
        {children}
      </Modal>
    </>
  );
}
