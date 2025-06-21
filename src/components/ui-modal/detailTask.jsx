"use client";
import { useEffect, useState, lazy, Suspense, useRef, use } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/dateRangePicker.jsx";
import { SingleSelectTag, MultipleSelectTags } from "@/components/ui/tag-input";
import DynamicFileAttachments from "../ui/dynamicAttachments";
const EditorJS = lazy(() => import("@editorjs/editorjs"));
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export function TaskDetailModalV2({
  isOpen,
  onClose,
  title = "Task View",
  subtitle,
  showSidebar = true,
  sidebarWidth = 420,
  parentTaskId,
  sidebarContent,
  selectData,
  fetchTasks,
  task,
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
  const [description, setDescription] = useState("");

  // Comment section state
  const [comments, setComments] = useState([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [showMemberList, setShowMemberList] = useState(false);
  const [mentionPosition, setMentionPosition] = useState(0);

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
  useEffect(() => {
    if (task) {
      setValue("taskName", task.name || "");
      setValue("assignee", task.assignee_ids || null);
      setValue("lists", task.list_ids || []);
      setValue("folder", task.folder_id || null);
      setValue("product", task.product_id || null);
      setValue("team", task.team_id || null);
      setValue("selectedRange", {
        from: new Date(task.date_start),
        to: new Date(task.date_end),
      });
      setValue("taskType", task.task_type_id || null);
      setValue("priority", task.priority_id || null);
      setValue("status", task.status_id || null);
      setDescription(task.description || "");
      setAttachments(task.attachments || []);
    }
  }, [task]);

  // Fetch comments for the task
  const fetchComments = async () => {
    if (!task) return;
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    try {
      const response = await fetch(
        `${baseUrl}/comment/index?task_id=${task.id_task}`
      );
      const data = await response.json();
      if (!data.error) {
        setComments(data.data.sort((a, b) => a.created_at - b.created_at));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch workspace members for tagging
  const fetchWorkspaceMembers = async () => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    try {
      const response = await fetch(
        `${baseUrl}/workspace-member/index?workspace_id=${workspaceId}`
      );
      const data = await response.json();
      if (!data.error) {
        setWorkspaceMembers(data.data);
      }
    } catch (error) {
      console.error("Error fetching workspace members:", error);
    }
  };

  // Fetch comments when task is loaded
  useEffect(() => {
    if (task && isOpen) {
      fetchComments();
      fetchWorkspaceMembers();
    }
  }, [task, isOpen]);

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
        data: description || { blocks: [] },
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

    setTaskName("");
    setTaskType(null);
    setAssignee(null);
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

    fetch(
      `${baseUrl}/task/update?workspace_id=${workspaceId}&task_id=${task.id_task}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }
    )
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

    // Close modal    fetchTasks();
    onClose();
  };

  // Handle comment input changes
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @ mentions
    const atIndex = value.lastIndexOf("@");
    if (atIndex !== -1 && atIndex === value.length - 1) {
      setShowMemberList(true);
      setMentionPosition(atIndex);
    } else if (showMemberList && value[value.lastIndexOf("@") + 1] === " ") {
      setShowMemberList(false);
    }
  };

  // Handle member selection for tagging
  const handleMemberSelect = (member) => {
    const beforeMention = newComment.substring(0, mentionPosition);
    const afterMention = newComment.substring(mentionPosition + 1);
    const newValue = `${beforeMention}@${member.name} ${afterMention}`;

    setNewComment(newValue);
    setTaggedUsers([...taggedUsers, member.id]);
    setShowMemberList(false);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace_id");

    try {
      const response = await fetch(
        `${baseUrl}/comment/create?workspace_id=${workspaceId}&task_id=${task.id_task}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
            user_id: 178566, // You'll need to get this from your auth context
            tagged_user_ids: taggedUsers,
          }),
        }
      );

      const data = await response.json();
      if (!data.error) {
        setNewComment("");
        setTaggedUsers([]);
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getUserName = (userId) => {
    const member = workspaceMembers.find((m) => m.id === userId);
    return member ? member.name : `User ${userId}`;
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 transition-opacity duration-300",
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
          className="flex flex-row flex-1 overflow-hidden relative"
        >
          {/* Sidebar */}
          {showSidebar && (
            <div className=" flex-1 overflow-auto p-4 space-y-4 mb-10">
              <div className="w-1 bg-gray-100 cursor-col-resize" />
              <div
                className="overflow-auto border-l"
                style={{ width: sidebarWidth }}
              >
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">Sub-Tasks</h3>
                  {sidebarContent || (
                    <div className="text-gray-500">List of sub tasks</div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Main Content */}
          <div className="flex-3 overflow-auto p-4 space-y-4 mb-10">
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

              {/* Priority and action */}
              <div className="flex-1 flex flex-row">
                {/* task status */}
                <div className="flex-4">
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

                {/* Next status button */}
                <div className="flex-1 flex flex-col items-center justify-end">
                  <label className="block text-sm font-medium"></label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 flex items-center gap-2 px-2 py-2 border border-blue-500 text-blue-500 font-medium rounded-md hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={() => console.log("Next status triggered")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 3l14 9-14 9V3z"
                      />
                    </svg>
                  </Button>
                </div>
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
                      onChange={(value) => field.onChange(value)}
                      options={indexMember}
                      placeholder="Add assignee"
                      className={getBorderColor("assignee")}
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
            <DynamicFileAttachments
              setAttachments={setAttachments}
              attachments={attachments}
            />
          </div>{" "}
          {/* Right Sidebar - Activity/Comments Section */}
          {showSidebar && (
            <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.34l-5.487 2.01a.5.5 0 01-.643-.643l2.01-5.487c-.2-.72-.34-1.478-.34-2.319 0-4.418 3.582-8 8-8s8 3.582 8 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Activity
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {comments.length} comment
                      {comments.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>{" "}
              {/* Comments Feed */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {comments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-gray-600 text-sm font-medium mb-2">
                      No comments yet
                    </h4>
                    <p className="text-gray-400 text-xs">
                      Start the conversation below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {comments.map((comment, index) => (
                      <div key={comment.id} className="relative">
                        {/* Timeline line */}
                        {index < comments.length - 1 && (
                          <div className="absolute left-5 top-14 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                        )}

                        <div className="flex space-x-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                              <span className="text-white text-sm font-bold">
                                {getUserName(comment.created_by)
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>

                          {/* Comment Content */}
                          <div className="flex-1 min-w-0">
                            {/* Comment Header */}
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="text-sm font-semibold text-gray-900">
                                {getUserName(comment.created_by)}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span className="text-xs text-gray-500 font-medium">
                                  {formatTimestamp(comment.created_at)}
                                </span>
                              </div>
                            </div>

                            {/* Comment Body */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {comment.content}
                              </p>

                              {/* Tagged Users */}
                              {comment.tagged_user_ids.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <svg
                                      className="w-3 h-3 text-blue-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-600">
                                      Mentioned:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {comment.tagged_user_ids.map(
                                      (userId, idx) => (
                                        <div
                                          key={idx}
                                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                        >
                                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                          @{getUserName(userId)}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>{" "}
              {/* Add Comment Section */}
              <div className="border-t border-gray-200 bg-white px-6 py-4 space-y-3 relative">
                {/* Comment Input with Button */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={newComment}
                      onChange={handleCommentChange}
                      placeholder="Write a comment... Use @ to mention teammates"
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                      rows="3"
                    />

                    {/* Member Mention Dropdown */}
                    {showMemberList && (
                      <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-auto z-50 mb-2">
                        <div className="p-2 border-b border-gray-100">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Mention Teammate
                          </span>
                        </div>
                        {workspaceMembers.map((member) => (
                          <div
                            key={member.id}
                            onClick={() => handleMemberSelect(member)}
                            className="p-3 hover:bg-blue-50 cursor-pointer flex items-center space-x-3 transition-colors"
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm"
                              style={{
                                backgroundColor: member.color || "#6366f1",
                              }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-900 block truncate">
                                {member.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                @{member.name.toLowerCase().replace(/\s+/g, "")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Comment Button */}
                  <button
                    type="button"
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 flex-shrink-0"
                    style={{ height: "fit-content" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span>Post</span>
                  </button>
                </div>

                {/* Tagged Users Preview */}
                {taggedUsers.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-blue-700">
                        Mentioning:{" "}
                        {taggedUsers.map((id) => getUserName(id)).join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Submit Button - positioned to avoid sidebar overlap */}
          <div
            className={`absolute bottom-4 ${
              showSidebar ? "right-[400px]" : "right-4"
            }`}
          >
            <Button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-lg"
            >
              SAVE
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
  assignee: z.object({
    id: z.string().min(1, "Assignee is required"),
    name: z.string(),
  }),
  selectedRange: z.object({
    from: z.date(),
    to: z.date(),
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
    })
  ),
  description: z.string().optional(),
});
