import http from "http";
import { Server } from "socket.io";

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }, // allow local dev
});

// When a client connects
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // --- JOIN ROOM ---
  socket.on("join", ({ room }) => {
    if (room) {
      socket.join(room);
      console.log(`👥 ${socket.id} joined ${room}`);
    }
  });

  // --- NEW MESSAGE ---
  socket.on("message:new", ({ room, message }) => {
    if (room && message) {
      io.to(room).emit("message:created", { room, message });
      console.log("💬 Message sent to:", room);
    }
  });

  // --- TYPING INDICATOR ---
  socket.on("typing", ({ room }) => {
    if (room) {
      // Notify others only
      socket.to(room).emit(`typing:${room}`);
      // Stop typing indication after delay
      setTimeout(() => {
        socket.to(room).emit(`typingstop:${room}`);
      }, 1500);
    }
  });

  // --- REACTION ADDED ---
  socket.on("reaction:new", ({ messageId, emoji }) => {
    if (messageId && emoji) {
      io.emit("reaction:created", { messageId, emoji });
      console.log(`😄 Reaction added: ${emoji} on message ${messageId}`);
    }
  });

  // --- THREAD MESSAGE (Replies) ---
  socket.on("thread:new", ({ room, message }) => {
    if (room && message) {
      io.to(room).emit("thread:created", { room, message });
      console.log("🧵 Thread reply in:", room);
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () =>
  console.log(`✅ WebSocket server running on http://localhost:${PORT}`)
);
