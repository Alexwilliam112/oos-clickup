"use client";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { SingleSelectTag, MultipleSelectTags } from "@/components/ui/tag-input";

export default function CustomFields({
  customFields = [],
  control,
  errors,
  setValue,
  currentValues = {},
}) {
  useEffect(() => {
    if (!currentValues) return;

    Object.entries(currentValues).forEach(([key, value]) => {
      setValue(`customFields.${key}`, value);
    });
  }, [currentValues, setValue]);

  // Renderer for each field type
  const renderField = (field) => {
    const { field_type, field_name, id_field, options, is_mandatory } = field;
    const fieldName = `customFields.${field_name}`;

    switch (field_type) {
      case "text":
        return (
          <div className="flex-1" key={id_field}>
            <label className="block text-sm font-medium pb-2">
              {field_name}
            </label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    type="text"
                    className={`w-full border rounded-md px-3 py-2 ${
                      field_name && errors.customFields?.[field_name]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={`Enter ${field_name.toLowerCase()}`}
                    value={field.value || ""} // Ensure the value is always a string
                    {...field}
                  />
                  {errors.customFields?.[field_name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customFields[field_name].message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      case "text-area":
        return (
          <div className="flex-1" key={id_field}>
            <label className="block text-sm font-medium pb-2">
              {field_name}
            </label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <div>
                  <textarea
                    className={`w-full border rounded-md px-3 py-2 ${
                      errors.customFields?.[field_name]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={`Enter ${field_name.toLowerCase()}`}
                    value={field.value || ""} // Ensure the value is always a string
                    {...field}
                  />
                  {errors.customFields?.[field_name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customFields[field_name].message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      case "number":
        return (
          <div className="flex-1" key={id_field}>
            <label className="block text-sm font-medium pb-2">
              {field_name}
            </label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <div>
                  <input
                    type="number"
                    className={`w-full border rounded-md px-3 py-2 ${
                      errors.customFields?.[field_name]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={`Enter ${field_name.toLowerCase()}`}
                    value={field.value || ""} // Ensure the value is always a number or empty string
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                  {errors.customFields?.[field_name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customFields[field_name].message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      case "single-select":
        return (
          <div className="flex-1" key={id_field}>
            <label className="block text-sm font-medium pb-2">
              {field_name}
            </label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <div>
                  <SingleSelectTag
                    value={field.value || null} // Ensure the value is always null or a valid option
                    onChange={(value) => field.onChange(value)}
                    options={options.map((opt) => ({
                      id_record: opt.value,
                      name: opt.value,
                    }))}
                    placeholder={`Select ${field_name.toLowerCase()}`}
                    className={
                      errors.customFields?.[field_name]
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                  />
                  {errors.customFields?.[field_name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customFields[field_name].message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      case "multiple-select":
        return (
          <div className="flex-1" key={id_field}>
            <label className="block text-sm font-medium pb-2">
              {field_name}
            </label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <div>
                  <MultipleSelectTags
                    value={field.value || []} // Ensure the value is always an array
                    onChange={(value) => field.onChange(value)}
                    options={options.map((opt) => ({
                      key: opt.value,
                      id: opt.value,
                      name: opt.value,
                    }))}
                    placeholder={`Add ${field_name.toLowerCase()}`}
                    className={
                      errors.customFields?.[field_name]
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                  />
                  {errors.customFields?.[field_name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customFields[field_name].message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex-1" key={id_field}>
            <label className="block text-sm font-medium pb-2">
              {field_name}
            </label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${id_field}-${idx}`}
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
                          errors.customFields?.[field_name]
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor={`${id_field}-${idx}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {opt.value}
                      </label>
                    </div>
                  ))}
                  {errors.customFields?.[field_name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customFields[field_name].message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      case "radio":
        return (
          <div className="flex-1" key={id_field}>
            <label className="block text-sm font-medium pb-2">
              {field_name}
            </label>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`${id_field}-${idx}`}
                        value={opt.value}
                        checked={field.value === opt.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${
                          errors.customFields?.[field_name]
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor={`${id_field}-${idx}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {opt.value}
                      </label>
                    </div>
                  ))}
                  {errors.customFields?.[field_name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customFields[field_name].message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {customFields.map((field) => renderField(field))}
    </div>
  );
}
