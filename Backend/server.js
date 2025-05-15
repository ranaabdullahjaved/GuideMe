const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const courseRoutes = require('./routes/courseRoutes');
const Admin = require('./models/Admin');
const ChatMessage = require('./models/ChatMessage');
const Conversation = require('./models/Conversation');
const webinarRoutes = require('./routes/webinarRoutes');
const projectRoutes = require('./routes/projectRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const adminRoutes = require('./routes/adminRoutes')
const Mentor=require('./models/Mentor');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    seedAdmin();
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// Seed default admin
async function seedAdmin() {
  try {
    const adminExists = await Admin.findOne({});
    if (!adminExists) {
      const defaultAdmin = {
        name: "Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("adminpassword", 10),
      };
      await Admin.create(defaultAdmin);
      console.log('Default admin created.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

// // Auth Routes
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/profile/password', passwordRoutes);
app.use('/api/webinars', webinarRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/admin', adminRoutes);

/* ===== Chat Endpoints ===== */
// In server.js, replace your GET /api/chat/conversations endpoint with:

app.get('/api/chat/conversations', async (req, res) => {
  const { role, userId } = req.query;
  try {
    let conversations;
    if (role === 'mentee') {
      // For mentee, populate mentor details (only name, avatar, and skill)
      conversations = await Conversation.find({ menteeId: userId })
        .populate("mentorId", "name avatar skill")
        .sort({ createdAt: -1 });
    } else if (role === 'mentor') {
      // For mentor, populate mentee details (only name, avatar, and skill)
      conversations = await Conversation.find({ mentorId: userId })
        .populate("menteeId", "name avatar skill")
        .sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/chat/conversations', async (req, res) => {
  const { menteeId, mentorId } = req.body;
  console.log(menteeId,mentorId);

  try {
    console.log("Creating conversation with menteeId:", menteeId, "mentorId:", mentorId);

    let actualMentorId = mentorId;

    // Check if mentorId is in email format
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (emailRegex.test(mentorId)) {
      // MentorId is an email, find the corresponding mentor's ID
      const mentor = await Mentor.findOne({ email: mentorId });
      if (!mentor) {
        return res.status(404).json({ message: "Mentor with this email not found" });
      }
      actualMentorId = mentor._id;
    }

    // Proceed with the conversation logic using the actualMentorId
    let conversation = await Conversation.findOne({ menteeId, mentorId: actualMentorId });
    if (!conversation) {
      conversation = new Conversation({ menteeId, mentorId: actualMentorId });
      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (err) {
    console.error("Conversation creation error:", err);
    res.status(500).json({ message: err.message });
  }
});
app.get('/api/chat/messages/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await ChatMessage.find({ conversationId }).sort({ time: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===== Socket.IO for Real-Time Chat ===== */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on('connection', (socket) => {
  console.log("User connected: " + socket.id);
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });
  socket.on("chatMessage", async (msg) => {
    try {
      const newMsg = new ChatMessage({
        conversationId: msg.conversationId,
        senderRole: msg.senderRole,
        senderName: msg.senderName,
        text: msg.text
      });
      await newMsg.save();
      io.to(msg.conversationId).emit("chatMessage", newMsg);
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Verify environment variables
console.log('Environment variables check:');
console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Not set');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not set');

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
