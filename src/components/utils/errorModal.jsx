import React from "react";
import { Button } from "@/components/ui/button";

export function ErrorModal({ isOpen, onClose, errorMessage }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-red-600">Error</h2>
        <p className="mt-4 text-sm text-gray-700">{errorMessage}</p>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} className="bg-red-600 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}