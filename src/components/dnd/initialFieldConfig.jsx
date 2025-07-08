// src/config/fieldConfig.js
export const initialFieldConfig = [
  { id: 'taskName', label: 'Task Name', originalName: 'Task Name', type: 'text', placeholder: 'Enter task name' },
  { id: 'priority', label: 'Priority', originalName: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
  { id: 'assignee', label: 'Assignee', originalName: 'Assignee', type: 'select', options: ['User A', 'User B'] },
  { id: 'description', label: 'Description', originalName: 'Description', type: 'textarea', placeholder: 'Enter description' },
]
