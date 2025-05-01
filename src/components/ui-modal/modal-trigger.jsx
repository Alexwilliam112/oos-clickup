"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./modal";

export function ModalTrigger({
  buttonText = "Open Modal",
  buttonVariant = "default",
  modalTitle,
  modalSubtitle,
  showSidebar = true,
  children,
  sidebarContent,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant={buttonVariant} onClick={() => setIsOpen(true)}>
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
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
