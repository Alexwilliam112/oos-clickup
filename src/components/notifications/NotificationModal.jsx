'use client'
import { Bell } from 'lucide-react'
import { useState } from 'react'

export default function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false)

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your report has been submitted.', isRead: false },
    { id: 2, message: 'New comment on your post.', isRead: false },
    { id: 3, message: 'Server downtime scheduled at midnight.', isRead: false },
  ])

  // Mark all as read
  const markAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    )
  }

  return (
    <>
      {/* Trigger Button (custom from span) */}
      <span
        onClick={() => setIsOpen(true)}
        className="flex items-center hover:text-blue-500 hover:cursor-pointer"
      >
        {/* <Bell /> */}
        <span className="text-sm">Notifications
          {notifications.length > 0 && (
            <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </span>
      </span>
      {/* Modal */}
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
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex justify-between items-start border px-3 py-2 rounded-md hover:cursor-pointer ${
                      !notif?.isRead ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                        />
                      </svg>
                      <p className="text-sm text-gray-700">{notif.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 text-right flex justify-end">
              <button
                onClick={markAsRead}
                className="text-sm text-blue-600 hover:underline hover:cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
