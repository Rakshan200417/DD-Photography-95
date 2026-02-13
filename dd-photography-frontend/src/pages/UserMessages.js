import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function UserMessages({ userEmail }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages between this user and admin
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/user/${userEmail}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage) return;
    try {
      await axios.post("http://localhost:8080/api/messages", {
        userName: userEmail,
        email: userEmail,
        content: newMessage,
        sender: "user",
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Messages with Admin</h2>
      <div className="card shadow" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
          {messages.length === 0 && <p className="text-center text-muted">No messages yet.</p>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex mb-2 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <span className={`badge ${msg.sender === "user" ? "bg-success" : "bg-primary"} p-2`}>
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="card-footer d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-success" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
