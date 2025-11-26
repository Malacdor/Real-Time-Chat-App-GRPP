const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000

// Start the HTTP server instance
// Note: Socket.io will attach to this server, so it must be created separately
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))


// Initialize Socket.io using the existing HTTP server
// This below enables the real time communication with users
const io = require('socket.io')(server)

// Serve static assets (HTML, CSS, JS) from the /public directory
// Important! This lets the front end to interact with the WebSocket backend stuff
app.use(express.static(path.join(__dirname, 'public')))
let socketsConected = new Set()
io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}
