'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { SingleSelectTag } from './ui/tag-input'
import { DateRangePicker } from './ui/dateRangePicker'
import DynamicFileAttachmentsForm from './ui/dynamicAttachmentForm'

export default function PublicFormPage() {
  const { formId } = useParams()
  const [form, setForm] = useState({})
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
  const router = useRouter()

  const getBorderColor = (fieldName) => (errors[fieldName] ? 'border-red-500' : 'border-gray-300')

  const fetchData = () => {
    setLoading(true)
    fetch(
      `${baseUrl}/form/get-form?form_id=${formId}`
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
        setForm(data.data)
        console.log(data.data)
      })
      .catch((error) => {
        console.error('Error fetching DATA:', error)
      })
      .finally(() => {
        setLoading(false); // Stop loading in all cases
      });
    console.log('SUCCESS FETCH DATA')
  }
  
  useEffect(() => {
      if (formId) {
          fetchData()
      }
  }, [formId])

  // Dynamically build schema AFTER form.form_field exists
  const formSchema = useMemo(() => {
    if (!form.form_field) return z.object({})
    const schemaFields = form.form_field.reduce((acc, field) => {
      switch (field.originalName) {
        case 'name':
          acc[field.originalName] = field.required
            ? z.string().min(1, 'Task name is required and cannot be empty')
            : z.string().optional();
          break;

        case 'priority':
          acc[field.originalName] = field.required
            ? z.object({
                id: z.string().min(1, 'Priority selection is required'),
                name: z.string().min(1, 'Priority name is required'),
                color: z.string().min(1, 'Priority color is required'),
              }, { required_error: 'Please select a priority level' })
            : z.object({
                id: z.string().optional(),
                name: z.string().optional(),
                color: z.string().optional(),
              }).optional();
          break;

        case 'status':
          acc[field.originalName] = field.required
            ? z.object({
                id: z.string().min(1, 'Status selection is required'),
                name: z.string().min(1, 'Status name is required'),
                color: z.string().min(1, 'Status color is required'),
              }, { required_error: 'Please select a task status' })
            : z.object({
                id: z.string().optional(),
                name: z.string().optional(),
                color: z.string().optional(),
              }).optional();
          break;

        case 'assignee':
          acc[field.originalName] = field.required
            ? z.object({
                id: z.string().min(1, 'Assignee selection is required'),
                name: z.string().min(1, 'Assignee name is required'),
              }, { required_error: 'Please assign this task to someone' })
            : z.object({
                id: z.string().optional(),
                name: z.string().optional(),
              }).optional();
          break;

        case 'product':
          acc[field.originalName] = field.required
            ? z.object({
                id: z.string().min(1, 'Product selection is required'),
                name: z.string().min(1, 'Product name is required'),
                color: z.string().min(1, 'Product color is required'),
              }, { required_error: 'Please select a product' })
            : z.object({
                id: z.string().optional(),
                name: z.string().optional(),
                color: z.string().optional(),
              }).optional();
          break;

        case 'description':
          acc[field.originalName] = field.required
            ? z.string().min(1, `${field.label} is required`)
            : z.string().optional();
          break;

        case 'date-range':
          acc[field.originalName] = field.required
            ? z.object({
                from: z.date({ required_error: 'Start date is required' }),
                to: z.date({ required_error: 'End date is required' }),
              }, { required_error: 'Please select a date range for this task' })
            : z.object({
                from: z.date().optional(),
                to: z.date().optional(),
              }).optional();
          break;
      }

      return acc;
    }, {});
    return z.object(schemaFields)
  }, [form.form_field])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: '',
      assignee: null,
      lists: [],
    },
  })

  const onSubmit = async (values) => {
    console.log('Form submitted:', values)
    
     const descriptionData = 'text'

    // Collect task data
    const taskData = {
      name: values.name,
      task_type_id: form.task_type_id,
      assignee_ids: values.assignee,
      date_start: new Date(values['date-range'].from).getTime(),
      date_end: new Date(values['date-range'].to).getTime(),
      folder_id: form.folder_id,
      priority_id: values.priority,
      status_id: values.status,
      list_ids: form.list_ids,
      product_id: values.product,
      team_id: form.team_id,
      description: descriptionData,
      attachments: attachments
    }

    reset()

    fetch(`${baseUrl}/task/create?workspace_id=${form.workspace_id}&page=list`, {
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

    // Redirect to page success
    router.push('/forms/submitted')
  }

  const onError = (errors) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-xl w-full border rounded-lg p-7 shadow-md bg-white">
        {loading ? (
            <Skeleton className="w-full h-full" />
          ) : !form.form_field ? (
            <div className="text-center text-gray-500 py-10">
              <h2 className="text-xl font-semibold">Form not found</h2>
              <p className="mt-2">The form you're looking for doesn't exist or has been deleted.</p>
            </div>
          ) : (
            <>
              {/* Title */}
              <h2 className="text-2xl font-bold text-purple-A600 mb-4">
                {form.form_name || 'Untitled Form'}
              </h2>

              {/* Description */}
              {form.description?.value && (
                <div
                  className="italic text-sm text-gray-600 mb-6"
                  dangerouslySetInnerHTML={{ __html: form.description.value }}
                />
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                {form.form_field && form.form_field.map((field_data) => (
                  <div key={field_data.id}>
                    <label className="block text-sm font-medium mb-1">
                      {field_data.label}
                      {field_data.required && <span className="text-red-500">*</span>}
                    </label>

                    {field_data.type === 'text' && (
                      <Controller
                        name={field_data.originalName}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              className={`w-full ${getBorderColor(field_data.originalName)}`}
                              placeholder={field_data.placeholder}
                              value={field.value ?? ''}
                            />
                            {errors[field_data.originalName] && (
                              <p className="text-red-500 text-xs mt-1">{errors[field_data.originalName].message}</p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'textarea' && (
                      <Controller
                        name={field_data.originalName}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <textarea
                              className={`w-full border rounded-md px-3 py-2 ${
                                errors[field_data.originalName]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder={field_data.placeholder}
                              value={field.value ?? ''}
                              {...field}
                            />
                            {errors[field_data.originalName] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[field_data.originalName].message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'select' && (
                      <>
                        {field_data.originalName === 'assignee' ? (
                          <Controller
                            name="assignee"
                            control={control}
                            render={({ field }) => (
                              <div>
                                <SingleSelectTag
                                  value={field.value}
                                  onChange={(value) => {
                                    console.log("SELECTED VALUE:", value)
                                    field.onChange({
                                      id: value.id,
                                      name: value.name
                                    })
                                  }}
                                  options={field_data.options}
                                  placeholder="Select assignee"
                                  className={getBorderColor('assignee')}
                                />
                                {errors.assignee && (
                                  <p className="text-red-500 text-xs mt-1">Assignee is required</p>
                                )}
                              </div>
                            )}
                          />
                        ) : (
                          <Controller
                            name={field_data.originalName}
                            control={control}
                            render={({ field }) => (
                              <div>
                                <SingleSelectTag
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange({
                                      id: value.id,
                                      name: value.name,
                                      color: value.color
                                    })
                                  }}
                                  options={field_data.options}
                                  placeholder={`Select ${field_data.originalName}`}
                                  className={getBorderColor(field_data.originalName)}
                                />
                                {errors[field_data.originalName] && (
                                  <p className="text-red-500 text-xs mt-1">{field_data.originalName} is required</p>
                                )}
                              </div>
                            )}
                          />
                        )}
                      </>
                    )}

                    {field_data.type === 'date-range' && (
                      <Controller
                        name={field_data.originalName}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <DateRangePicker
                              value={field.value}
                              onChange={(range) => field.onChange(range)}
                              placeholder="Select a date range"
                              className={getBorderColor('selectedRange')}
                            />
                            {errors[field_data.originalName] && (
                              <p className="text-red-500 text-xs mt-1">Date range is required</p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'file' && (
                      <DynamicFileAttachmentsForm setAttachments={setAttachments} attachments={attachments} />
                    )}

                    {errors[field_data.originalName] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field_data.originalName]?.message}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded"
                >
                  Submit
                </button>
              </form>
            </>
          )
        }
      </div>
    </div>
  )
}