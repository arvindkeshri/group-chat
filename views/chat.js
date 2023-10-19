const socket = io('http://localhost:3000')
const usertoken = localStorage.getItem('token')                      
let activeGroupId = localStorage.getItem('activeGroupId');


window.addEventListener('DOMContentLoaded',function(){
    getAllGroupsfromDB();
    // getAllMessagesFromDB();
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

function clearMessages(){
    const chatMessages = document.querySelector(".messages");
    chatMessages.innerHTML = '';
}
async function getAllMessagesFromDB(){
    const userId = localStorage.getItem('userId');
    const activeGroupId = localStorage.getItem('activeGroupId');
    if(!usertoken || !userId){
        console.log("No new messages in local storage");
        return;
    }
    try{
        const response = await axios.get(`http://localhost:3000/getMessage/${activeGroupId}`, {headers:{Authorization: usertoken}})  
        console.log("response",response.data.allMessage)
        const chatMessages = document.querySelector(".messages");
        chatMessages.innerHTML = '';
        const messages = {};   
         for(let i=0; i<response.data.allMessage.length; i++){
            let message = response.data.allMessage[i].message;
            let id = response.data.allMessage[i].id;
            let name = response.data.allMessage[i].user.name;
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
        const message = {message: messageText, token:usertoken, activeGroupId};
        if(!usertoken) return;
        try{  
            socket.emit('send-message', message);
            displayMessage("you", message.message);
            const response = await axios.post('http://localhost:3000/sendMessage', message, {headers:{Authorization: usertoken}})
            messageinput.value="";
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

function updateMessage (message) {
    const messages = document.querySelector(".messages");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add( "update");
    messageContainer.textContent = message;
    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
}




async function createGroup(groupname){
    const userId = localStorage.getItem('userId');
    const groupName = groupname;
    const group = {groupname: groupName, userId: userId};

    try{
        const response = await axios.post('http://localhost:3000/group/createGroup', group,  {headers:{Authorization: usertoken}});
        console.log("response",response.data);
        const data = {groupname: response.data.newGroup.groupname, groupId: response.data.newGroup.groupId}
        localStorage.setItem('activeGroupId', data.groupId );
        localStorage.setItem('activeGroupName', data.groupname);
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



function displayMessage (sender, message) {
    const messages = document.querySelector(".messages");

    const messageContainer = document.createElement("div");
    messageContainer.classList.add( sender=="you" ? "my-message" : "other-message");

    const nameContainer = document.createElement('div');
    nameContainer.classList.add("name");
    nameContainer.textContent = sender +":";

    const br = document.createElement('br');
    nameContainer.appendChild(br);

    const textContainer = document.createElement("div");
    textContainer.classList.add( sender==="you" ? "mytext" : "sendertext");
    textContainer.textContent = message;

    messageContainer.appendChild(nameContainer);
    messageContainer.appendChild(textContainer);

    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
}




function displayGroup(data){
    const groupname = data.groupname;
    const groupId = data.id;
    const grouplist = document.getElementById('grouplist');
    const newGroup = document.createElement('div');
    newGroup.className = 'newgrouplist';
    newGroup.textContent = groupname;

    newGroup.addEventListener('click', ()=>{
        localStorage.setItem('activeGroupName', groupname);
        localStorage.setItem('activeGroupId', groupId)
        const chatHeader = document.querySelector('.logo');
        chatHeader.textContent = groupname;
        getAllMessagesFromDB();            
        const userlistpane = document.getElementById('userlistpane');
        
        chatHeader.addEventListener('click', ()=>{
            userlistpane.innerHTML = '';
            userlistpane.classList.toggle("show");
            // const searchInput = document.createElement('input');
            // searchInput.type = 'text';
            // searchInput.placeholder = 'Search users';
            // const searchBtn = document.createElement('button');
           // searchBtn.className = "btn btn-success";
            //searchBtn.textContent = 'Search';
            //userlistpane.appendChild(searchInput);
           // userlistpane.appendChild(searchBtn);

            const addUserInput = document.createElement('input');
            addUserInput.type = 'text';
            addUserInput.className = 'adduserinput';
            
            addUserInput.placeholder = 'user email to add';
            const addUserBtn = document.createElement('button');
            addUserBtn.className = "btn";
            addUserBtn.id = 'adduserbtn';
            addUserBtn.textContent = 'Add';

            userlistpane.appendChild(addUserInput)
            userlistpane.appendChild(addUserBtn);
            addUserBtn.addEventListener('click', ()=>{
                //if admin add user
            })

             //axios get call to get all group users 
            const userlist = document.createElement('div');
            userlist.className = 'userlist';
            userlist.textContent = 'group members list here';
            const makeAdminBtn = document.createElement('button');
            makeAdminBtn.textContent = 'Make Admin';
            makeAdminBtn.className = 'btn';
            const deleteUserBtn = document.createElement('button');
            deleteUserBtn.className = 'btn';
            deleteUserBtn.id = 'removeuser';
            deleteUserBtn.textContent = 'Remove';

            userlist.appendChild(makeAdminBtn)
            userlist.appendChild(deleteUserBtn);
            deleteUserBtn.addEventListener('click', ()=>{
            
            })
        
            userlistpane.appendChild(userlist);
            const deleteGroupbtn = document.createElement('button');
            deleteGroupbtn.textContent = 'Delete Group'
            deleteGroupbtn.className = 'btn';
            deleteGroupbtn.id = 'deletegroupbtn';
            userlistpane.appendChild(deleteGroupbtn)
            deleteGroupbtn.addEventListener('click', ()=>{
                //if admin delete group

            })

            const exitGroupBtn = document.createElement('button');
            exitGroupBtn.textContent = 'Leave Group';
            exitGroupBtn.className = 'btn';
            exitGroupBtn.id = 'exitgroupbtn';
            userlistpane.appendChild(exitGroupBtn);
            exitGroupBtn.addEventListener('click', ()=>{

            })
            
            
            
            
        })
        
        clearMessages();
        getAllMessagesFromDB();
        console.log(`Displaying all messages of the group ${data}`)
    })

    grouplist.appendChild(newGroup);
    
}





















