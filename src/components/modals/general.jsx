"use client";
"use client";
import React from "react";

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-10">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children }) {
  return <h2 className="text-lg font-semibold mb-4">{children}</h2>;
}

export function ModalBody({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className="flex justify-end gap-2">{children}</div>;
}