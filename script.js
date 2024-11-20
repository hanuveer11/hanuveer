const socket = io();
let currentRoom = null;

// DOM Elements
const roomInput = document.getElementById('room-input');
const createRoomBtn = document.getElementById('create-room');
const joinRoomBtn = document.getElementById('join-room');
const chatWindow = document.getElementById('chat-window');
const messages = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

// Handle room creation
createRoomBtn.addEventListener('click', () => {
    const room = roomInput.value.trim();
    if (room) {
        joinRoom(room);
        alert(`Room created successfully! Your room code is: ${room}`);
    } else {
        alert('Please enter a valid room code!');
    }
});

// Handle room joining
joinRoomBtn.addEventListener('click', () => {
    const room = roomInput.value.trim();
    if (room) {
        joinRoom(room);
    } else {
        alert('Please enter a valid room code!');
    }
});

// Join a room
function joinRoom(room) {
    currentRoom = room;
    socket.emit('join room', room, (response) => {
        if (response.success) {
            roomInput.value = '';
            document.getElementById('room-selection').style.display = 'none';
            chatWindow.style.display = 'block';
        } else {
            alert(`Room "${room}" is unavailable. Please try another code.`);
        }
    });
}

// Handle message form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && currentRoom) {
        socket.emit('chat message', { room: currentRoom, message });
        addMessage(message, 'sent');
        messageInput.value = '';
    }
});

// Listen for incoming messages
socket.on('chat message', ({ id, text }) => {
    const messageType = id === socket.id ? 'sent' : 'received';
    addMessage(text, messageType);
});

// Add a message to the chat
function addMessage(msg, type) {
    const li = document.createElement('li');
    li.textContent = msg;
    li.className = `message ${type}`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight; // Auto-scroll
}
