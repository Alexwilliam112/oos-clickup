'use client'

import { lazy } from 'react'
import { ChevronRight } from 'lucide-react'
const EditorJS = lazy(() => import('@editorjs/editorjs'))

// Simple Sub-task Item Component
const SubTaskItem = ({ subTask, onSubTaskClick, level = 0 }) => {
  const getStatusColor = (status) => {
    if (!status || !status.color) return '#6B7280'
    return status.color
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={`${level > 0 ? 'ml-4 border-l-2 border-gray-200 pl-3' : ''}`}>
      <div
        onClick={() => onSubTaskClick(subTask)}
        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group"
      >
        {/* Status indicator */}
        <div
          className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: getStatusColor(subTask.status_id) }}
        />

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate block group-hover:text-blue-600 transition-colors">
                {subTask.name}
              </span>
              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                {subTask.assignee_ids && (
                  <span className="inline-flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-1">
                      <span className="text-white text-xs font-medium">
                        {subTask.assignee_ids.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    {subTask.assignee_ids.name}
                  </span>
                )}
                {subTask.date_end && (
                  <>
                    {subTask.assignee_ids && <span>•</span>}
                    <span className="inline-flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(subTask.date_end)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Arrow icon */}
            <ChevronRight
              size={16}
              className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
            />
          </div>
        </div>
      </div>

      {/* Render nested sub-tasks recursively */}
      {subTask.children && subTask.children.length > 0 && (
        <div className="mt-1 space-y-1">
          {subTask.children.map((childTask) => (
            <SubTaskItem
              key={childTask.id_task}
              subTask={childTask}
              onSubTaskClick={onSubTaskClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SubTaskItem
