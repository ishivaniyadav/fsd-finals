const express = require("express");
const http = require("http");
const path = require("path");
const session = require("express-session");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// --- In-memory data ---
let users = [];     // { id, username, password, displayName, emoji, online, lastSeen }
let messages = [];  // { from, to, text, createdAt }

const emojis = ["😀","😎","🦊","🐼","🐸","🐵","🐯","🐧","🐢","🐝","🐱","🐶","🦁","🐨"];

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
  secret: "local-secret",
  resave: false,
  saveUninitialized: false
});
app.use(sessionMiddleware);
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---
app.post("/api/register", (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });
  if (users.find(u => u.username === username)) return res.status(400).json({ error: "Username taken" });

  const user = { 
    id: Date.now().toString(),
    username,
    password,
    displayName: displayName || username,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    online: true,
    lastSeen: new Date()
  };
  users.push(user);
  req.session.userId = user.id;
  res.json({ ok: true, user });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  user.online = true;
  user.lastSeen = new Date();
  req.session.userId = user.id;
  res.json({ ok: true, user });
});

app.post("/api/logout", (req, res) => {
  if (req.session.userId) {
    const user = users.find(u => u.id === req.session.userId);
    if (user) {
      user.online = false;
      user.lastSeen = new Date();
      io.emit("user_status", { userId: user.id, online: false, lastSeen: user.lastSeen });
    }
  }
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get("/api/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = users.find(u => u.id === req.session.userId);
  res.json({ user });
});

app.get("/api/users", (req, res) => {
  res.json({ users });
});

app.get("/api/messages/:otherId", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  const me = req.session.userId;
  const otherId = req.params.otherId;
  const convo = messages.filter(
    m => (m.from === me && m.to === otherId) || (m.from === otherId && m.to === me)
  );
  res.json({ messages: convo });
});

// --- Socket.io ---
io.on("connection", (socket) => {
  socket.on("setup", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      user.online = true;
      user.lastSeen = new Date();
      io.emit("user_status", { userId, online: true });
    }
  });

  socket.on("send_message", (payload) => {
    const { to, text } = payload;
    const from = socket.userId;
    if (!from) return;
    const msg = { from, to, text, createdAt: new Date() };
    messages.push(msg);
    io.to(to).emit("new_message", msg);
    io.to(from).emit("new_message", msg);
  });

  socket.on("typing", ({ to }) => {
    io.to(to).emit("typing", { from: socket.userId });
  });

  socket.on("stop_typing", ({ to }) => {
    io.to(to).emit("stop_typing", { from: socket.userId });
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      const user = users.find(u => u.id === socket.userId);
      if (user) {
        user.online = false;
        user.lastSeen = new Date();
        io.emit("user_status", { userId: user.id, online: false, lastSeen: user.lastSeen });
      }
    }
  });
});
// fallback for SPA
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// start
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
