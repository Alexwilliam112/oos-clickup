'use client'
import { useEffect, useState, lazy, Suspense, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { X } from 'lucide-react'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DateRangePicker } from '@/components/ui/dateRangePicker.jsx'
import { SingleSelectTag, MultipleSelectTags } from '@/components/ui/tag-input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DynamicFileAttachmentsForm from '@/components/ui/dynamicAttachmentForm'
const EditorJS = lazy(() => import('@editorjs/editorjs'))
import edjsHTML from 'editorjs-html'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import CustomFields from '../customFields'
import { DndContextWrapper } from '@/components/dnd/dndContextWrapper'
import { SortableItem } from '@/components/dnd/sortableItem'
import { initialFieldConfig } from '@/components/dnd/initialFieldConfig'
import { useSearchParams } from 'next/navigation'


const edjsParser = edjsHTML()
const EDITORJS_ID = 'editorjs-create-board'

export function FormCreateModal({
  isOpen,
  onClose,
  title = 'Form View',
  subtitle,
  selectData,
  fetchForms,
  width = 'calc(90vw - 36px)', // Reduced by 10%
  height = 'calc(90vh - 36px)', // Reduced by 10%
}) {
  const [isVisible, setIsVisible] = useState(false)
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
  const {
    indexTaskType,
    indexTeam,
    indexFolder,
    indexList,
  } = selectData

  // Form fields state
  const [formName, setFormName] = useState('')
  const [description, setDescription] = useState('')
  const [lists, setLists] = useState([])
  const [folder, setFolder] = useState(null)
  const [team, setTeam] = useState(null)
  const [availableFields, setAvailableFields] = useState([])
  const [initialFields, setInitialFields] = useState([])
  const [fieldConfig, setFieldConfig] = useState([])

  const [availableCustomFields, setAvailableCustomFields] = useState([])
  const [initialCustomFields, setInitialCustomFields] = useState([])
  const [customFieldConfig, setCustomFieldConfig] = useState([])
  const [activeTab, setActiveTab] = useState('builder');
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [attachments, setAttachments] = useState([])

  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspace_id')
  const page = searchParams.get('page')

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
    description: z.string().optional(),
  })

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
      formName: '',
      lists: [],
    },
  })

  const fetchData = async () => {
     try {
        const response = await fetch(`${baseUrl}/form/initial-field-config?workspace_id=${workspaceId}`)
        if (!response.ok) throw new Error('Failed to fetch DATA.')

        const result = await response.json()
        if (result.error) throw new Error(result.message || 'Failed to fetch DATA.')

        console.log('SUCCESS FETCH DATA')
        return result.data
      } catch (error) {
        console.error('Error fetching DATA:', error)
        return [] // return empty array on error
      }
  }

  const editorRef = useRef(null)
  useEffect(() => {

    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'

      // Fetch Initial Config Data
      const loadInitialData = async() => {
        try {
          const mandatoryField = await fetchData()
          setAvailableFields(mandatoryField)
          setInitialFields(mandatoryField)
        } catch (error) {
          console.error('Error loading initial fields:', error)
        }
      }
      loadInitialData()
      
    } else {
      setTimeout(() => {
        setIsVisible(false)
        reset()
        setFieldConfig([])
        setAvailableFields([])
        setFormName('')
        setDescription('')
        if (editorRef.current) {
          editorRef.current.destroy()
          editorRef.current = null
        }
        document.body.style.overflow = ''
      }, 300) // Match modal close animation duration
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const getBorderColor = (fieldName) => (errors[fieldName] ? 'border-red-500' : 'border-gray-300')

  if (!isVisible) return null

  const handleDragEnd = (newOrder) => {
    const newConfig = newOrder.map((id) => fieldConfig.find((f) => f.id === id))
    setFieldConfig(newConfig)
  }

  const handleAddField = (field) => {
    const uniqueField = {
      ...field,
      id: `${field.id}-${Date.now()}`,
      required: false
    }
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

  const onError = (errors) => {
    console.log("Form validation errors:", errors);
  };

  const onSubmit = async (values) => {
    const descriptionData = {data: 'textarea', value: values.description}

    // Collect form data
    const formData = {
      form_name: values.formName,
      folder_id: values.folder,
      list_ids: values.lists,
      task_type_id: values.taskType,
      team_id: values.team,
      description: descriptionData,
      attachments: attachments,
      fieldStructure: fieldConfig
    }

    reset()
    setFieldConfig([])
    setFormName('')
    setDescription('')
    setFieldConfig([])
    setAvailableFields([])
    setAttachments([]);
    setActiveTab('builder');

    // const params = new URLSearchParams(window.location.search)
    // const workspaceId = params.get('workspace_id')
    // const page = params.get('page')

    // Change to Form creation

    await fetch(`${baseUrl}/form/create?workspace_id=${workspaceId}&page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create form.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to create form.')
        }
        console.log('Form created successfully:', data)
      })
      .catch((error) => {
        console.error('Error creating form:', error)
      })

    // close modal
    await fetchForms()
    onClose()
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/10 transition-opacity duration-300 min-h-screen',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300 transform',
          isOpen ? 'scale-100' : 'scale-95'
        )}
        style={{
          width,
          height,
          maxWidth: 'calc(90vw - 36px)', // Reduced by 10%
          maxHeight: 'calc(90vh - 36px)', // Reduced by 10%
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

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
            <TabsContent value="builder" className="flex-1 h-full overflow-auto">
              <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-1 overflow-hidden relative">
                {/* Main Content */}
                <div className="flex-1 overflow-auto p-4 space-y-4 mb-10">
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
                              className={`w-full ${getBorderColor('formName')}`}
                              placeholder="Enter form name"
                              onChange={(e) => {
                                field.onChange(e);
                                setFormName(e.target.value); // update local state
                              }}
                            />
                            {errors.formName && (
                              <p className="text-red-500 text-xs mt-1">{errors.formName.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  {/* Team and Task Type */}
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
                                const currentValue = field.value;

                                // Check if it's different before deleting custom fields
                                const isDifferent =
                                  !currentValue ||
                                  currentValue.id !== selectedTaskType.id ||
                                  currentValue.name !== selectedTaskType.name ||
                                  currentValue.color !== selectedTaskType.color;

                                field.onChange(selectedTaskType)

                                if (isDifferent) {
                                  const mandatoryField = await fetchData()
                                  setAvailableFields(mandatoryField)
                                  setInitialFields(mandatoryField);
                                  setFieldConfig([]);

                                  // Fetch custom fields based on task type
                                  try {
                                    const response = await fetch(
                                      `${baseUrl}/form/initial-custom-field-config?task_type_id=${selectedTaskType.id}`
                                    )
                                    if (!response.ok) {
                                      throw new Error('Failed to fetch custom fields.')
                                    }
                                    const data = await response.json()
                                    console.log('Custom fields fetched successfully:', data)

                                    const customFields = data.data;
                                    setAvailableFields(prev => [...prev, ...customFields])
                                    setInitialFields(prev => [...prev, ...customFields])
                                    
                                  } catch (error) {
                                    console.error('Error fetching custom fields:', error)
                                  }
                                }                                                            
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
                                })
                              }}
                              options={indexTeam}
                              placeholder="Select team"
                              className={getBorderColor('team')}
                            />
                            {errors.team && <p className="text-red-500 text-xs mt-1">Team is required</p>}
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
                                })
                              }}
                              options={indexFolder}
                              placeholder="Select Folder"
                              className={getBorderColor('folder')}
                            />
                            {errors.folder && (
                              <p className="text-red-500 text-xs mt-1">Folder is required</p>
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
                              className={getBorderColor('lists')}
                            />
                            {errors.lists && (
                              <p className="text-red-500 text-xs mt-1">{errors.lists.message}</p>
                            )}
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
                            value={field.value || ""} // Ensure the value is always a string
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setDescription(e.target.value); // update local state
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
                <div className="flex flex-1 border-t">
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
                            {field.type === 'radio' && (
                              <div className="space-y-1">
                                {field.options.map((opt) => (
                                  <label key={opt.id} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <input
                                      type="radio"
                                      disabled
                                      name={field.originalName}
                                      className="cursor-not-allowed"
                                    />
                                    <span>{opt.name}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {field.type === 'number' && (
                              <input
                                type="number"
                                disabled
                                className="w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                                placeholder={field.placeholder || 'Enter a number'}
                              />
                            )}
                            {field.type === 'checkbox' && (
                              <div className="space-y-1">
                                {field.options.map((opt) => (
                                  <label key={opt.id} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <input
                                      type="checkbox"
                                      disabled
                                      className="cursor-not-allowed"
                                    />
                                    <span>{opt.name}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {field.type === 'multiple-select' && (
                              <select
                                multiple
                                disabled
                                className="w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                              >
                                {field.options.map((opt) => (
                                  <option key={opt.id} value={opt.value}>
                                    {opt.name}
                                  </option>
                                ))}
                              </select>
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

                {/* Submit Button */}
                <div className="absolute bottom-2 right-4 shrink-0">
                  <Button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
                    ADD
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* PREVIEW TAB */}
            <TabsContent value="preview" className="flex-1 overflow-auto p-6">
            {!formName && !description && fieldConfig.length === 0 ? (
              <div className="text-center text-gray-400 italic">Nothing to preview.</div>
            ) : (  
                <div className="max-w-2xl mx-auto border-2 border-gray-300 rounded-lg p-7 shadow-lg">
                  <h2 className="text-2xl text-purple-700 font-semibold mb-4">{formName || 'Untitled Form'}</h2>
                  <div className='max-w-[90%] break-words'>
                    <h4 className="text-l italic text-gray-600 mb-4">{description}</h4>
                  </div>

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
                      {field.type === 'radio' && (
                        <>
                          {field.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id={opt.id}
                                value={opt.value}
                                checked={'' === opt.value}
                                onChange={() => {}}
                                className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                  errors[field.originalName]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              <label
                                htmlFor={opt.id}
                                className="text-sm font-medium text-gray-700"
                              >
                                {opt.value}
                              </label>
                            </div>
                          ))}
                        </>
                      )}
                      {field.type === 'checkbox' && (
                        <>
                          {field.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={opt.id}
                                value={opt.value}
                                checked={([]).includes(opt.value)} // Ensure the value is always an array
                                onChange={() => {}}
                                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                  errors[field.originalName]
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              <label
                                htmlFor={opt.id}
                                className="text-sm font-medium text-gray-700"
                              >
                                {opt.value}
                              </label>
                            </div>
                          ))}
                        </>
                      )}
                      {field.type === 'multiple-select' && (
                        <MultipleSelectTags
                          value={null} // Ensure the value is always an array
                          onChange={() => {}}
                          options={field.options}
                          placeholder={`Add ${field.label}`}
                          className={
                            errors.customFields?.[field_name]
                              ? "border-red-500"
                              : "border-gray-300"
                          }
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          className={`w-full p2`}
                          placeholder={field.placeholder}
                          value={''} // Ensure the value is always a number or empty string
                          onChange={() => {}}
                        />
                      )}
                    </div>
                  ))}
                  {fieldConfig.length > 0 && (
                    <Button type="disabled" className="bg-blue-500 text-white px-6 py-2 rounded-md w-full" disabled>
                        SUBMIT
                    </Button>
                  )}
                </div>
            )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
