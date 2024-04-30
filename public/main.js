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
  socket.emit('message' , data);
  addMessageToUI( true , data);
  messageInput.value = '';
};

socket.on('chat-message' , (data)  => {
  // console.log(data);
  addMessageToUI( false , data);
});

function  addMessageToUI( isOwnMessage, data) {
  const element = `
        <li class="${ isOwnMessage ? "message-right" : "message-left" }">
        <p class="message">
          ${data.message}
          <span> ${data.name} 🔘 ${moment(data.timeStamp).fromNow()}</span>
        </p>
      </li>
      `

  messageContainer.innerHTML += element;
}



