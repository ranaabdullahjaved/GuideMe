import React, { useState } from "react";
import "../styles/ChatPage.css"; // Updated styling

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { text: newMessage, sender: "You" }]);
            setNewMessage(""); // Clear the input
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat with User2</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === "You" ? "you" : "mentor"}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatPage;
