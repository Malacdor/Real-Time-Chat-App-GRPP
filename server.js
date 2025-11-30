const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let socketsConnected = new Set();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socketsConnected.add(socket.id);

  io.emit('clients-total', socketsConnected.size);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    socketsConnected.delete(socket.id);
    io.emit('clients-total', socketsConnected.size);
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-message', data);
  });
  
  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
