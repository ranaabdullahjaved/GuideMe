// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import '../styles/ChatPage.css';

const socket = io("http://localhost:5000");

const ChatPage = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!conversationId) {
            navigate("/chat");
        }
    }, [conversationId, navigate]);

    useEffect(() => {
        if (conversationId) {
            socket.emit("joinConversation", conversationId);
            axios.get(`http://localhost:5000/api/chat/messages/${conversationId}`)
                .then((res) => setMessages(res.data))
                .catch((err) => console.error(err));
            socket.on("chatMessage", (msg) => {
                if (msg.conversationId === conversationId) {
                    setMessages(prev => [...prev, msg]);
                }
            });
        }
        return () => {
            socket.off("chatMessage");
        };
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim() || !conversationId) return;
        const messageData = {
            conversationId,
            senderRole: user.role,
            senderName: user.name,
            text: newMessage,
        };
        socket.emit("chatMessage", messageData);
        setNewMessage("");
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Conversation</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderName === user.name ? "you" : "other"}`}>
                        <span className="message-sender">{msg.senderName}</span>
                        <span className="message-text">{msg.text}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatPage;
