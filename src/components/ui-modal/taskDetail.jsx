"use client";

import { useEffect, useState } from "react";
import { X, ChevronUp, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DateRangePicker } from "@/components/ui/dateRangePicker.jsx";
import { SingleSelectTag, MultipleSelectTags } from "@/components/ui/tag-input"; // Updated import

export function TaskDetailModal({
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

  // Task fields state
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [lists, setLists] = useState([]);
  const [product, setProduct] = useState("");
  const [team, setTeam] = useState("");
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "";
      }, 300);
    }

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

  const handleFileUpload = (e) => {
    setAttachments([...attachments, ...e.target.files]);
  };

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
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium">Task Name</label>
                <Input
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter task name"
                />
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-sm font-medium">Task Type</label>
                <SingleSelectTag
                  value={taskType}
                  onChange={(value) => setTaskType(value)}
                  options={["Bug", "Feature", "Improvement"]}
                  placeholder="Select task type"
                />
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-medium">Assignees</label>
                <MultipleSelectTags
                  value={assignees}
                  onChange={(value) => setAssignees(value)}
                  options={["Alice", "Bob", "Charlie"]}
                  placeholder="Add assignees"
                />
              </div>

              {/* Start Date & Due Date */}
              <div>
                <label className="block text-sm font-medium">Date Range</label>
                <DateRangePicker
                  value={selectedRange}
                  onChange={(range) => setSelectedRange(range)}
                  placeholder="Select a date range"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium">Priority</label>
                <SingleSelectTag
                  value={priority}
                  onChange={(value) => setPriority(value)}
                  options={["Low", "Medium", "High"]}
                  placeholder="Select priority"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium">Status</label>
                <SingleSelectTag
                  value={status}
                  onChange={(value) => setStatus(value)}
                  options={["Todo", "In Progress", "Done"]}
                  placeholder="Select status"
                />
              </div>

              {/* Lists */}
              <div>
                <label className="block text-sm font-medium">Lists</label>
                <MultipleSelectTags
                  value={lists}
                  onChange={(value) => setLists(value)}
                  options={["Backlog", "Sprint 1", "Sprint 2"]}
                  placeholder="Add lists"
                />
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium">Product</label>
                <SingleSelectTag
                  value={product}
                  onChange={(value) => setProduct(value)}
                  options={["Website", "Mobile App", "API"]}
                  placeholder="Select product"
                />
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-medium">Team</label>
                <SingleSelectTag
                  value={team}
                  onChange={(value) => setTeam(value)}
                  options={["Frontend", "Backend", "Design"]}
                  placeholder="Select team"
                />
              </div>

              {/* Progress */}
              <div>
                <label className="block text-sm font-medium">Progress</label>
                <Slider
                  value={[progress]}
                  onChange={(value) => setProgress(value)}
                  defaultValue={[50]}
                  max={[100]}
                />
                <span className="text-sm">{progress}%</span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <ul className="mt-2 text-sm text-gray-500">
                  {attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            </div>

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
