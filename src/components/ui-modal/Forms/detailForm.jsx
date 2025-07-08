"use client";

import { useEffect, useState, lazy, useRef } from "react";
import { X, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SingleSelectTag, MultipleSelectTags } from "@/components/ui/tag-input";
import DynamicFileAttachmentsForm from "@/components/ui/dynamicAttachmentForm";
const EditorJS = lazy(() => import("@editorjs/editorjs"));
import { useForm, Controller } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PanelGroup, Panel } from "react-resizable-panels";
import { DndContextWrapper } from '@/components/dnd/dndContextWrapper'
import { SortableItem } from '@/components/dnd/sortableItem'
import { DateRangePicker } from "@/components/ui/dateRangePicker";
import { useSearchParams } from 'next/navigation'


export function FormDetailModal({
  isOpen,
  onClose,
  title = "Form View",
  subtitle,
  setForms,
  selectData,
  forms,
  fetchForms,
  form,
  initialValues,
  width = "calc(90vw - 36px)", // Reduced by 10%
  height = "calc(90vh - 36px)", // Reduced by 10%
}) {
  const [isVisible, setIsVisible] = useState(false);
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspace_id')
  const page = searchParams.get('page')

  const {
    indexTaskType,
    indexTeam,
    indexFolder,
    indexList,
  } = selectData;

  const EDITOR_JS_ID = `editorjs-${form.id_form}`;

  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState([]);
  const [availableFields, setAvailableFields] = useState([])
  const [initialFields, setInitialFields] = useState([])
  const [fieldConfig, setFieldConfig] = useState([])
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [activeTab, setActiveTab] = useState('builder');
  const [copied, setCopied] = useState(false)

  // RESIZE IS MOBILE 
  function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < breakpoint)
      }

      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [breakpoint])

    return isMobile
  }
  const isMobile = useIsMobile()

  // Form fields state
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState("");
  const [lists, setLists] = useState([]);
  const [folder, setFolder] = useState(null);
  const [team, setTeam] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [description, setDescription] = useState({});

  const currUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const formSchema = z.object({
    formName: z.string().min(1, 'Form name is required and cannot be empty'),
    team: z.object(
        {
        id: z.string().min(1, 'Team selection is required'),
        name: z.string().min(1, 'Team name is required'),
        color: z.string().min(1, 'Team color is required'),
        },
        { required_error: 'Please select a team' }
    ),
    taskType: z.object(
      {
        id: z.string().min(1, 'Task type selection is required'),
        name: z.string().min(1, 'Task type name is required'),
        color: z.string().min(1, 'Task type color is required'),
      },
      { required_error: 'Please select a task type' }
    ),
    folder: z.object(
        {
        id: z.string().min(1, 'Folder selection is required'),
        name: z.string().min(1, 'Folder name is required'),
        color: z.string().min(1, 'Folder color is required'),
        },
        { required_error: 'Please select a folder to organize this form' }
    ),
    lists: z
        .array(
        z.object({
            id: z.string().min(1, 'List ID is required'),
            name: z.string().min(1, 'List name is required'),
        })
        )
        .min(1, 'Please select at least one list for this form'),
    description: z.string().optional()
  })

  // DELETE FORM ACTION
  const handleDelete = (id_form) => {
    console.log(id_form + " Delete action waiting API");
  };

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
      formName: "",
      assignee: null,
      lists: []
    },
  });

  const fetchData = () => {
    fetch(
      //GET TASKS
      `${baseUrl}/form/initial-field-config?workspace_id=${workspaceId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch DATA.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to fetch DATA.')
        }
        const usedFieldNames = form.form_field?.map((field) => field.originalName) || []

        const filteredFields = data.data.filter(
          (field) => !usedFieldNames.includes(field.originalName)
        )

        setAvailableFields(filteredFields)
        setInitialFields(data.data);
      })
      .catch((error) => {
        console.error('Error fetching DATA:', error)
      })
    console.log('SUCCESS FETCH DATA')
  }

  useEffect(() => {
    if (form) {
      setValue("formName", form.form_name || "");
      setValue("lists", form.list_ids || []);
      setValue("folder", form.folder_id || null);
      setValue("taskType", form.task_type_id || null);
      setValue("team", form.team_id || null);
      setDescription(form.description || "");
      setAttachments(form.attachments || []);
      setFieldConfig(form.form_field || []);
      setFormName(form.form_name || "");
      setFormId(form.id_form || '');
    }
  }, [form]);

  const onSubmit = async (values) => {
    const descriptionData = {data: 'textarea', value: values.description}

    const formData = {
      name: values.formName,
      folder_id: values.folder,
      list_ids: values.lists,
      task_type_id: values.taskType,
      team_id: values.team,
      description: descriptionData,
      attachments: attachments,
      fieldStructure: fieldConfig
    };

    reset();

    // const params = new URLSearchParams(window.location.search);
    // const workspaceId = params.get("workspace_id");
    // const page = params.get("page");
    // const paramId = params.get("param_id");


    // Change API to form update
    fetch(
      `${baseUrl}/form/update?workspace_id=${workspaceId}&form_id=${form.id_form}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create form.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || "Failed to create form.");
        }
        const form = data?.data;
        setValue("formName", form.form_name || "");
        setValue("lists", form.list_ids || []);
        setValue("folder", form.folder_id || null);
        setValue("taskType", form.task_type_id || null);
        setValue("team", form.team_id || null);
        setDescription(form.description || "");
        setAttachments(form.attachments || []);
        setFormName(form.form_name || "");
        setActiveTab("builder");
        setFormId(form.id_form || '');
        setFieldConfig(form.form_field || [])
        
        const usedFieldNames = form.form_field?.map((field) => field.originalName) || []

        const filteredFields = initialFields.filter(
          (field) => !usedFieldNames.includes(field.originalName)
        )

        setAvailableFields(filteredFields)

        fetchForms();
        console.log(form);

        // Close modal
        onClose();
      })
      .catch((error) => {
        console.error("Error creating form:", error);
      });

  };

  const editorRef = useRef(null);
  useEffect(() => {

    if (isOpen) {
      if (!isOpen || !form) return;
      setIsVisible(true);
      document.body.style.overflow = "hidden";

      // fetch initial data
      fetchData();

      // Load fresh form data when modal opens
      setFieldConfig(form.form_field || []);
      setFormName(form.form_name || "");
      setDescription(form.description || {});
      setAttachments(form.attachments || []);
      setFormId(form.id_form || "");
      setActiveTab("builder");

    } else {
      setTimeout(() => {
        setIsVisible(false)
        // Clear form-related states
        setFieldConfig([]);
        setFormName("");
        setDescription({});
        setAttachments([]);
        setAvailableFields([]);
        setFormId("");
        setActiveTab("builder");

        if (editorRef.current && typeof editorRef.current.destroy === 'function') { // makesure destroy type is func
          editorRef.current.destroy()
          editorRef.current = null
        }
        document.body.style.overflow = "";
      }, 300); // Match modal close animation duration
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') { // makesure destroy type is func
        editorRef.current.destroy()
        editorRef.current = null
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

  const handleDragEnd = (newOrder) => {
    const newConfig = newOrder.map((id) => fieldConfig.find((f) => f.id === id))
    setFieldConfig(newConfig)
  }

  const handleAddField = (field) => {
    const uniqueField = { ...field, id: `${field.id}-${Date.now()}`, required: false }
    setFieldConfig((prev) => [...prev, uniqueField])
    setAvailableFields((prev) => prev.filter((f) => f.id !== field.id))
  }

  const handleRemoveField = (field) => {
    // Remove the field from form
    const updatedFields = fieldConfig.filter((f) => f.id !== field.id)
    setFieldConfig(updatedFields)

    // If no fields left, reset availableFields to all initialFields
    if (updatedFields.length === 0) {
      setAvailableFields(initialFields)
      return
    }

    // Else, just return the field back to availableFields if not already there
    const original = initialFields.find(
      (f) => f.originalName === field.originalName
    )

    if (original) {
      setAvailableFields((prev) => {
        const isAlreadyAvailable = prev.some(
          (f) => f.originalName === original.originalName
        )
        if (!isAlreadyAvailable) return [...prev, original]
        return prev
      })
    }
  }

  const handleTabChange = async (value) => {
    setActiveTab(value);
  };

  const handleLabelChange = (id, newLabel) => {
    setFieldConfig((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, label: newLabel } : field
      )
    );
  };

  const handleToggleRequired = (id) => {
    setFieldConfig((prev) =>
        prev.map((field) =>
        field.id === id ? { ...field, required: !field.required } : field
        )
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currUrl}/forms/${formId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // hide after 2 seconds
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getUserName = (userId) => {
    const member = workspaceMembers.find((m) => m.id === userId);
    return member ? member.name : `User ${userId}`;
  };

  if (!isVisible) return null;

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
        </div>{" "}
        {/* Modal Content */}
        <div className="h-[80vh] w-full flex flex-col overflow-hidden">
          <Tabs 
            defaultValue="builder"
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <TabsList className="z-10 bg-white h-10 w-full mb-4 shrink-0">
              <TabsTrigger
                value="builder"
                className="px-4 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-500"
              >
                Builder
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="px-4 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-500"
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="builder" className="flex-1 overflow-auto">

              <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-row lg:flex-row flex-1 overflow-hidden relative"
                >
                  <Panel defaultSize={50}>
                    {/* Main Content */}
                    <div className="h-full bg-white overflow-auto">
                      <div className="flex-3 relative overflow-auto p-4 space-y-4 mb-10">
                        {/* Form Name */}
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium">Form Name</label>
                            <Controller
                              name="formName"
                              control={control}
                              render={({ field }) => (
                                <div>
                                  <Input
                                    {...field}
                                    className={`w-full ${getBorderColor("formName")}`}
                                    placeholder="Enter form name"
                                    value={formName}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setFormName(e.target.value); // update local state
                                    }}
                                  />
                                  {errors.formName && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.formName.message}
                                    </p>
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        {/* Team and Product */}
                        <div className="flex gap-4">
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
                                      }
                                      field.onChange(selectedTaskType)
                                    }}
                                    options={indexTaskType}
                                    placeholder="Select task type"
                                    className={getBorderColor('taskType')}
                                  />
                                  {errors.taskType && (
                                    <p className="text-red-500 text-xs mt-1">Task type is required</p>
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
                              <div>
                                <textarea
                                  className={`w-full min-h-[30vh] border rounded-md px-3 py-2 ${
                                    errors.description
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }`}
                                  placeholder={`Enter Description`}
                                  value={description.value || ''} // Ensure the value is always a string
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setDescription({data: 'text', value: e.target.value}); // update local state
                                  }}
                                />
                                {errors.description && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.description.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      {/* Drag & Drop Builder */}
                        <div className="flex flex-1 justify-right border-t">
                          {/* Left Field List */}
                          <div className="w-1/4 border-r px-4 py-2 overflow-auto bg-gray-50">
                            <h4 className="font-medium text-sm mb-2">TASK FIELDS</h4>
                            <div className="space-y-2">
                              {availableFields.map((field) => (
                                <div
                                  key={field.id}
                                  className="bg-white border p-2 rounded hover:shadow cursor-pointer text-sm"
                                  onClick={() => handleAddField(field)}
                                >
                                  {field.label}
                                </div>
                              ))}
                            </div>
                          </div>
              
                          {/* Center Drop Zone */}
                          <div className="flex-1 overflow-auto p-6 space-y-6">
                            <DndContextWrapper items={fieldConfig.map(f => f.id)} onDragEnd={handleDragEnd}>
                              {fieldConfig.map((field, index) => (
                                <SortableItem key={field.id} id={field.id}>
                                  <div className="p-4 border rounded bg-white mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-blue-500 font-bold">{String(index + 1).padStart(2, '0')}</span>
                                        {editingLabelId === field.id ? (
                                        <input
                                          type="text"
                                          autoFocus
                                          value={field.label}
                                          onChange={(e) => handleLabelChange(field.id, e.target.value)}
                                          onBlur={() => setEditingLabelId(null)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') setEditingLabelId(null);
                                          }}
                                          className="text-sm font-medium border px-1 py-0.5 rounded bg-white"
                                        />
                                      ) : (
                                        <div
                                          className="text-sm font-medium cursor-pointer flex items-center gap-1 group"
                                          onClick={() => setEditingLabelId(field.id)}
                                        >
                                          <span>{field.label}</span>
                                          <Pencil
                                            size={14}
                                            className="text-gray-400"
                                          />
                                        </div>
                                      )}
                                      {/* Original Form Field Name (like 'Task Name') */}
                                      <div className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                        {field.originalName}
                                      </div>
                                      </div>
                                      <button
                                        type="button"
                                        className="text-xs text-red-500 hover:underline"
                                        onClick={() => handleRemoveField(field)}
                                      >
                                        Remove
                                      </button>       
                                    </div>
                                    {field.type === 'text' && (
                                      <input disabled type="text" className="w-full p-2 border rounded" placeholder={field.placeholder} />
                                    )}
                                    {field.type === 'select' && (
                                      <select disabled className="w-full p-2 border rounded">
                                        <option>{field.placeholder}</option>
                                        {field.options?.map(opt => (
                                          <option key={opt.id}>{opt.name}</option>
                                        ))}
                                      </select>
                                    )}
                                    {field.type === 'textarea' && (
                                      <textarea disabled className="w-full p-2 border rounded" placeholder={field.placeholder}></textarea>
                                    )}
                                    {field.type === 'file' && (
                                      <div className="w-full border rounded p-3 text-muted-foreground bg-gray-50 cursor-not-allowed">
                                        File upload preview (disabled)
                                      </div>
                                    )}
                                    {field.type === 'date-range' && (
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          disabled
                                          className="w-full p-2 border rounded bg-gray-100 text-muted-foreground"
                                          placeholder="Start date"
                                          value={
                                            field.value?.from
                                              ? new Date(field.value.from).toLocaleDateString()
                                              : ''
                                          }
                                        />
                                        <input
                                          type="text"
                                          disabled
                                          className="w-full p-2 border rounded bg-gray-100 text-muted-foreground"
                                          placeholder="End date"
                                          value={
                                            field.value?.to
                                              ? new Date(field.value.to).toLocaleDateString()
                                              : ''
                                          }
                                        />
                                      </div>
                                    )}
                                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                      <span>Required</span>
                                      <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={() => handleToggleRequired(field.id)} // Determine required section or not
                                      />
                                    </div>
                                  </div>
                                </SortableItem>
                              ))}
                            </DndContextWrapper>
                          </div>
                        </div>
                      

                      {/* Submit & Delete Button - positioned to avoid sidebar overlap */}
                      <div className="sticky flex justify-end bottom-0 mr-6 h-fit backdrop-blur-md">
                        <Button onClick={()=> handleDelete(form?.id_form)} type="button" className="bg-red-500 text-white px-6 py-2 rounded-md shadow-lg mr-1 cursor-pointer">
                          DELETE
                        </Button>
                        <Button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-lg cursor-pointer mb-3">
                          SAVE
                        </Button>
                      </div>
                    </div>
                  </Panel>
                </form>
              </PanelGroup>
            </TabsContent>

            {/* PREVIEW TAB */}

            {!formName && !description && fieldConfig.length === 0 ? (
              <div className="text-center text-gray-400 italic">Nothing to preview.</div>
            ) : (
              
              <TabsContent value="preview" className="flex-1 overflow-auto p-6">
                <div className="flex justify-center gap-10">
                  {/* Preview Form */}
                  <div className="max-w-xl w-full border rounded-lg p-7 shadow-md">
                    <h2 className="text-2xl font-bold text-purple-600 mb-4">
                      {formName || "Untitled Form"}
                    </h2>
                    <div
                      className="italic text-sm text-gray-600 mb-6"
                      dangerouslySetInnerHTML={{ __html: description.value }}
                    />

                    {fieldConfig.map((field, index) => (
                      <div key={field.id} className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          {field.label}{field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'text' && (
                          <input type="text" className="w-full p-2 border rounded" placeholder={field.placeholder} />
                        )}
                        {field.type === 'select' && (
                          <>
                            {field.id === 'assignee' ? (
                              <div>
                                <SingleSelectTag
                                  value={null} // placeholder
                                  onChange={() => {}}
                                  options={field.options}
                                  placeholder="Add assignee"
                                />
                              </div>
                            ) : (
                              <div>
                                <SingleSelectTag
                                  value={null} // placeholder
                                  onChange={() => {}}
                                  options={field.options}
                                  placeholder={`Select ${field.label}`}
                                  className={getBorderColor(field.label)}
                                />
                              </div>
                            )}
                          </>
                        )}
                        {field.type === 'textarea' && (
                          <textarea className="w-full p-2 border rounded" placeholder={field.placeholder}></textarea>
                        )}
                        {field.type === 'file' && (
                          <DynamicFileAttachmentsForm setAttachments={setAttachments} attachments={attachments} />
                        )}
                        {field.type === 'date-range' && (
                          <div>
                            <DateRangePicker
                              value={null} // placeholder
                              onChange={() => {}}
                              placeholder={field.placeholder}
                            />
                            {errors.selectedRange && (
                              <p className="text-red-500 text-xs mt-1">Date range is required</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {fieldConfig.length > 0 && (
                      <Button type="disabled" className="bg-blue-500 text-white px-6 py-2 rounded-md w-full" disabled>
                          SUBMIT
                      </Button>
                    )}
                  </div>

                  {/* Public Link Card */}
                  <div className="w-100 h-fit p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Public Link</h3>

                    <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                      <span className="px-3 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-2.121 2.121a4 4 0 105.657 5.657l1.415-1.415M10.172 13.828a4 4 0 005.656 0l2.121-2.121a4 4 0 10-5.657-5.657l-1.415 1.415"
                          />
                        </svg>
                      </span>

                      <input
                        type="text"
                        readOnly
                        value={`${currUrl}/forms/${formId}`}
                        className="flex-1 px-2 py-1 text-sm text-gray-700 bg-transparent outline-none"
                      />

                      <button
                        onClick={handleCopy}
                        className="bg-blue-500 text-white text-xs font-medium px-4 py-1.5 hover:bg-blue-600 transition"
                      >
                        Copy
                      </button>

                    </div>
                    {/* Copied message */}
                    {copied && (
                      <p className="text-green-600 text-xs mt-2 font-medium">Link copied!</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
