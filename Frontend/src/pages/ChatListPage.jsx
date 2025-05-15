// src/pages/ChatListPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ChatListPage.css';

const ChatListPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [conversations, setConversations] = useState([]);
    const [mentorResults, setMentorResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);

    // Load conversations and populate other participant info
    useEffect(() => {
        if (user && (user._id || user.id) && (user.role === 'mentee' || user.role === 'mentor')) {
            const userId = user._id || user.id;
            axios
                .get(`https://harmonious-creation-production.up.railway.app/api/chat/conversations?role=${user.role}&userId=${userId}`)
                .then(async (res) => {
                    // For each conversation, fetch its last message
                    const convs = await Promise.all(
                        res.data.map(async (conv) => {
                            try {
                                const msgRes = await axios.get(`https://harmonious-creation-production.up.railway.app/api/chat/messages/${conv._id}`);
                                const messages = msgRes.data;
                                conv.lastMessage = messages.length ? messages[messages.length - 1] : null;
                            } catch (error) {
                                console.error("Error fetching last message:", error);
                            }
                            return conv;
                        })
                    );
                    setConversations(convs);
                })
                .catch((err) => console.error("Error loading conversations:", err));
        }
    }, [user]);

    // For mentee: Automatic mentor search as user types
    useEffect(() => {
        if (typingTimeout) clearTimeout(typingTimeout);
        if (user.role === 'mentee' && searchTerm.trim().length > 0) {
            const newTimeout = setTimeout(async () => {
                try {
                    const res = await axios.get(`https://harmonious-creation-production.up.railway.app/api/auth/search?searchTerm=${searchTerm}`);

                    setMentorResults(res.data);
                    // console.log(res.data.length > 0);
                    // console.log(mentorResults.length>0);
                } catch (err) {
                    console.error("Error during search:", err);
                }
            }, 300);
            setTypingTimeout(newTimeout);
        } else {
            setMentorResults([]);
        }
        return () => {
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [searchTerm, user.role]);

    const startConversation = async (mentor) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const menteeId = currentUser._id || currentUser.id;
            const res = await axios.post('https://harmonious-creation-production.up.railway.app/api/chat/conversations', {
                menteeId,
                mentorId: mentor._id,
            });
            navigate(`/chat/${res.data._id}`);
        } catch (err) {
            console.error("Error starting conversation:", err);
        }
    };

    const openConversation = (conversationId) => {
        navigate(`/chat/${conversationId}`);
    };

    return (
        <div className="chat-list-page">
            <h2>Chats</h2>
            {user.role === 'mentee' && (
                <div className="mentor-search">
                    <input
                        type="text"
                        placeholder="Search mentors by name, skill, or education..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="mentor-results">
                        {mentorResults.length > 0 ? (

                            mentorResults.map((mentor) => (
                                <div key={mentor._id} className="mentor-result" onClick={() => startConversation(mentor)}>
                                    <img src={`https://harmonious-creation-production.up.railway.app/uploads/${mentor.avatar}`} alt="avatar" className="mentor-avatar" />
                                    <span>{mentor.name}</span>
                                    <span className="mentor-skill">{mentor.skill}</span>
                                </div>
                            ))
                        ) : (
                            searchTerm && <div>No mentors found.</div>
                        )}
                    </div>
                </div>
            )}

            <div className="conversation-list">
                {conversations.length > 0 ? (
                    conversations.map((conv) => {
                        // Determine the other participant's details:
                        const other = user.role === "mentee" ? conv.mentorId : conv.menteeId;
                        const lastMsg = conv.lastMessage;
                        return (
                            <div key={conv._id} className="conversation-item" onClick={() => openConversation(conv._id)}>
                                <img
                                    src={`https://harmonious-creation-production.up.railway.app/uploads/${other.avatar}`}
                                    alt="avatar"
                                    className="conversation-avatar"
                                />
                                <div className="conversation-details">
                                    <div className="conversation-header">
                                        <span className="conversation-name">{other.name}</span>
                                        {lastMsg && (
                                            <span className="conversation-timestamp">
                                                {new Date(lastMsg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="conversation-preview">
                                        {lastMsg ? lastMsg.text : "No messages yet..."}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div>No conversations yet.</div>
                )}
            </div>
        </div>
    );
};

export default ChatListPage;
