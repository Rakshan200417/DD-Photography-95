import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch all users who have messages
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/messages/users");
      setUsers(res.data);
      if (!selectedUser && res.data.length > 0) {
        setSelectedUser(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch messages for selected user
  const fetchMessages = async (email) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/${email}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Send a message as admin
  const sendMessage = async () => {
    if (!newMessage || !selectedUser) return;

    try {
      await axios.post("http://localhost:8080/api/messages", {
        email: selectedUser,
        sender: "admin",
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages(selectedUser);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
      const interval = setInterval(() => fetchMessages(selectedUser), 3000); // polling
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Admin Messages</h2>
      <div className="row">
        {/* User list */}
        <div className="col-md-3 border-end">
          <ul className="list-group">
            {users.map((user) => (
              <li
                key={user}
                className={`list-group-item ${selectedUser === user ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat window */}
        <div className="col-md-9 d-flex flex-column">
          <div className="flex-grow-1 border p-3 mb-3" style={{ height: "400px", overflowY: "auto" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-2 text-${msg.sender === "admin" ? "end" : "start"}`}>
                <span className={`badge ${msg.sender === "admin" ? "bg-primary" : "bg-secondary"}`}>
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="btn btn-success" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
