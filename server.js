const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific room
    socket.on('join room', (room, callback) => {
        const roomExists = io.sockets.adapter.rooms.get(room);
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        callback({ success: true });
    });

    // Handle messages sent to a specific room
    socket.on('chat message', ({ room, message }) => {
        console.log(`Message in room ${room}: ${message}`);
        io.to(room).emit('chat message', { id: socket.id, text: message });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Chatroom running at http://localhost:${PORT}`);
});
