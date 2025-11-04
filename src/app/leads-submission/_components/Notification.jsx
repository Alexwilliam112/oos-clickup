export default function Notification({ notification, hideNotification }) {
  return (
    notification && (
      <div className={`notification ${notification.type}`}>
        <div className="notification-content">
          <div className="notification-icon">
            {notification.type === "success" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16.25 5L7.5 13.75L3.75 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div className="notification-message">{notification.message}</div>
          <button
            className="notification-close"
            onClick={hideNotification}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  );
}
