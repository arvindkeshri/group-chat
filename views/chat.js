const socket = io('http://localhost:3000')
const usertoken = localStorage.getItem('token')                       //userId and name


window.addEventListener('DOMContentLoaded',function(){
    getAllGroupsfromDB();
    getAllMessagesFromDB();
    document.getElementById('sendbutton').addEventListener('click', async(e)=>{
        e.preventDefault();
        sendMessageToServer();
    })
    
    document.getElementById('exitchatbtn').addEventListener('click', async(e)=>{
       e.preventDefault();
        window.location.href ='http://localhost:3000';
    })
    
    document.getElementById('groupbtn').addEventListener('click', async(e)=>{
        e.preventDefault();
        const groupname = prompt('Enter your group name');
        createGroup(groupname);
     })
})


async function getAllMessagesFromDB(){
    const userId = localStorage.getItem('userId');
    if(!usertoken || !userId){
        console.log("No new messages in local storage");
        return;
    }
    try{
        const response = await axios.get('http://localhost:3000/getMessage', {headers:{Authorization: usertoken}})  

        const chatMessages = document.querySelector(".messages");
        chatMessages.innerHTML = '';
        const messages = {};   
         for(let i=0; i<response.data.allMessage.length; i++){
            let message = response.data.allMessage[i].message;
            let id = response.data.allMessage[i].id;
            let name = response.data.allMessage[i].user.name;
            localStorage.setItem('name', name);
            messages[id]= {name: name, message: message};
            const isUser = (response.data.allMessage[i].userId == userId);
            displayMessage(isUser ? "you" : name, message)
         }
            localStorage.setItem('chatMessages', JSON.stringify(messages));
    }catch(err){
        console.log("Unable to get message from local storage", err)
    }
}

    
async function sendMessageToServer(){
        const messageinput = document.getElementById('messageinput');
        const messageText = messageinput.value;
        const message = {message: messageText, token:usertoken};
        if(!usertoken) return;
        try{  
            socket.emit('send-message', message);
            displayMessage("you", message.message);
            const response = await axios.post('http://localhost:3000/sendMessage', message, {headers:{Authorization: usertoken}})
            messageinput.value="";
            const userId = response.data.newMessage.data.userId
            localStorage.setItem('userId', userId) 
        }catch(err){
            console.log("unable to send", err)
        }        
  }

function getAllMessagesFromLS(){
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const chatMessages = document.querySelector(".messages");
    chatMessages.innerHTML = '';
    if(messages.length>10)messages = messages.slice(messages.length-10);
    for(let i=0; i<messages.length; i++)displayMessage("you", messages[i]);            
}



//user-joined to server and receive broadcast for the same from server
socket.on('connect', ()=>{
    socket.emit('user-joined', usertoken);  
})

socket.on('user-joined-broadcast', user=>{
    updateMessage(`${user.name} joined the chat`);
})


//when user sends a message
socket.on('receive-message', data=>{
    console.log("client msg data", data);
    displayMessage(data.user, data.message);
})

//user-left broadcast
socket.on('user-left', user=>{
    updateMessage(`${user} left the chat`);
})




async function createGroup(groupname){
    const userId = localStorage.getItem('userId');
    const groupName = groupname;
    const group = {groupname: groupName, userId: userId};

    try{
        const response = await axios.post('http://localhost:3000/group/createGroup', group,  {headers:{Authorization: usertoken}});
        console.log("response",response.data);
        const data = {groupname: response.data.newGroup.groupname, groupId: response.data.newGroup.groupId}
       
        
        //display group in the group container
        displayGroup(data);
    }catch(err){
        console.log(err)
    }
}


async function getAllGroupsfromDB(){
    try{
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/group/fetchGroup/${userId}`, {headers:{Authorization: usertoken}});
        console.log("response", response.data);
        for(let i=0; i<response.data.length; i++){
            displayGroup(response.data[i]);
        }
    }catch(err){
        console.log(`Unable to get groups from DB ${err}`)
    }
}


function displayGroup(data){
    const groupname = data.groupname;
    const groupId = data.groupId;
    localStorage.setItem('groupname', groupname);
    localStorage.setItem('groupId', groupId);
    const grouplist = document.getElementById('grouplist');

    const newGroup = document.createElement('div');
    newGroup.className = 'newgrouplist';
    newGroup.textContent = groupname;
    newGroup.addEventListener('click', ()=>{
        //show group messages on chatscreen calling such function
    })

    grouplist.appendChild(newGroup);
    
}


























function displayMessage (sender, message, timestamp) {
    const messages = document.querySelector(".messages");

    const messageContainer = document.createElement("div");
    messageContainer.classList.add( sender=="you" ? "my-message" : "other-message");

    const nameContainer = document.createElement('div');
    nameContainer.classList.add("name");
    nameContainer.textContent = sender + ":" + " ";

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