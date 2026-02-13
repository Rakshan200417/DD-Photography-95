import { useState, useEffect } from "react";
import axios from "axios";

export default function UserMessageIcon({ userEmail, onClick }) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread messages count
  const fetchUnread = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/unread/${userEmail}`);
      setUnreadCount(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userEmail) return;
    fetchUnread();

    const interval = setInterval(fetchUnread, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [userEmail]);

  if (!userEmail) return null; // hide if user not logged in

  return (
    <div className="user-message-icon" onClick={onClick}>
      <button className="btn btn-primary position-relative" style={{ borderRadius: "50%", padding: "15px" }}>
        💬
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {unreadCount}
          </span>
        )}
      </button>

      <style>
        {`
          /* Blinking effect for unread badge */
          .badge {
            animation: blinker 1s linear infinite;
          }
          @keyframes blinker {
            50% { opacity: 0; }
          }

          /* Icon position for desktop: bottom right */
          .user-message-icon {
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            z-index: 1000;
          }

          /* Icon position for mobile: top right */
          @media (max-width: 768px) {
            .user-message-icon {
              top: 20px;
              bottom: auto;
              right: 20px;
            }
          }
        `}
      </style>
    </div>
  );
}
