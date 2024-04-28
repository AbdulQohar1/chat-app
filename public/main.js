const socket = io();
const clientsTotal = document.getElementById('clients-total');

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
 
messageForm.addEventListener('submit' , (e) => {
  e.preventDefault();
  sendMessage();
})

socket.on('clients-total' , (data) => {
  clientsTotal.innerText = `Total Clients: ${data}`
});

function sendMessage() {
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    timeStamp: new Date()
  }
  console.log(messageInput.value);

  socket.emit('message' , data)
};

socket.on('chat-message' , (data)  => {
  console.log(data);
})



