"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormCreateModal } from "./createForm";
import { FormDetailModal } from "./detailForm";

export function FormCreateModalTrigger({
  trigger, // New prop for custom trigger element
  buttonText = "Create Form",
  buttonVariant = "default",
  modalTitle = "Create New Form",
  modalSubtitle = "Fill in the details below to create a new Form",
  children,
  fetchForms,
  selectData,
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

      <FormCreateModal
        fetchForms={fetchForms}
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        subtitle={modalSubtitle}
        selectData={selectData}
      >
        {children}
      </FormCreateModal>
    </>
  );
}

export function FormDetailModalTrigger({
  trigger, // New prop for custom trigger element
  buttonText = "Create Form",
  buttonVariant = "default",
  modalTitle = "Create New Form",
  modalSubtitle = "Fill in the details below to update the form",
  children,
  form,
  fetchForms,
  selectData,
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
      <FormDetailModal
        fetchForms={fetchForms}
        isOpen={isOpen}
        onClose={handleClose}
        title={modalTitle}
        subtitle={modalSubtitle}
        selectData={selectData}
        form={form}
      >
        {children}
      </FormDetailModal>
    </>
  );
}
