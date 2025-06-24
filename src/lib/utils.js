import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function generateChildren(input) {
  const map = new Map()
  const result = []

  // First pass: Add all tasks to the map
  input.forEach((item) => {
    const { id_task } = item
    const newItem = { ...item, children: [] }
    map.set(id_task, newItem)
  })

  // Second pass: Establish parent-child relationships
  input.forEach((item) => {
    const { id_task, parent_task_id } = item
    const currentItem = map.get(id_task)

    if (parent_task_id === '0') {
      result.push(currentItem) // Add to top level if parent_task_id is "0"
    } else {
      const parent = map.get(parent_task_id)
      if (parent) {
        parent.children.push(currentItem) // Add as a child if parent exists
      } else {
        result.push(currentItem) // Add to top level if parent is not found
      }
    }
  })

  console.log(result)
  return result
}
