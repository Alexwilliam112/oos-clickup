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
import CustomFields from "./customFields";

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
  const [assignee, setAssignee] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState(null);
  const [lists, setLists] = useState([]);
  const [folder, setFolder] = useState(null);
  const [product, setProduct] = useState(null);
  const [team, setTeam] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState([]);

  const [attachments, setAttachments] = useState([]);
  const [selectedRange, setSelectedRange] = useState({
    from: null,
    to: null,
  });

  const formSchema = z.object({
    taskName: z.string().min(1, "Task name is required and cannot be empty"),
    taskType: z.object(
      {
        id: z.string().min(1, "Task type selection is required"),
        name: z.string().min(1, "Task type name is required"),
        color: z.string().min(1, "Task type color is required"),
      },
      { required_error: "Please select a task type" }
    ),
    priority: z.object(
      {
        id: z.string().min(1, "Priority selection is required"),
        name: z.string().min(1, "Priority name is required"),
        color: z.string().min(1, "Priority color is required"),
      },
      { required_error: "Please select a priority level" }
    ),
    status: z.object(
      {
        id: z.string().min(1, "Status selection is required"),
        name: z.string().min(1, "Status name is required"),
        color: z.string().min(1, "Status color is required"),
      },
      { required_error: "Please select a task status" }
    ),
    assignee: z.object(
      {
        id: z.string().min(1, "Assignee selection is required"),
        name: z.string().min(1, "Assignee name is required"),
      },
      { required_error: "Please assign this task to someone" }
    ),
    selectedRange: z.object(
      {
        from: z.date({ required_error: "Start date is required" }),
        to: z.date({ required_error: "End date is required" }),
      },
      { required_error: "Please select a date range for this task" }
    ),
    product: z.object(
      {
        id: z.string().min(1, "Product selection is required"),
        name: z.string().min(1, "Product name is required"),
        color: z.string().min(1, "Product color is required"),
      },
      { required_error: "Please select a product" }
    ),
    team: z.object(
      {
        id: z.string().min(1, "Team selection is required"),
        name: z.string().min(1, "Team name is required"),
        color: z.string().min(1, "Team color is required"),
      },
      { required_error: "Please select a team" }
    ),
    folder: z.object(
      {
        id: z.string().min(1, "Folder selection is required"),
        name: z.string().min(1, "Folder name is required"),
        color: z.string().min(1, "Folder color is required"),
      },
      { required_error: "Please select a folder to organize this task" }
    ),
    lists: z
      .array(
        z.object({
          id: z.string().min(1, "List ID is required"),
          name: z.string().min(1, "List name is required"),
        })
      )
      .min(1, "Please select at least one list for this task"),
    description: z.string().optional(),
    ...customFields.reduce((schema, field) => {
      let fieldValidation;

      switch (field.field_type) {
        case "text":
        case "text-area":
        case "single-select":
        case "radio":
          fieldValidation = z
            .string()
            .min(1, `${field.field_name} is required`);
          break;

        case "number":
          fieldValidation = z
            .number()
            .min(0, `${field.field_name} is required`);
          break;

        case "multiple-select":
        case "checkbox":
          fieldValidation = z
            .array(z.string())
            .min(1, `${field.field_name} is required`);
          break;

        default:
          fieldValidation = z.any();
      }

      schema[field.id_field] = field.is_mandatory
        ? fieldValidation
        : fieldValidation.optional();

      return schema;
    }, {}),
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
      assignee: null,
      lists: [],
    },
  });

  const watchForm = watch();

  useEffect(() => {
    setValue("lists", initialValues.lists);
    setValue("folder", initialValues.folder);
    setValue("team", initialValues.team);
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
        onChange: async (api, event) => {
          try {
            const outputData = await api.saver.save();
            setValue("description", JSON.stringify(outputData));
          } catch (error) {
            console.error("Error saving editor data:", error);
          }
        },
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

  const onSubmit = async (values) => {
    const descriptionData = editorRef.current
      ? await editorRef.current.save()
      : {};

    // Collect task data
    const taskData = {
      name: values.taskName,
      task_type_id: values.taskType,
      assignee_ids: values.assignee,
      date_start: new Date(values.selectedRange.from).getTime(),
      date_end: new Date(values.selectedRange.to).getTime(),
      folder_id: values.folder,
      priority_id: values.priority,
      status_id: values.status,
      list_ids: values.lists,
      product_id: values.product,
      team_id: values.team,
      description: descriptionData,
      attachments: attachments,
      parent_task_id: parentTaskId,
    };

    reset();

    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");
    const page = params.get("page");
    const paramId = params.get("param_id");

    fetch(`${baseUrl}/task/create?workspace_id=${workspaceId}&page=${page}`, {
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
    await fetch(
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
    await fetchTasks();
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
                        onChange={async (value) => {
                          const selectedTaskType = {
                            id: value.id_record,
                            name: value.name,
                            color: value.color,
                          };
                          field.onChange(selectedTaskType);

                          // Fetch custom fields based on task type
                          try {
                            const response = await fetch(
                              `${baseUrl}/task/custom-fields?task_type_id=${selectedTaskType.id}`
                            );
                            if (!response.ok) {
                              throw new Error("Failed to fetch custom fields.");
                            }
                            const data = await response.json();
                            console.log(
                              "Custom fields fetched successfully:",
                              data
                            );
                            setCustomFields(data.data || []);
                          } catch (error) {
                            console.error(
                              "Error fetching custom fields:",
                              error
                            );
                          }
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

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium">Assignee</label>
              <Controller
                name="assignee"
                control={control}
                render={({ field }) => (
                  <div>
                    <SingleSelectTag
                      value={field.value}
                      onChange={(value) => {
                        field.onChange({
                          id: value.id,
                          name: value.name,
                        });
                      }}
                      options={indexMember}
                      placeholder="Add assignee"
                    />
                    {errors.assignee && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.assignee.message}
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
                        className={getBorderColor("lists")}
                      />
                      {errors.lists && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lists.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Custom Fields */}
            <CustomFields
              customFields={customFields}
              setCustomFieldValues={setCustomFieldValues}
              customFieldValues={customFieldValues}
              control={control}
              errors={errors}
              watch={watch}
            />

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
                    onBlur={async () => {
                      // Update RHF value when editor loses focus
                      if (editorRef.current) {
                        try {
                          const outputData = await editorRef.current.save();
                          field.onChange(JSON.stringify(outputData));
                        } catch (error) {
                          console.error("Error saving editor data:", error);
                        }
                      }
                    }}
                  ></div>
                )}
              />
            </div>
            {/* Attachments */}
            <DynamicFileAttachments
              setAttachments={setAttachments}
              attachments={attachments}
            />
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
