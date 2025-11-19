'use client'
import { useEffect, useState, lazy, Suspense, useRef } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { DateRangePicker } from '@/components/ui/dateRangePicker.jsx'
import { SingleSelectTag, MultipleSelectTags } from '@/components/ui/tag-input'
import DynamicFileAttachments from '../ui/dynamicAttachments'
const EditorJS = lazy(() => import('@editorjs/editorjs'))
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import CustomFields from './customFields'
import { masterService, workspaceService } from '@/service/index.mjs'

export function TaskCreateModal({
  isOpen,
  onClose,
  title = 'Task View',
  subtitle,
  parentTaskId,
  selectData,
  fetchTasks,
  initialValues,
  editorJsId = 'editorjs-default',
  width = 'calc(90vw - 36px)',
  height = 'calc(90vh - 36px)',
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
  
  // Mapping originalName -> sanitizedName to avoid special character issues with RHF/Zod
  const nameMapRef = useRef({})

  const sanitizeFieldName = (name) => {
    const base = name.replace(/[^a-zA-Z0-9]/g, '_')
    return base.replace(/_+/g, '_').replace(/^_/, '').replace(/_$/, '').toLowerCase()
  }
  
  // State declarations for auto-refetching functionality
  const [isRefetchingOptions, setIsRefetchingOptions] = useState(false);
  const [refetchedOptions, setRefetchedOptions] = useState({});
  
  const {
    indexTaskType,
    indexStatus,
    indexPriority,
    indexProduct,
    indexMember,
    indexTeam,
    indexFolder,
    indexList,
  } = selectData

  // Merge original selectData with refetched options
  const effectiveSelectData = {
    indexTaskType: refetchedOptions.indexTaskType || indexTaskType || [],
    indexStatus: refetchedOptions.indexStatus || indexStatus || [],
    indexPriority: refetchedOptions.indexPriority || indexPriority || [],
    indexProduct: refetchedOptions.indexProduct || indexProduct || [],
    indexMember: refetchedOptions.indexMember || indexMember || [],
    indexTeam: refetchedOptions.indexTeam || indexTeam || [],
    indexFolder: refetchedOptions.indexFolder || indexFolder || [],
    indexList: refetchedOptions.indexList || indexList || [],
  };

  // Task fields state
  const [taskName, setTaskName] = useState('')
  const [taskType, setTaskType] = useState(null)
  const [assignee, setAssignee] = useState(null)
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState(null)
  const [lists, setLists] = useState([])
  const [folder, setFolder] = useState(null)
  const [product, setProduct] = useState(null)
  const [team, setTeam] = useState(null)
  const [customFields, setCustomFields] = useState([])
  const [customFieldValues, setCustomFieldValues] = useState([])

  const [attachments, setAttachments] = useState([])
  const [selectedRange, setSelectedRange] = useState({
    from: null,
    to: null,
  })

  const formSchema = z.object({
    taskName: z.string().min(1, 'Task name is required and cannot be empty'),
    taskType: z.object(
      {
        id: z.string().min(1, 'Task type selection is required'),
        name: z.string().min(1, 'Task type name is required'),
        color: z.string().min(1, 'Task type color is required'),
      },
      { required_error: 'Please select a task type' }
    ),
    priority: z.object(
      {
        id: z.string().min(1, 'Priority selection is required'),
        name: z.string().min(1, 'Priority name is required'),
        color: z.string().min(1, 'Priority color is required'),
      },
      { required_error: 'Please select a priority level' }
    ),
    status: z.object(
      {
        id: z.string().min(1, 'Status selection is required'),
        name: z.string().min(1, 'Status name is required'),
        color: z.string().min(1, 'Status color is required'),
      },
      { required_error: 'Please select a task status' }
    ),
    assignee: z.object(
      {
        id: z.string().min(1, 'Assignee selection is required'),
        name: z.string().min(1, 'Assignee name is required'),
      },
      { required_error: 'Please assign this task to someone' }
    ),
    selectedRange: z.object(
      {
        from: z.date({ required_error: 'Start date is required' }),
        to: z.date({ required_error: 'End date is required' }),
      },
      { required_error: 'Please select a deadline for this task' }
    ),
    product: z.object(
      {
        id: z.string().min(1, 'Product selection is required'),
        name: z.string().min(1, 'Product name is required'),
        color: z.string().min(1, 'Product color is required'),
      },
      { required_error: 'Please select a product' }
    ),
    team: z.object(
      {
        id: z.string().min(1, 'Team selection is required'),
        name: z.string().min(1, 'Team name is required'),
        color: z.string().min(1, 'Team color is required'),
      },
      { required_error: 'Please select a team' }
    ),
    folder: z.object(
      {
        id: z.string().min(1, 'Folder selection is required'),
        name: z.string().min(1, 'Folder name is required'),
        color: z.string().min(1, 'Folder color is required'),
      },
      { required_error: 'Please select a folder to organize this task' }
    ),
    lists: z
      .array(
        z.object({
          id: z.string().min(1, 'List ID is required'),
          name: z.string().min(1, 'List name is required'),
        })
      )
      .min(1, 'Please select at least one list for this task'),
    description: z.string().optional(),

    customFields:
      customFields.length > 0
        ? z.object(
            customFields.reduce((schema, field, idx) => {
              const { field_type, field_name, is_mandatory } = field
              const originalName = field_name
              let sanitized = sanitizeFieldName(originalName)
              
              // Ensure uniqueness if collision
              if (Object.values(nameMapRef.current).includes(sanitized)) {
                sanitized = `${sanitized}_${idx}`
              }
              nameMapRef.current[originalName] = sanitized
              
              let fieldValidation

              switch (field_type) {
                case 'text':
                case 'text-area':
                  fieldValidation = z.string()
                  if (is_mandatory) {
                    fieldValidation = fieldValidation.min(1, `${field_name} is required`)
                  }
                  break
                case 'number':
                  fieldValidation = z.number({
                    required_error: `${field_name} is required`,
                  })
                  break
                case 'single-select':
                  if (is_mandatory) {
                    fieldValidation = z.object({
                      id_record: z.string().min(1, `${field_name} is required`),
                      name: z.string().min(1, `${field_name} is required`),
                    })
                  } else {
                    fieldValidation = z.object({
                      id_record: z.string(),
                      name: z.string(),
                    }).nullable().optional()
                  }
                  break
                case 'multiple-select':
                  fieldValidation = z.array(
                    z.object({
                      id: z.string().min(1, 'Multiple-Select id is required'),
                      key: z.string().min(1, 'Multiple-Select key is required'),
                      name: z.string().min(1, 'Multiple-Select name is required'),
                    })
                  )
                  if (is_mandatory) {
                    fieldValidation = fieldValidation.min(1, `${field_name} is required`)
                  }
                  break
                case 'checkbox':
                  fieldValidation = z.array(z.string())
                  if (is_mandatory) {
                    fieldValidation = fieldValidation.min(1, `${field_name} is required`)
                  }
                  break
                case 'radio':
                  fieldValidation = z.string()
                  if (is_mandatory) {
                    fieldValidation = fieldValidation.min(1, `${field_name} is required`)
                  }
                  break
                default:
                  fieldValidation = z.string().optional()
              }

              // Apply mandatory validation or make optional
              if (!is_mandatory) {
                fieldValidation = fieldValidation.optional()
              }

              schema[sanitized] = fieldValidation
              return schema
            }, {})
          )
        : z.object({}).optional(),
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
      taskName: '',
      assignee: null,
      lists: [],
    },
  })

  useEffect(() => {
    setValue('lists', initialValues?.lists)
    setValue('folder', initialValues?.folder)
    setValue('team', initialValues?.team)
  }, [initialValues])

  // Add debugging and fallback for missing options
  useEffect(() => {
    if (isOpen) {
      console.log('TaskCreateModal selectData:', {
        indexStatus: indexStatus?.length || 0,
        indexPriority: indexPriority?.length || 0,
        indexProduct: indexProduct?.length || 0,
        indexTaskType: indexTaskType?.length || 0,
        indexMember: indexMember?.length || 0,
        indexTeam: indexTeam?.length || 0,
        indexFolder: indexFolder?.length || 0,
        indexList: indexList?.length || 0,
      });
      
      // Check if critical options are missing and refetch automatically
      const missingOptions = [];
      if (!effectiveSelectData.indexStatus || effectiveSelectData.indexStatus.length === 0) missingOptions.push('Status');
      if (!effectiveSelectData.indexPriority || effectiveSelectData.indexPriority.length === 0) missingOptions.push('Priority');
      if (!effectiveSelectData.indexProduct || effectiveSelectData.indexProduct.length === 0) missingOptions.push('Product');
      if (!effectiveSelectData.indexTaskType || effectiveSelectData.indexTaskType.length === 0) missingOptions.push('TaskType');
      if (!effectiveSelectData.indexMember || effectiveSelectData.indexMember.length === 0) missingOptions.push('Member');
      if (!effectiveSelectData.indexTeam || effectiveSelectData.indexTeam.length === 0) missingOptions.push('Team');
      if (!effectiveSelectData.indexFolder || effectiveSelectData.indexFolder.length === 0) missingOptions.push('Folder');
      if (!effectiveSelectData.indexList || effectiveSelectData.indexList.length === 0) missingOptions.push('List');
      
      if (missingOptions.length > 0) {
        console.warn('Missing dropdown options in TaskCreateModal:', missingOptions);
        console.log('Attempting to refetch missing options automatically...');
        refetchMissingOptions(missingOptions);
      }
    }
  }, [isOpen, indexStatus, indexPriority, indexProduct, indexTaskType, indexMember, indexTeam, indexFolder, indexList]);

  // Function to refetch missing dropdown options
  const refetchMissingOptions = async (missingOptions) => {
    if (isRefetchingOptions) return; // Prevent multiple simultaneous refetches
    
    setIsRefetchingOptions(true);
    
    try {
      console.log('Refetching missing options:', missingOptions);
      
      const refetchPromises = [];
      
      if (missingOptions.includes('Status')) {
        refetchPromises.push(
          masterService.getStatuses().then(data => {
            console.log('Refetched Status options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexStatus: data }));
          })
        );
      }
      
      if (missingOptions.includes('Priority')) {
        refetchPromises.push(
          masterService.getPriorities().then(data => {
            console.log('Refetched Priority options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexPriority: data }));
          })
        );
      }
      
      if (missingOptions.includes('Product')) {
        refetchPromises.push(
          masterService.getProducts().then(data => {
            console.log('Refetched Product options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexProduct: data }));
          })
        );
      }
      
      if (missingOptions.includes('TaskType')) {
        refetchPromises.push(
          masterService.getTaskTypes().then(data => {
            console.log('Refetched TaskType options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexTaskType: data }));
          })
        );
      }
      
      if (missingOptions.includes('Member')) {
        refetchPromises.push(
          workspaceService.getWorkspaceMembers().then(data => {
            console.log('Refetched Member options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexMember: data }));
          })
        );
      }
      
      if (missingOptions.includes('Team')) {
        refetchPromises.push(
          masterService.getTeams().then(data => {
            console.log('Refetched Team options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexTeam: data }));
          })
        );
      }
      
      if (missingOptions.includes('Folder')) {
        refetchPromises.push(
          masterService.getFolders().then(data => {
            console.log('Refetched Folder options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexFolder: data }));
          })
        );
      }
      
      if (missingOptions.includes('List')) {
        refetchPromises.push(
          masterService.getList().then(data => {
            console.log('Refetched List options:', data?.length || 0);
            setRefetchedOptions(prev => ({ ...prev, indexList: data }));
          })
        );
      }
      
      await Promise.all(refetchPromises);
      console.log('Successfully refetched missing options');
      
    } catch (error) {
      console.error('Error refetching missing options:', error);
    } finally {
      setIsRefetchingOptions(false);
    }
  };

  const editorRef = useRef(null)
  const initTimeoutRef = useRef(null)

  // Pisahkan useEffect untuk modal visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setEditorReady(false)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      setEditorReady(false)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Pisahkan useEffect untuk editor initialization
  useEffect(() => {
    async function initEditor() {
      const editorElement = document.getElementById(editorJsId)

      if (!editorElement) {
        console.error(`EditorJS element with ID "${editorJsId}" is missing`)
        return
      }

      console.log(`Initializing EditorJS with ID: ${editorJsId}`)

      // Destroy existing editor jika ada
      if (editorRef.current) {
        try {
          await editorRef.current.destroy()
          editorRef.current = null
        } catch (error) {
          console.error('Error destroying previous editor:', error)
        }
      }

      try {
        const EditorJSModule = (await import('@editorjs/editorjs')).default
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
          import('@editorjs/header').then((m) => m.default),
          import('@editorjs/list').then((m) => m.default),
          import('@editorjs/table').then((m) => m.default),
          import('@editorjs/quote').then((m) => m.default),
          import('@editorjs/embed').then((m) => m.default),
          import('@editorjs/simple-image').then((m) => m.default),
          import('@editorjs/marker').then((m) => m.default),
          import('@editorjs/inline-code').then((m) => m.default),
          import('editorjs-text-color-plugin').then((m) => m.default),
          import('@editorjs/text-variant-tune').then((m) => m.default),
          import('@editorjs/checklist').then((m) => m.default),
        ])

        const editor = new EditorJSModule({
          holder: editorJsId,
          placeholder: 'Write something...',
          onChange: async (api, event) => {
            try {
              const outputData = await api.saver.save()
              setValue('description', JSON.stringify(outputData))
            } catch (error) {
              console.error('Error saving editor data:', error)
            }
          },
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4],
                defaultLevel: 1,
              },
              tunes: ['textVariantTune'],
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
            marker: { class: Marker, shortcut: 'CMD+SHIFT+M' },
            inlineCode: { class: InlineCode, shortcut: 'CMD+SHIFT+C' },
            textVariantTune: {
              class: TextVariantTune,
              config: {
                types: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'],
              },
            },
          },
        })

        editorRef.current = editor
        setEditorReady(true)
        console.log(`EditorJS initialized successfully with ID: ${editorJsId}`)
      } catch (error) {
        console.error('Error initializing editor:', error)
      }
    }

    if (isVisible && !editorReady) {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }

      initTimeoutRef.current = setTimeout(() => {
        initEditor()
      }, 500)
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [isVisible, editorReady, editorJsId, setValue])

  // Cleanup saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      const cleanup = async () => {
        if (editorRef.current) {
          try {
            await editorRef.current.destroy()
            editorRef.current = null
            console.log(`EditorJS destroyed for ID: ${editorJsId}`)
          } catch (error) {
            console.error('Error destroying editor:', error)
          }
        }
        reset()
      }

      cleanup()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, editorJsId, reset])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const getBorderColor = (originalName) => {
    const key = nameMapRef.current[originalName] || originalName
    return errors[key] ? 'border-red-500' : 'border-gray-300'
  }

  if (!isVisible) return null

  const onError = (errors) => {
    console.log('Form validation errors:', errors)
  }

  const onSubmit = async (values) => {
    console.log('Task successfully created: ', values)
    const descriptionData = editorRef.current ? await editorRef.current.save() : {}

    // Transform custom fields for API - convert to array of {id, value} objects
    const transformedCustomFields = []
    if (values.customFields && customFields.length > 0) {
      Object.entries(values.customFields).forEach(([sanitizedName, rawValue]) => {
        // Find original name from nameMapRef
        const originalName = Object.keys(nameMapRef.current).find(
          key => nameMapRef.current[key] === sanitizedName
        ) || sanitizedName
        
        // Find the field definition to get the ID and type
        const fieldDef = customFields.find(f => f.field_name === originalName)
        if (!fieldDef) return
        
        let value = rawValue
        
        // Transform value based on field type
        switch (fieldDef.field_type) {
          case 'text':
          case 'text-area':
          case 'radio':
            value = rawValue ?? ''
            break
          case 'single-select':
            value = rawValue?.id_record ?? rawValue?.name ?? rawValue ?? ''
            break
          case 'multiple-select':
            value = Array.isArray(rawValue) ? rawValue : []
            break
          case 'checkbox':
            value = Array.isArray(rawValue) ? rawValue : []
            break
          case 'number':
            value = rawValue === '' || rawValue === undefined ? null : Number(rawValue)
            break
          default:
            value = rawValue ?? ''
        }
        
        transformedCustomFields.push({
          id: fieldDef.id_field,
          value
        })
      })
    }

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
      custom_fields: transformedCustomFields,
    }

    const params = new URLSearchParams(window.location.search)
    const workspaceId = params.get('workspace_id')
    const page = params.get('page')
    const paramId = params.get('param_id')

    fetch(`${baseUrl}/task/create?workspace_id=${workspaceId}&page=${page}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create task.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to create task.')
        }
        console.log('Task created successfully:', data)
      })
      .catch((error) => {
        console.error('Error creating task:', error)
      })

    await fetch(
      `${baseUrl}/utils/task-initial-values?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch task types.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to task types.')
        }
        const initialValues = data.data
        setTeam(initialValues.team_id || null)
        setFolder(initialValues.folder_id || null)
        setLists(initialValues.list_ids || [])
      })
      .catch((error) => {
        console.error('Error fetching initial values:', error)
      })

    await fetchTasks()
    onClose()
  }

  // Render modal menggunakan Portal untuk menghindari style inheritance
  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/10 transition-opacity duration-300',
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
          maxWidth: 'calc(90vw - 36px)',
          maxHeight: 'calc(90vh - 36px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex flex-1 overflow-hidden relative"
        >
          {/* Warning message for missing dropdown options */}
          {(!effectiveSelectData.indexStatus || effectiveSelectData.indexStatus.length === 0 || 
            !effectiveSelectData.indexPriority || effectiveSelectData.indexPriority.length === 0 || 
            !effectiveSelectData.indexProduct || effectiveSelectData.indexProduct.length === 0 ||
            !effectiveSelectData.indexTaskType || effectiveSelectData.indexTaskType.length === 0 ||
            !effectiveSelectData.indexMember || effectiveSelectData.indexMember.length === 0 ||
            !effectiveSelectData.indexTeam || effectiveSelectData.indexTeam.length === 0 ||
            !effectiveSelectData.indexFolder || effectiveSelectData.indexFolder.length === 0 ||
            !effectiveSelectData.indexList || effectiveSelectData.indexList.length === 0) && (
            <div className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  {isRefetchingOptions ? (
                    <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    {isRefetchingOptions ? 'Loading dropdown options...' : 'Dropdown options loaded'}
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      {isRefetchingOptions 
                        ? 'We detected some missing dropdown options (Status, Priority, Product, Task Type, Assignees, Teams, Folders, or Lists) and are loading them now. Please wait a moment.'
                        : 'All dropdown options have been loaded successfully. You can now use all dropdowns normally.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4 mb-10">
            {/* Task Name and Task Type */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Task Name</label>
                <Controller
                  name="taskName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        className={`w-full ${getBorderColor('taskName')}`}
                        placeholder="Enter task name"
                      />
                      {errors.taskName && (
                        <p className="text-red-500 text-xs mt-1">{errors.taskName.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Task Type</label>
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

                          try {
                            const response = await fetch(
                              `${baseUrl}/task/custom-fields?task_type_id=${selectedTaskType.id}`
                            )
                            if (!response.ok) {
                              throw new Error('Failed to fetch custom fields.')
                            }
                            const data = await response.json()
                            console.log('Custom fields fetched successfully:', data)
                            setCustomFields(data.data || [])
                          } catch (error) {
                            console.error('Error fetching custom fields:', error)
                          }
                        }}
                        options={effectiveSelectData.indexTaskType}
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
            </div>

            {/* Priority and Status */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Priority</label>
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
                          })
                        }}
                        options={effectiveSelectData.indexPriority}
                        placeholder="Select priority"
                        className={getBorderColor('priority')}
                      />
                      {errors.priority && (
                        <p className="text-red-500 text-xs mt-1">Priority is required</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Status</label>
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
                          })
                        }}
                        options={effectiveSelectData.indexStatus}
                        placeholder="Select status"
                        className={getBorderColor('status')}
                      />
                      {errors.status && (
                        <p className="text-red-500 text-xs mt-1">Status is required</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignee</label>
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
                        })
                      }}
                      options={effectiveSelectData.indexMember}
                      placeholder="Add assignee"
                    />
                    {errors.assignee && (
                      <p className="text-red-500 text-xs mt-1">{errors.assignee.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Start Date & Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline (Double click in the same date)</label>
              <Controller
                name="selectedRange"
                control={control}
                render={({ field }) => (
                  <div>
                    <DateRangePicker
                      value={field.value}
                      onChange={(range) => field.onChange(range)}
                      placeholder="Select a deadline"
                      className={getBorderColor('selectedRange')}
                    />
                    {errors.selectedRange && (
                      <p className="text-red-500 text-xs mt-1">Deadline is required</p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Team and Product */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Product</label>
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
                          })
                        }}
                        options={effectiveSelectData.indexProduct}
                        placeholder="Select product"
                        className={getBorderColor('product')}
                      />
                      {errors.product && (
                        <p className="text-red-500 text-xs mt-1">Product is required</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Team</label>
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
                        options={effectiveSelectData.indexTeam}
                        placeholder="Select team"
                        className={getBorderColor('team')}
                      />
                      {errors.team && (
                        <p className="text-red-500 text-xs mt-1">Team is required</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Folder and Lists */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Folder</label>
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
                        options={effectiveSelectData.indexFolder}
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
                <label className="block text-sm font-medium text-gray-700">Lists</label>
                <Controller
                  name="lists"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <MultipleSelectTags
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        options={effectiveSelectData.indexList}
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

            {/* Custom Fields */}
            <CustomFields
              customFields={customFields}
              setCustomFieldValues={setCustomFieldValues}
              customFieldValues={customFieldValues}
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              nameMapRef={nameMapRef}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div
                    id={editorJsId}
                    className="border rounded p-2 text-left min-h-[200px]"
                    onBlur={async () => {
                      if (editorRef.current) {
                        try {
                          const outputData = await editorRef.current.save()
                          field.onChange(JSON.stringify(outputData))
                        } catch (error) {
                          console.error('Error saving editor data:', error)
                        }
                      }
                    }}
                  ></div>
                )}
              />
            </div>
            {/* Attachments */}
            <DynamicFileAttachments setAttachments={setAttachments} attachments={attachments} />
          </div>

          {/* Submit Button */}
          <div className="absolute bottom-4 right-4">
            <Button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
              ADD
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  // Render dengan Portal agar tidak terpengaruh style parent
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null
}