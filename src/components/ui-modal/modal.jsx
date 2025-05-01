"use client";

import { useEffect, useState } from "react";
import { X, ChevronUp, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  isOpen,
  onClose,
  title = "Task View",
  subtitle,
  children,
  showSidebar = true,
  sidebarContent,
  sidebarWidth = 420,
  width = "calc(100vw - 40px)",
  height = "calc(100vh - 40px)",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Add exit animation
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "";
      }, 300);
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300 transform",
          isOpen ? "scale-100" : "scale-95",
          isMinimized ? "h-14 overflow-hidden" : ""
        )}
        style={{
          width: isMinimized ? "400px" : width,
          height: isMinimized ? "auto" : height,
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100vh - 40px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? (
                <ChevronUp size={18} />
              ) : (
                <ArrowDownRight size={18} />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!isMinimized && (
          <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4">{children}</div>

            {/* Sidebar */}
            {showSidebar && (
              <>
                <div className="w-1 bg-gray-100 cursor-col-resize" />
                <div
                  className="overflow-auto border-l"
                  style={{ width: sidebarWidth }}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-4">Activity</h3>
                    {sidebarContent || (
                      <div className="text-gray-500">
                        No activity to display
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
