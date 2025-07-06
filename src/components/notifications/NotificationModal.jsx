'use client'

import { useState } from 'react'
import { notificationService } from '@/service/index.mjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DetailModalTrigger } from '../ui-modal/modal-trigger'
import { useTaskStore } from '@/store/task/task'
import { TaskDetailModalV2 } from '../ui-modal/detailTask'


export default function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDetail, setIsOpenDetail] = useState(false)
  const queryClient = useQueryClient()

  const {
    setSelectedTask,
    setInitialValues,
    setSelectData,
    tasks,
    initialValues,
    selectData,
    fetchTasks
  } = useTaskStore()
  console.log(useTaskStore.getState().selectedTask, ">>>>")
  const [notifications, setNotifications] = useState([])

  const { isLoading } = useQuery({
    queryFn: () =>
      notificationService.getAll().then((data) => {
        setNotifications(data?.data || [])
        return data
      }),
    queryKey: ['notificationService.getAll', { isOpen }],
  })

  // ✅ Mark as read (1 or all)
  const markAsReadMutation = useMutation({
    mutationFn: ({ id }) => {
      const payload = id
        ? { notif_id: id, is_read: true }
        : { notif_id: 'all', is_read: true }
      return notificationService.postRead({ payload })
    },
    onSuccess: (_data, variables) => {
      const { id } = variables
      setNotifications((prev) =>
        prev.map((notif) =>
          id
            ? notif.id === id ? { ...notif, is_read: true } : notif
            : { ...notif, is_read: true }
        )
      )
      queryClient.invalidateQueries(['notificationService.getAll'])
    },
  })

  const markAsRead = (id) => {
    markAsReadMutation.mutate({ id })
  }

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id)

    if (notif.task_id) {
      const fullTask = tasks.find((t) => t.id_task === notif.task_id?.id)
      setSelectedTask(fullTask)
      setIsOpenDetail(true)
    }
  }

  return (
    <>
      {/* Button */}
      <span
        onClick={() => setIsOpen(true)}
        className="flex items-center hover:text-blue-500 hover:cursor-pointer"
      >
        <span className="text-sm">
          Notifications
          {notifications.filter((n) => !n.is_read).length > 0 && (
            <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.filter((n) => !n.is_read).length}
            </span>
          )}
        </span>
      </span>

      {/* Notification Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              >
                ✖
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications.</p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-y-scroll pr-2 scrollbar">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex gap-3 items-start border px-4 py-3 rounded-lg transition duration-200 hover:bg-gray-50 cursor-pointer ${!notif.is_read ? 'bg-gray-100' : 'bg-white'
                      }`}
                  >
                    <div className="mt-0.5">
                      {notif.notif_type === 'TASK ASSIGNED' ? (
                        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                        </svg>
                      ) : notif.notif_type === 'NEW COMMENT' ? (
                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-5-5H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7a2 2 0 01-2 2h-3l-5 5z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-800">{notif.content}</p>
                        {!notif.is_read && (
                          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full ml-2">NEW</span>
                        )}
                      </div>
                      {notif.task_id?.name && (
                        <p className="text-xs text-gray-500 mt-1">{notif.task_id.name}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 text-right">
              <button
                onClick={() => markAsRead()}
                className="text-sm text-blue-600 hover:underline hover:cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {useTaskStore.getState().selectedTask && (
        <TaskDetailModalV2
          fetchTasks={useTaskStore.getState().fetchTasks}
          isOpen={isOpenDetail}
          setIsOpen={setIsOpenDetail}
          onClose={() => setIsOpenDetail(false)}
          title={"Task Details"}
          subtitle={useTaskStore.getState().selectedTask?.created_at}
          showSidebar={true}
          sidebarContent={''}
          selectData={selectData}
          initialValues={initialValues}
          task={useTaskStore.getState().selectedTask}
          tasks={tasks}
        >
        </TaskDetailModalV2>
      )}
    </>
  )
}
