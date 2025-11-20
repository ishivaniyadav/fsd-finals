const socket = io();
let currentUser = null;
let currentChatUser = null;

// Fetch logged in user
fetch("/api/me").then(r => r.json()).then(data => {
  if (!data.user) {
    window.location.href = "/login.html";
  } else {
    currentUser = data.user;
    socket.emit("setup", currentUser.id);
    loadUsers();
  }
});

// Load all users
function loadUsers() {
  fetch("/api/users").then(r => r.json()).then(data => {
    const list = document.getElementById("userList");
    list.innerHTML = "";
    data.users.forEach(u => {
      if (u.id !== currentUser.id) {
        const div = document.createElement("div");
        div.className = "user";
        div.innerHTML = `
          <div class="status-dot ${u.online ? "online" : "offline"}"></div>
          <div class="details">
            <div class="name">${u.emoji || "👤"} ${u.displayName}</div>
            <div class="last-msg">Last seen: ${u.online ? "Online" : new Date(u.lastSeen || "").toLocaleString()}</div>
          </div>`;
        div.onclick = () => openChat(u);
        list.appendChild(div);
      }
    });
  });
}

function openChat(user) {
  currentChatUser = user;
  document.getElementById("chatUserName").innerText = `${user.emoji || "👤"} ${user.displayName}`;
  document.getElementById("chatStatus").innerText = user.online ? "Online" : "Last seen " + (user.lastSeen ? new Date(user.lastSeen).toLocaleString() : "recently")
  fetch(`/api/messages/${user.id}`).then(r => r.json()).then(data => {
    const chat = document.getElementById("chatMessages");
    chat.innerHTML = "";
    data.messages.forEach(m => renderMessage(m));
  });
}

function renderMessage(m) {
  const div = document.createElement("div");
  div.className = "message " + (m.from === currentUser.id ? "from-me" : "from-them");
  div.innerText = m.text;
  document.getElementById("chatMessages").appendChild(div);
}

// Send message
document.getElementById("sendBtn").onclick = () => {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !currentChatUser) return;
  socket.emit("send_message", { to: currentChatUser.id, text });
  input.value = "";
  socket.emit("stop_typing", { to: currentChatUser.id });
};

document.getElementById("messageInput").addEventListener("input", () => {
  if (currentChatUser) socket.emit("typing", { to: currentChatUser.id });
  setTimeout(() => {
    if (currentChatUser) socket.emit("stop_typing", { to: currentChatUser.id });
  }, 1500);
});

// Listen for incoming messages
socket.on("new_message", (m) => {
  if ((m.from === currentChatUser?.id) || (m.to === currentChatUser?.id)) {
    renderMessage(m);
  }
});

// Typing indicator
socket.on("typing", ({ from }) => {
  if (from === currentChatUser?.id) {
    document.getElementById("typingIndicator").innerText = `${currentChatUser.displayName} is typing...`;
  }
});
socket.on("stop_typing", ({ from }) => {
  if (from === currentChatUser?.id) {
    document.getElementById("typingIndicator").innerText = "";
  }
});

// User status updates
socket.on("user_status", ({ userId, online, lastSeen }) => {
  loadUsers();
  if (currentChatUser && currentChatUser.id === userId) {
    document.getElementById("chatStatus").innerText = online ? "Online" : "Last seen " + new Date(lastSeen).toLocaleString();
  }
});

// Switch account
document.getElementById("switchAccount").onclick = () => {
  fetch("/api/logout", { method: "POST" }).then(() => {
    
    window.location.href = "/login.html";
  });
};
 