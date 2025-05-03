"use client";
import { useEffect, useState, lazy, Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DateRangePicker } from "@/components/ui/dateRangePicker.jsx";
import { SingleSelectTag, MultipleSelectTags } from "@/components/ui/tag-input";

// Lazy load EditorJS
const EditorJS = lazy(() => import("@editorjs/editorjs"));

export function TaskCreateModal({
  isOpen,
  onClose,
  title = "Task View",
  subtitle,
  width = "calc(90vw - 36px)", // Reduced by 10%
  height = "calc(90vh - 36px)", // Reduced by 10%
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Task fields state
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [lists, setLists] = useState([]);
  const [product, setProduct] = useState("");
  const [team, setTeam] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [selectedRange, setSelectedRange] = useState({
    from: null,
    to: null,
  });

  const editorRef = useRef(null);

  useEffect(() => {
    async function initEditor() {
      const editorElement = document.getElementById("editorjs");
      if (!editorElement) {
        console.error("EditorJS element is missing");
        return;
      }

      const EditorJSModule = (await import("@editorjs/editorjs")).default;
      const [
        Header,
        List,
        Table,
        Quote,
        Embed,
        SimpleImage,
        Marker,
        InlineCode,
        TextColorPlugin,
        TextVariantTune,
        Checklist,
      ] = await Promise.all([
        import("@editorjs/header").then((m) => m.default),
        import("@editorjs/list").then((m) => m.default),
        import("@editorjs/table").then((m) => m.default),
        import("@editorjs/quote").then((m) => m.default),
        import("@editorjs/embed").then((m) => m.default),
        import("@editorjs/simple-image").then((m) => m.default),
        import("@editorjs/marker").then((m) => m.default),
        import("@editorjs/inline-code").then((m) => m.default),
        import("editorjs-text-color-plugin").then((m) => m.default),
        import("@editorjs/text-variant-tune").then((m) => m.default),
        import("@editorjs/checklist").then((m) => m.default),
      ]);

      const editor = new EditorJSModule({
        holder: "editorjs",
        placeholder: "Write something...",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4],
              defaultLevel: 1,
            },
            tunes: ["textVariantTune"],
          },
          list: { class: List, inlineToolbar: true },
          table: { class: Table, inlineToolbar: true },
          checklist: { class: Checklist, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
          embed: {
            class: Embed,
            inlineToolbar: false,
            config: {
              services: { youtube: true, twitter: true, instagram: true },
            },
          },
          image: { class: SimpleImage, inlineToolbar: true },
          marker: { class: Marker, shortcut: "CMD+SHIFT+M" },
          inlineCode: { class: InlineCode, shortcut: "CMD+SHIFT+C" },
          textVariantTune: {
            class: TextVariantTune,
            config: {
              types: [
                "primary",
                "secondary",
                "info",
                "success",
                "warning",
                "danger",
              ],
            },
          },
        },
      });

      editorRef.current = editor;
    }

    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        if (!editorRef.current) {
          initEditor();
        }
      }, 0); // Ensure DOM is rendered before initializing
    } else {
      setTimeout(() => {
        setIsVisible(false);
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
        document.body.style.overflow = "";
      }, 300); // Match modal close animation duration
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect Editor.js data
    const descriptionData = editorRef.current
      ? await editorRef.current.save()
      : {};

    // Collect task data
    const taskData = {
      taskName,
      taskType,
      assignees,
      dateRange,
      priority,
      status,
      lists,
      product,
      team,
      description: descriptionData,
      attachments,
    };

    console.log("Task Created:", taskData);

    // Reset form fields
    setTaskName("");
    setTaskType("");
    setAssignees([]);
    setDateRange({ from: null, to: null });
    setPriority("");
    setStatus("");
    setLists([]);
    setProduct("");
    setTeam("");
    setAttachments([]);

    // Close modal
    onClose();
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
          isOpen ? "scale-100" : "scale-95"
        )}
        style={{
          width,
          height,
          maxWidth: "calc(90vw - 36px)", // Reduced by 10%
          maxHeight: "calc(90vh - 36px)", // Reduced by 10%
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 overflow-hidden relative"
        >
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4 mb-10">
            {/* Task Name and Task Type */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Task Name</label>
                <Input
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter task name"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Task Type</label>
                <SingleSelectTag
                  value={taskType}
                  onChange={(value) => setTaskType(value)}
                  options={[
                    { id: "1", value: "High Priority", color: "#FF0000" },
                    { id: "2", value: "Medium Priority", color: "#FFA500" },
                    { id: "3", value: "Low Priority", color: "#00FF00" },
                  ]}
                  placeholder="Select task type"
                />
              </div>
            </div>

            {/* Priority and Status */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Priority</label>
                <SingleSelectTag
                  value={priority}
                  onChange={(value) => setPriority(value)}
                  options={[
                    { id: "1", value: "High Priority", color: "#FF0000" },
                    { id: "2", value: "Medium Priority", color: "#FFA500" },
                    { id: "3", value: "Low Priority", color: "#00FF00" },
                  ]}
                  placeholder="Select priority"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Status</label>
                <SingleSelectTag
                  value={status}
                  onChange={(value) => setStatus(value)}
                  options={[
                    { id: "1", value: "High Priority", color: "#FF0000" },
                    { id: "2", value: "Medium Priority", color: "#FFA500" },
                    { id: "3", value: "Low Priority", color: "#00FF00" },
                  ]}
                  placeholder="Select status"
                />
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className="block text-sm font-medium">Assignees</label>
              <MultipleSelectTags
                value={assignees}
                onChange={(value) => setAssignees(value)}
                options={[
                  { id: "1", value: "Bob" },
                  { id: "2", value: "Alice" },
                  { id: "3", value: "John" },
                ]}
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

            {/* Lists and Product */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Lists</label>
                <MultipleSelectTags
                  value={lists}
                  onChange={(value) => setLists(value)}
                  options={[
                    { id: "1", value: "Bob" },
                    { id: "2", value: "Alice" },
                    { id: "3", value: "John" },
                  ]}
                  placeholder="Add lists"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Product</label>
                <SingleSelectTag
                  value={product}
                  onChange={(value) => setProduct(value)}
                  options={[
                    { id: "1", value: "High Priority", color: "#FF0000" },
                    { id: "2", value: "Medium Priority", color: "#FFA500" },
                    { id: "3", value: "Low Priority", color: "#00FF00" },
                  ]}
                  placeholder="Select product"
                />
              </div>
            </div>

            {/* Team */}
            <div>
              <label className="block text-sm font-medium">Team</label>
              <SingleSelectTag
                value={team}
                onChange={(value) => setTeam(value)}
                options={[
                  { value: "High Priority", color: "#FF0000" },
                  { value: "Medium Priority", color: "#FFA500" },
                  { value: "Low Priority", color: "#00FF00" },
                ]}
                placeholder="Select team"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <div id="editorjs" className="border rounded p-2 text-left"></div>
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

          {/* Submit Button */}
          <div className="absolute bottom-4 right-4">
            <Button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
            >
              ADD
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
