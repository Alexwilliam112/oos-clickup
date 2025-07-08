'use client'

import React, { useState } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { FormDetailModalTrigger } from '../ui-modal/Forms/formModalTrigger'
import { cn } from '@/lib/utils'
import { getContrastColor } from '../utils/getContrastColor'


export default function Form({
  form,
  fetchForms,
  setForms,
  selectData,
  forms,
  level = 0,
}) {
  const [isOpenDetail, setIsOpenDetail] = useState(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const rowBg = level % 2 === 1 ? 'bg-muted/50' : ''

  return (
    <TableRow className={cn(rowBg)}>
      <TableCell
        className="p-2 min-w-[255px]"
        style={{ backgroundColor: rowBg }}
      >
        <FormDetailModalTrigger
          trigger={<span className="text-blue-500 hover:underline">{form.form_name}</span>}
          modalTitle="Form Details"
          fetchForms={fetchForms}
          form={form}
          forms={forms}
          setForms={setForms}
          selectData={selectData}
          modalSubtitle={form.created_at}
          isOpen={isOpenDetail}
          setIsOpen={setIsOpenDetail}
        >
          <p>Modal content here</p>
        </FormDetailModalTrigger>
      </TableCell>

      <TableCell className="p-2 min-w-[120px]">{formatDate(form.created_at)}</TableCell>

      <TableCell className="p-2 min-w-[160px] flex gap-1 flex-wrap">
        {form.list_ids?.map((list, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 border border-muted-foreground/20 rounded-sm"
            style={{
              backgroundColor: '#B1D9FF',
              color: getContrastColor('#B1D9FF'),
            }}
          >
            {list.name}
          </span>
        ))}
      </TableCell>

      <TableCell className="p-2 min-w-[120px]">
        <span
          className="text-xs px-2 py-1 border border-muted-foreground/20 rounded-sm"
          style={{
            backgroundColor: form.task_type_id.color,
            color: getContrastColor(form.task_type_id.color),
          }}
        >
          {form.task_type_id.name}
        </span>
      </TableCell>

      <TableCell className="p-2 min-w-[190px]">
        <span
          className="text-xs px-2 py-1.5 border border-muted-foreground/20 rounded-sm text-nowrap"
          style={{
            backgroundColor: '#B1D9FF',
            color: getContrastColor('#B1D9FF'),
          }}
        >
          {form.team_id.name.toUpperCase()}
        </span>
      </TableCell>

      <TableCell className="p-2 min-w-[100px] flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
