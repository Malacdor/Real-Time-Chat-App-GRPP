const socket = io();

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

  const data = {
    name,
    message,
    dateTime: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  // Show in my own UI
  addMessageToUI(true, data);

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
  timeSpan.textContent = data.dateTime || '';

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
