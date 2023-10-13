const token = localStorage.getItem('token')
const user = {name: 'arvind'}
// const socket = io('https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js');
const socket = io('http://localhost:3000')


document.getElementById('sendbutton').addEventListener('click', (e)=>{
    e.preventDefault();
    const messsageinput = document.getElementById('messageinput');
    displayMessage("you", messsageinput.value);
    messsageinput.value="";
    //axios post msg call
})



//user-joined broadcast
socket.emit('user-joined', user);  
socket.on('user-joined', user=>{
    console.log(user);
})
socket.on('user-joined-broadcast', user=>{
    updateMessage(`${user} joined the chat`);
})

//when user sends a message
// socket.emit('send-message', message)

socket.on('receive-message', data=>{
    displayMessage(data.user, data.message);
})

//user-left broadcast
socket.on('user-left', user=>{
    updateMessage(`${user} left the chat`);
})





function displayMessage (sender, message, timestamp) {
    const messages = document.querySelector(".messages");

    const messageContainer = document.createElement("div");
    messageContainer.classList.add( sender=="you" ? "my-message" : "other-message");

    const nameContainer = document.createElement('div');
    nameContainer.classList.add("name");
    nameContainer.textContent = sender;

    const textContainer = document.createElement("div");
    textContainer.classList.add( sender==="you" ? "mytext" : "sendertext");
    textContainer.textContent = message;

    const timestampElement = document.createElement("div");
    timestampElement.classList.add("message-timestamp");
    timestampElement.textContent = timestamp;

    messageContainer.appendChild(nameContainer);
    messageContainer.appendChild(textContainer);

    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
}

function updateMessage (message) {
    const messages = document.querySelector(".messages");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add( "update");
    messageContainer.textContent = message;
    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
}

























// socket.on('receive-message', (message)=>{
//     const {userId, name}  = {userId: message.user.id, name: message.user.name}
//     const id = localStorage.getItem('id');

//     if(userId == id) displayMessage("you", message.data.message);
//     else displayMessage(name, message.data.message);
     
// })