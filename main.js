const socket = io();

// 🔊 NEW: load sounds for send / receive
const sendSound = new Audio('sounds/send.mp3');
const receiveSound = new Audio('sounds/receive.mp3');

// DOM elements
const clientsTotal = document.getElementById('clients-total');
const messageForm = document.getElementById('message-form');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
const messagesList = document.getElementById('messages');
const feedback = document.getElementById('feedback');

let typingTimeout;

// Update clients online
socket.on('clients-total', number => {
  clientsTotal.textContent = number;
});

// Receive message from others
socket.on('chat-message', data => {
  // 🔊 NEW: play receive sound
  try {
    receiveSound.currentTime = 0;
    receiveSound.play();
  } catch (e) {
    // Ignore play errors (browser blocking, etc.)
  }

  addMessageToUI(false, data);
});

// Typing feedback
socket.on('feedback', data => {
  if (!data || !data.name) {
    feedback.textContent = '';
    return;
  }
  feedback.textContent = `${data.name} is typing...`;

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    feedback.textContent = '';
  }, 1200);
});

// Send new message
messageForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    return;
  }

  const now = new Date();

  const data = {
    name,
    message,
    // 🔁 UPDATED: store full ISO timestamp instead of just local time
    dateTime: now.toISOString()
  };

  // Show in my own UI
  addMessageToUI(true, data);

  // 🔊 NEW: play send sound
  try {
    sendSound.currentTime = 0;
    sendSound.play();
  } catch (e) {
    // Ignore play errors
  }

  // Send to others
  socket.emit('message', data);

  messageInput.value = '';
  messageInput.focus();
});

// Emit typing feedback
messageInput.addEventListener('input', () => {
  const name = nameInput.value.trim() || 'Someone';
  socket.emit('feedback', { name });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('feedback', {});
  }, 1000);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();

  const row = document.createElement('li');
  row.classList.add('message-row');
  row.classList.add(isOwnMessage ? 'me' : 'other');

  const messageEl = document.createElement('div');
  messageEl.classList.add('message');
  messageEl.classList.add(isOwnMessage ? 'me' : 'other');

  const header = document.createElement('div');
  header.classList.add('message-header');

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('message-name');
  nameSpan.textContent = data.name || 'Anonymous';

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('message-time');

  // ⏰ NEW: nicer time formatting + full timestamp on hover
  if (data.dateTime) {
    const dateObj = new Date(data.dateTime);
    const timeText = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    timeSpan.textContent = timeText;
    // Full date/time when you hover the time
    timeSpan.title = dateObj.toLocaleString();
  } else {
    timeSpan.textContent = '';
  }

  header.appendChild(nameSpan);
  header.appendChild(timeSpan);

  const text = document.createElement('div');
  text.classList.add('message-text');
  text.textContent = data.message;

  messageEl.appendChild(header);
  messageEl.appendChild(text);

  row.appendChild(messageEl);
  messagesList.appendChild(row);

  // Auto-scroll
  messagesList.scrollTop = messagesList.scrollHeight;
}

function clearFeedback() {
  feedback.textContent = '';
}
