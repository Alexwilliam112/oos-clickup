'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { SingleSelectTag } from './ui/tag-input'
import { DateRangePicker } from './ui/dateRangePicker'
import DynamicFileAttachmentsForm from './ui/dynamicAttachmentForm'
import { MultipleSelectTags } from './ui/tag-input'

export default function PublicFormPage() {
  const { formId } = useParams()
  const [form, setForm] = useState({})
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)
  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
  const router = useRouter()

  // Mapping originalName -> sanitizedName to avoid special character issues with RHF/Zod
  const nameMapRef = useRef({})

  const sanitizeFieldName = (name) => {
    const base = name.replace(/[^a-zA-Z0-9]/g, '_')
    return base.replace(/_+/g, '_').replace(/^_/, '').replace(/_$/, '').toLowerCase()
  }

  const getBorderColor = (originalName) => {
    const key = nameMapRef.current[originalName] || originalName
    return errors[key] ? 'border-red-500' : 'border-gray-300'
  }

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
        if (!data || data.error) {
          throw new Error(data?.message || 'Failed to fetch DATA.')
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
      if (formId && typeof formId === 'string' && formId !== 'submitted') {
          fetchData()
      }
  }, [formId])

  // Dynamically build schema AFTER form.form_field exists
  const formSchema = useMemo(() => {
  if (!form.form_field) return z.object({});

  const schemaFields = {};
  const localMap = {}
  const hasSpecialChars = (fieldName) => /[\[\]\/&\-()\s]/.test(fieldName)

  form.form_field.forEach((field, idx) => {
    const originalName = field.originalName
    let sanitized = sanitizeFieldName(originalName)
    // ensure uniqueness if collision
    if (Object.values(localMap).includes(sanitized)) {
      sanitized = `${sanitized}_${idx}`
    }
    localMap[originalName] = sanitized

    let fieldValidation;

    if (!field.is_custom_field) {
      switch (originalName) {
        case 'name':
          fieldValidation = z.string().min(1, 'Task name is required and cannot be empty');
          break;

        case 'priority':
        case 'status':
        case 'product':
          fieldValidation = z.object({
            id: z.string().min(1, `${field.label || name} id is required`),
            name: z.string().min(1, `${field.label || name} name is required`),
            color: z.string().min(1, `${field.label || name} color is required`),
          });
          break;

        case 'assignee':
          fieldValidation = z.object({
            id: z.string().min(1, 'Assignee selection is required'),
            name: z.string().min(1, 'Assignee name is required'),
          });
          break;

        case 'description':
          fieldValidation = z.string().min(1, `${field.label} is required`);
          break;

        case 'date-range':
          fieldValidation = z.object({
            from: z.date({ required_error: 'Start date is required' }),
            to: z.date({ required_error: 'End date is required' }),
          });
          break;

        default:
          fieldValidation = z.any();
      }
    } else {
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'radio':
          fieldValidation = z.string().min(1, `${field.label} is required`);
          break;

        case 'select':
          if (hasSpecialChars(originalName)) {
            fieldValidation = z.preprocess(
              (val) => {
                if (!val) return field.required ? undefined : null
                if (typeof val === 'object' && val !== null) {
                  if (val.id_record && val.name) return val
                  if (val.id && val.name) return { id_record: val.id, name: val.name }
                }
                return field.required ? undefined : null
              },
              field.required
                ? z.object({
                    id_record: z.string().min(1, `${field.label || originalName} is required`),
                    name: z.string().min(1, `${field.label || originalName} is required`),
                  })
                : z.any()
            )
          } else {
            fieldValidation = z.object({
              id_record: z.string().min(1, 'Single-Select id_record is required'),
              name: z.string().min(1, 'Single-Select name is required'),
            })
          }
          break;

        case 'number':
          fieldValidation = z.preprocess(
            (val) => (val === '' || val === undefined ? undefined : Number(val)),
            z.number({ invalid_type_error: `${field.label} is required` })
          );
          break;

        case 'multiple-select':
          fieldValidation = z.array(
            z.object({
              id: z.string().min(1, 'Multiple-Select id is required'),
              key: z.string().min(1, 'Multiple-Select key is required'),
              name: z.string().min(1, 'Multiple-Select name is required'),
            })
          );
          break;

        case 'checkbox':
          fieldValidation = z
            .array(z.string())
            .min(1, `${field.label} is required`);
          break;

        default:
          fieldValidation = z.any();
      }
    }

    schemaFields[localMap[originalName]] = field.required
      ? fieldValidation
      : fieldValidation.nullable().optional();
  });

  nameMapRef.current = localMap
  return z.object(schemaFields);
}, [form.form_field]);

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

    // Collect task data
    const taskData = {
      form_field: form.form_field,
      task_type_id: form.task_type_id,
      folder_id: form.folder_id,
      team_id: form.team_id,
      list_ids: form.list_ids,
      workspace_id: form.workspace_id,
      name: values.name,
      assignee_ids: values.assignee,
      date_start: new Date(values['date-range']?.from).getTime(),
      date_end: new Date(values['date-range']?.to).getTime(),
      priority_id: values.priority,
      status_id: values.status,
      product_id: values.product,
      description: values.description,
      attachments: attachments,
      custom_fields: []
    }

    if (Array.isArray(form.form_field)) {
      const customFieldsPayload = form.form_field
        .filter((field) => field.is_custom_field)
        .map((field) => {
          const rawValue = values[nameMapRef.current[field.originalName] || field.originalName];

          let value = rawValue;
          switch (field.type) {
            case 'text':
            case 'textarea':
            case 'radio':
              value = rawValue ?? '';
              break;
            case 'select':
              value = rawValue ?? {}; // force empty string if undefined
              break;
            case 'multiple-select':
              value = Array.isArray(rawValue) ? rawValue : [];
              break;
            case 'checkbox':
              value = Array.isArray(rawValue) ? rawValue : [];
              break;
            case 'number':
              value = rawValue === '' || rawValue === undefined ? null : Number(rawValue);
              break;
          }

          return {
            id: field.id,
            value,
          };
        });

      taskData.custom_fields = customFieldsPayload;
    }

    
    fetch(`${baseUrl}/task/create-by-form?workspace_id=${form.workspace_id}`, {
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
        if (!data || data.error) {
          throw new Error(data?.message || 'Failed create task.')
        }
        console.log('Task created successfully:', data)
      })
      .catch((error) => {
        console.error('Error creating task:', error)
      })

    // Redirect to page success
    reset()
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
                {form.form_field && form.form_field.map((field_data) => {
                  const fieldKey = nameMapRef.current[field_data.originalName] || field_data.originalName
                  return (
                  <div key={field_data.id}>
                    <label className="block text-sm font-medium mb-1">
                      {field_data.label}
                      {field_data.required && <span className="text-red-500">*</span>}
                    </label>

                    {field_data.type === 'text' && (
                      <Controller
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              className={`w-full ${getBorderColor(field_data.originalName)}`}
                              placeholder={field_data.placeholder}
                              value={field.value ?? ''}
                            />
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">{errors[fieldKey].message}</p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'textarea' && (
                      <Controller
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <textarea
                              className={`w-full border rounded-md px-3 py-2 ${
                                errors[fieldKey]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder={field_data.placeholder}
                              value={field.value ?? ''}
                              {...field}
                            />
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[fieldKey].message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'select' && field_data.is_custom_field && (
                      <Controller
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <SingleSelectTag
                              value={field.value || null} // Ensure the value is always null or a valid option
                              onChange={(value) => {console.log(field.value); field.onChange(value);}}
                              options={field_data.options.map((opt) => ({
                                id_record: opt.value,
                                name: opt.value,
                              }))}
                              placeholder={`Select ${field_data.originalName}`}
                              className={
                                errors[fieldKey]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }
                            />
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[fieldKey].message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'select' && !field_data.is_custom_field && (
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
                                      id: String(value.id),
                                      name: value.name
                                    })
                                  }}
                                  options={field_data.options}
                                  placeholder="Select assignee"
                                  className={getBorderColor('assignee')}
                                />
                                {errors.assignee && (
                                  <p className="text-red-500 text-xs mt-1">{errors[field_data.originalName].message}</p>
                                )}
                              </div>
                            )}
                          />
                        ) : (
                          <Controller
                            name={fieldKey}
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
                                {errors[fieldKey] && (
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
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <DateRangePicker
                              value={field.value}
                              onChange={(range) => field.onChange(range)}
                              placeholder="Select a deadline (Double click in the same date)"
                              className={getBorderColor('selectedRange')}
                            />
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">Deadline is required</p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'file' && (
                      <DynamicFileAttachmentsForm setAttachments={setAttachments} attachments={attachments} />
                    )}

                    {field_data.type === 'number' && (
                      <Controller
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <input
                              type="number"
                              className={`w-full border rounded-md px-3 py-2 ${
                                errors[fieldKey]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder={`Enter ${field_data.label}`}
                              value={field.value || ""} // Ensure the value is always a number or empty string
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === "" ? "" : Number(e.target.value)
                                )
                              }
                            />
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[fieldKey].message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'radio' && (
                      <Controller
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            {field_data.options.map((opt, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={opt.id}
                                  value={opt.value}
                                  checked={field.value === opt.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                    errors[fieldKey]
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
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[fieldKey].message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'checkbox' && (
                      <Controller
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-2">
                            {field_data.options.map((opt, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={opt.id}
                                  value={opt.value}
                                  checked={(field.value || []).includes(opt.value)} // Ensure the value is always an array
                                  onChange={(e) => {
                                    const prevValues = field.value || [];
                                    const updatedValues = e.target.checked
                                      ? [...prevValues, opt.value]
                                      : prevValues.filter((v) => v !== opt.value);
                                    field.onChange(updatedValues);
                                  }}
                                  className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                    errors[fieldKey]
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
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[fieldKey].message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    )}

                    {field_data.type === 'multiple-select' && (
                      <Controller
                        name={fieldKey}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <MultipleSelectTags
                              value={field.value || []} // Ensure the value is always an array
                              onChange={(value) => field.onChange(value)}
                              options={field_data.options.map((opt) => ({
                                key: opt.value,
                                id: opt.value,
                                name: opt.value,
                              }))}
                              placeholder={`Add ${field_data.label}`}
                              className={
                                errors[fieldKey]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }
                            />
                            {errors[fieldKey] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[fieldKey].message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    )}
                  </div>
                )})}

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