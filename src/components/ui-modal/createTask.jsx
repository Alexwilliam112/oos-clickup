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
import DynamicFileAttachments from "../ui/dynamicAttachments";
const EditorJS = lazy(() => import("@editorjs/editorjs"));
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export function TaskCreateModal({
  isOpen,
  onClose,
  title = "Task View",
  subtitle,
  parentTaskId,
  selectData,
  fetchTasks,
  initialValues,
  width = "calc(90vw - 36px)", // Reduced by 10%
  height = "calc(90vh - 36px)", // Reduced by 10%
}) {
  const [isVisible, setIsVisible] = useState(false);
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
  const {
    indexTaskType,
    indexStatus,
    indexPriority,
    indexProduct,
    indexMember,
    indexTeam,
    indexFolder,
    indexList,
  } = selectData;

  // Task fields state
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState(null);
  const [lists, setLists] = useState([]);
  const [folder, setFolder] = useState(null);
  const [product, setProduct] = useState(null);
  const [team, setTeam] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [selectedRange, setSelectedRange] = useState({
    from: null,
    to: null,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      assignees: [],
      lists: [],
    },
  });

  useEffect(() => {
    setLists(initialValues.lists);
    setFolder(initialValues.folder);
    setTeam(initialValues.team);
  }, [initialValues]);

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

  const getBorderColor = (fieldName) =>
    errors[fieldName] ? "border-red-500" : "border-gray-300";

  if (!isVisible) return null;

  const handleFileUpload = (e) => {
    setAttachments([...attachments, ...e.target.files]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Collect Editor.js data
    const descriptionData = editorRef.current
      ? await editorRef.current.save()
      : {};

    // Collect task data
    const taskData = {
      name: taskName,
      task_type_id: taskType,
      assignee_ids: assignees,
      date_start: new Date(selectedRange.from).getTime(),
      date_end: new Date(selectedRange.to).getTime(),
      folder_id: folder,
      priority_id: priority,
      status_id: status,
      list_ids: lists,
      product_id: product,
      team_id: team,
      description: descriptionData,
      attachments: attachments,
      parent_task_id: parentTaskId,
    };

    console.log("Task Created:", taskData);

    // Reset form fields
    setTaskName("");
    setTaskType(null);
    setAssignees([]);
    setDateRange({ from: null, to: null });
    setSelectedRange({ from: null, to: null });
    setPriority(null);
    setStatus(null);
    setLists([]);
    setFolder(null);
    setProduct(null);
    setTeam(null);
    setAttachments([]);

    reset();

    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");
    const page = params.get("page");
    const paramId = params.get("param_id");

    fetch(`${baseUrl}/task/create?workspace_id=${workspaceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create task.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to create task.");
        }
        console.log("Task created successfully:", data);
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });

    // Close modal

    //RESET INITIAL VALUES
    fetch(
      `${baseUrl}/utils/task-initial-values?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch task types.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to task types.");
        }
        const initialValues = data.data;
        setTeam(initialValues.team_id || null);
        setFolder(initialValues.folder_id || null);
        setLists(initialValues.list_ids || []);
      })
      .catch((error) => {
        console.error("Error fetching initial values:", error);
      });
    fetchTasks();
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
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 overflow-hidden relative"
        >
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4 mb-10">
            {/* Task Name and Task Type */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Task Name</label>
                <Controller
                  name="taskName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        className={`w-full ${getBorderColor("taskName")}`}
                        placeholder="Enter task name"
                      />
                      {errors.taskName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.taskName.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Task Type</label>
                <Controller
                  name="taskType"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SingleSelectTag
                        value={field.value}
                        onChange={(value) => {
                          field.onChange({
                            id: value.id_record,
                            name: value.name,
                            color: value.color,
                          });
                        }}
                        options={indexTaskType}
                        placeholder="Select task type"
                        className={getBorderColor("taskType")}
                      />
                      {errors.taskType && (
                        <p className="text-red-500 text-xs mt-1">
                          Task type is required
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Priority and Status */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Priority</label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SingleSelectTag
                        value={field.value}
                        onChange={(value) => {
                          field.onChange({
                            id: value.id_record,
                            name: value.name,
                            color: value.color,
                          });
                        }}
                        options={indexPriority}
                        placeholder="Select priority"
                        className={getBorderColor("priority")}
                      />
                      {errors.priority && (
                        <p className="text-red-500 text-xs mt-1">
                          Priority is required
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SingleSelectTag
                        value={field.value}
                        onChange={(value) => {
                          field.onChange({
                            id: value.id_record,
                            name: value.name,
                            color: value.color,
                          });
                        }}
                        options={indexStatus}
                        placeholder="Select status"
                        className={getBorderColor("status")}
                      />
                      {errors.status && (
                        <p className="text-red-500 text-xs mt-1">
                          Status is required
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className="block text-sm font-medium">Assignees</label>
              <Controller
                name="assignees"
                control={control}
                render={({ field }) => (
                  <div>
                    <MultipleSelectTags
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      options={indexMember}
                      placeholder="Add assignees"
                      className={getBorderColor("assignees")}
                    />
                    {errors.assignees && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.assignees.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Start Date & Due Date */}
            <div>
              <label className="block text-sm font-medium">Date Range</label>
              <Controller
                name="selectedRange"
                control={control}
                render={({ field }) => (
                  <div>
                    <DateRangePicker
                      value={field.value}
                      onChange={(range) => field.onChange(range)}
                      placeholder="Select a date range"
                      className={getBorderColor("selectedRange")}
                    />
                    {errors.selectedRange && (
                      <p className="text-red-500 text-xs mt-1">
                        Date range is required
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Team and Product */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Product</label>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SingleSelectTag
                        value={field.value}
                        onChange={(value) => {
                          field.onChange({
                            id: value.id_record,
                            name: value.name,
                            color: value.color,
                          });
                        }}
                        options={indexProduct}
                        placeholder="Select product"
                        className={getBorderColor("product")}
                      />
                      {errors.product && (
                        <p className="text-red-500 text-xs mt-1">
                          Product is required
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Team</label>
                <Controller
                  name="team"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SingleSelectTag
                        value={field.value}
                        onChange={(value) => {
                          field.onChange({
                            id: value.id_record,
                            name: value.name,
                            color: value.color,
                          });
                        }}
                        options={indexTeam}
                        placeholder="Select team"
                        className={getBorderColor("team")}
                      />
                      {errors.team && (
                        <p className="text-red-500 text-xs mt-1">
                          Team is required
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Folder and Lists */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Folder</label>
                <Controller
                  name="folder"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <SingleSelectTag
                        value={field.value}
                        onChange={(value) => {
                          field.onChange({
                            id: value.id_record,
                            name: value.name,
                            color: value.color,
                          });
                        }}
                        options={indexFolder}
                        placeholder="Select Folder"
                        className={getBorderColor("folder")}
                      />
                      {errors.folder && (
                        <p className="text-red-500 text-xs mt-1">
                          Folder is required
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Lists</label>
                <Controller
                  name="lists"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <MultipleSelectTags
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        options={indexList}
                        placeholder="Add lists"
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div
                    id="editorjs"
                    className="border rounded p-2 text-left"
                  ></div>
                )}
              />
            </div>

            {/* Attachments */}
            <DynamicFileAttachments />
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

const formSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  taskType: z.object({
    id: z.string().min(1),
    name: z.string(),
    color: z.string(),
  }),
  priority: z.object({
    id: z.string().min(1),
    name: z.string(),
    color: z.string(),
  }),
  status: z.object({
    id: z.string().min(1),
    name: z.string(),
    color: z.string(),
  }),
  assignees: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
      })
    )
    .min(1, "At least one assignee is required"),
  selectedRange: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  product: z.object({
    id: z.string().min(1),
    name: z.string(),
    color: z.string(),
  }),
  team: z.object({
    id: z.string().min(1),
    name: z.string(),
    color: z.string(),
  }),
  folder: z.object({
    id: z.string().min(1),
    name: z.string(),
    color: z.string(),
  }),
  lists: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.string(),
    })
  ),
  description: z.string().optional(),
});
