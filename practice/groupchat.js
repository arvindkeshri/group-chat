function closeUserList() {
    const userList = document.getElementById('all-user-list');
    userList.style.display = 'none';

    const container = document.getElementById('group_list');
    container.style.display = 'block';
}

async function sendMessageToServer() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value;
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token not found in localStorage');
    return;
  }

  const message = {
    message: messageText,
  };

  try {
    const response = await axios.post('http://localhost:3000/user/message', { message }, {
      headers: { Authorization:  token },
    });
    messageInput.value = '';
    localStorage.setItem('id', response.data.newMessage[0].id);
    displayMessage("You", response.data.newMessage[0].message, true);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function getAllMessagesFromDB() {
  const token = localStorage.getItem('token');

  const userId = localStorage.getItem('id');
  
  // setInterval( 
    async() => {
    if (!token || !userId) {
      console.error('Token or user ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/user/getmessages', {
        headers: { Authorization:  token  }, 
      });
      

      clearChatMessages();
      const messages = {};

      for (let i = 0; i < response.data.allMessage.length; i++) {
        let message = response.data.allMessage[i].message;
        let id = response.data.allMessage[i].id;
        // console.log(response.data.allMessage[i].user_detail)
        let name = response.data.allMessage[i].user_detail.name;
        localStorage.setItem('name',name);
        // console.log(name);

        messages[id] = message;

        const isUser = response.data.allMessage[i].userId == userId;
        displayMessage(isUser ? "You" : name, message, isUser);
        
      }

      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (err) {
      console.error(err);
    }
   }
  //  ,1000);
}

function getAllMessagesFromLS() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  console.log("messages from LS", messages);
  clearChatMessages();
  if (messages.length > 10) {
    messages = messages.slice(messages.length - 10);
  }
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    displayMessage("You", message, true);
  }
}


function clearChatMessages() {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.innerHTML = ''; 
}

function displayMessage(sender, message, isUser) {
    const chatMessages = document.querySelector(".chat-messages");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", isUser ? "user" : "You");
  
    const senderDiv = document.createElement("div");
    senderDiv.classList.add("message-sender");
    senderDiv.textContent = sender;

    const messageTextDiv = document.createElement("div");
    messageTextDiv.classList.add("message-text");
    messageTextDiv.textContent = message;

    messageContainer.appendChild(senderDiv);
    messageContainer.appendChild(messageTextDiv);

    chatMessages.appendChild(messageContainer);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

displayMessage( "Hello! How are u today?", false);

window.addEventListener('DOMContentLoaded', getAllMessagesFromDB);
async function getAllNewMessagesFromDB() {
  const latestMessageOfUserHasSentId = localStorage.getItem('latest msg id');
  const userId = localStorage.getItem('id');
  console.log("latestMessageOfUserHasId", latestMessageOfUserHasSentId);
  try {
      const response = await axios.get(`http://localhost:3000/user/allMessages/${latestMessageOfUserHasSentId}`);
      console.log(response.data.newMessages);
      for (let i = 0; i < response.data.newMessages.length; i++) {
          console.log("--->", response.data.newMessages[i])
          if (response.data.newMessages.userId == userId) {

              displayMessage("You", response.data.newMessages[i].message, true);
          }
          else {
              displayMessage("You", response.data.newMessages[i].message, false);
          }
          localStorage.setItem('latest msg id', (response.data.newMessages[i].id));
      }

  }
  catch (errr) {
      console.log('error fetching new messsages')
  }
}


/////group-creation/////


document.getElementById('groupCreateFrom').addEventListener('submit', createGroup);
async function createGroup(e) {
    e.preventDefault();
    const userId = localStorage.getItem('id');
    const groupName = document.getElementById('group-name-input').value;
    console.log('group button working', userId)
    console.log('groupName', groupName);
    const group={
      groupName: groupName,
      userId : userId
    }
    try {
        const response = await axios.post('http://localhost:3000/group/createGroup',group);
        console.log("group id after group creation", response);
        displayGroup(response.data.result)
        } catch (error) {
            console.log(error);
        }
}

window.addEventListener('DOMContentLoaded', getAllGroupsOfUserFromDB);
async function getAllGroupsOfUserFromDB() {
  try {
      const userId = localStorage.getItem('id');
      console.log(userId)
      const response = await axios.get(`http://localhost:3000/group/fetchGroups/${userId}`);
      console.log("all groups of user",response.data);
      for (let i = 0; i < response.data.length; i++) {
        const data = response.data[i];
        console.log(data);
          displayGroup(data);
      }

  } catch (error) {
      console.log(error);
  }
}


function displayGroup(data) {
  console.log(data);
  let groupName = data.group.group_name;
  console.log(groupName);
  const groupId = data.groupGroupId;
  console.log(groupId);
  console.log("revieving group id",groupId)
  localStorage.setItem('groupName',groupName);
  localStorage.setItem('groupId',groupId);

  const userId = localStorage.getItem('id');
  console.log('userId',userId)
  console.log("group is", groupName);
  console.log("group id is", groupId);
  const groupLists = document.getElementById('list_of_groups');

  const buttonItem = document.createElement('button');
  buttonItem.className = 'group_button';
  buttonItem.setAttribute('groupId', groupId);

  const groupNameSpan = document.createElement('span');
  groupNameSpan.textContent = groupName;

  buttonItem.appendChild(groupNameSpan);

  buttonItem.addEventListener('click', () => {
      const chatHeader = document.getElementById('chat-header-element');
      groupName = groupName;
      chatHeader.textContent = groupName;

      const dropdownContainer = document.createElement('div');
      dropdownContainer.className = 'dropdown';


      const dropdownButton = document.createElement('button');
      dropdownButton.className = 'dropdown-btn';
      dropdownButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>'; 

      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'dropdown-content';


      const addUsersButton = document.createElement('button');
      addUsersButton.id = 'add_users';
      addUsersButton.textContent = 'Add Users';

      addUsersButton.addEventListener('click', function () {
          const container = document.getElementById('group_list');
          container.style.display = 'none';
          showAllUsersOfChatApp(groupId, userId);
          console.log(showAllUsersOfChatApp(groupId, userId))
      });
      const removeMembersButton = document.createElement('button');
      removeMembersButton.id = 'remove_users';
      removeMembersButton.textContent = 'remove Users';

      removeMembersButton.addEventListener('click', function () {
        const container = document.getElementById('group_list');
        container.style.display = 'none';
        removeUserFromGroup(groupId,userId);
    });

      const seeMembersButton = document.createElement('button');
      seeMembersButton.id = 'see_users';
      seeMembersButton.textContent = 'See Members';

      seeMembersButton.addEventListener('click', function () {
          const container = document.getElementById('group_list');
          container.style.display = 'none';
          showListOfGroupMembers(groupId,userId);
      });

      const logoutButton = document.createElement('button');
      logoutButton.textContent = 'Logout';

      logoutButton.addEventListener('click',logOutUser);

      // Append the dropdown button and content to the dropdown container
      dropdownContainer.appendChild(dropdownButton);
      dropdownContainer.appendChild(dropdownContent);

      // Append the individual buttons to the dropdown content
      dropdownContent.appendChild(addUsersButton);
      dropdownContent.appendChild(removeMembersButton);
      dropdownContent.appendChild(seeMembersButton);
      dropdownContent.appendChild(logoutButton);

      // Append the dropdown container to the chat header
      chatHeader.appendChild(dropdownContainer);



      const chatMessages = document.querySelector(".chat-messages");
      chatMessages.innerHTML = '';

      const sendMessageButton = document.getElementById('send-button');
      

  });

  groupLists.appendChild(buttonItem);

}

//function logout

function logOutUser() {
  window.location.href = '../views/signup.html';
}


 /////groupUsers///////

 async function displayUsersInTable(userData, groupId, adminId) {
  try {
    const userList = document.getElementById('all-user-list');
    const listOfAllUsers = document.getElementById('list_of_users');
    listOfAllUsers.innerHTML = '';

    const userTable = document.createElement('table');
    userTable.classList.add('user-table');

    // Create table header row
    const headerRow = document.createElement('tr');
    const emailHeader = document.createElement('th');
    emailHeader.textContent = 'Email';
    headerRow.appendChild(emailHeader);
    userTable.appendChild(headerRow);

    // Loop through the user data and create table rows for each user
    userData.forEach(user => {
      const userRow = document.createElement('tr');

      // Create a cell for the email
      const emailCell = document.createElement('td');
      emailCell.textContent = user.email;
      userRow.appendChild(emailCell);

      // Create a hidden input field for the email
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = user.email;
      userRow.appendChild(emailInput);

      // Create a cell for the "Add User" button
      const addButtonCell = document.createElement('td');
      const addButton = document.createElement('button');
      addButton.textContent = 'Add User';
      
      // Check if the user is already in the group
      if (user.isInGroup === true) {
        addButton.style.display = 'none'; // Hide the button
      } else {
        addButton.addEventListener('click', async () => {
          const addUser = {
            email: user.email,
            groupId: groupId,
            adminId: adminId,
            id: user.id
          };
          try {
            const response = await axios.post('http://localhost:3000/groupuser/addUser', addUser);
            if (response.status == 201) {
              alert('User already present in the group');
              addButton.style.display = 'none';
            } else if (response.status == 200) {
              addButton.textContent = '✓ Added';
              addButton.style.backgroundColor = 'green';
              addButton.disabled = true;
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
      
      addButtonCell.appendChild(addButton);
      userRow.appendChild(addButtonCell);

      userTable.appendChild(userRow);
    });

    // Append the table to the same element where you are displaying the user list
    listOfAllUsers.appendChild(userTable);

    // Add CSS style to the list container to make it scrollable
    listOfAllUsers.style.overflow = 'auto';
    listOfAllUsers.style.maxHeight = '300px';
    userList.style.display = 'block';
  } catch (error) {
    console.log(error);
  }
}

///remove users from group 
async function deleteUsersFromGroup(userData, groupId, adminId) {
  try {
    const userList = document.getElementById('all-user-list');
    const listOfAllUsers = document.getElementById('list_of_users');
    listOfAllUsers.innerHTML = '';

    const userTable = document.createElement('table');
    userTable.classList.add('user-table');

    // Create table header row
    const headerRow = document.createElement('tr');
    const emailHeader = document.createElement('th');
    emailHeader.textContent = 'Email';
    headerRow.appendChild(emailHeader);
    userTable.appendChild(headerRow);

    // Loop through the user data and create table rows for each user
    userData.forEach(user => {
      const userRow = document.createElement('tr');

      // Create a cell for the email
      const emailCell = document.createElement('td');
      emailCell.textContent = user.email;
      userRow.appendChild(emailCell);

      // Create a hidden input field for the email
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = user.email;
      userRow.appendChild(emailInput);

      // Create a cell for the "Add User" button
      const deleteButtonCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';

      deleteButton.addEventListener('click', async () => {
         try {
          const response = await axios.delete(`http://localhost:3000/groupuser/removeUserFromGroup/${groupId}/${adminId}`);
          const userData = response.data.result;
          deleteButton.textContent = 'X deleted';
          deleteButton.style.backgroundColor = 'red';
          deleteButton.disabled = true;
          console.log('response',response)
          await deleteUsersFromGroup(userData, groupId, adminId);
          
        } catch (error) {
          console.error(error);
        }
      });
    
         

      deleteButtonCell.appendChild(deleteButton);
      userRow.appendChild(deleteButtonCell);

      userTable.appendChild(userRow);
    });

    // Append the table to the same element where you are displaying the user list
    listOfAllUsers.appendChild(userTable);

    // Add CSS style to the list container to make it scrollable
    listOfAllUsers.style.overflow = 'auto';
    listOfAllUsers.style.maxHeight = '300px';
    userList.style.display = 'block';
  } catch (error) {
    console.log(error);
  }
}

///see users of group
async function seeUsersOfGroup(userData, groupId, adminId) {
  try {
    const userList = document.getElementById('all-user-list');
    const listOfAllUsers = document.getElementById('list_of_users');
    listOfAllUsers.innerHTML = '';

    const userTable = document.createElement('table');
    userTable.classList.add('user-table');

    // Create table header row
    const headerRow = document.createElement('tr');
    const emailHeader = document.createElement('th');
    emailHeader.textContent = 'Email';
    headerRow.appendChild(emailHeader);
    userTable.appendChild(headerRow);

    // Loop through the user data and create table rows for each user
    userData.forEach(user => {
      const userRow = document.createElement('tr');

      // Create a cell for the email
      const emailCell = document.createElement('td');
      emailCell.textContent = user.email;
      userRow.appendChild(emailCell);

      // Create a hidden input field for the email
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = user.email;
      userRow.appendChild(emailInput);

     // Create a cell for the "Add User" button
      const addButtonCell = document.createElement('td');
      userRow.appendChild(addButtonCell);

      userTable.appendChild(userRow);
    });

    listOfAllUsers.appendChild(userTable);

    
    listOfAllUsers.style.overflow = 'auto';
    listOfAllUsers.style.maxHeight = '300px';
    userList.style.display = 'block';
  } catch (error) {
    console.log(error);
  }
}

// Usage example for displaying group members
async function showListOfGroupMembers(groupId, adminId) {
  try {
    const response = await axios.get(`http://localhost:3000/groupuser/listOfGroupUsers/${groupId}`);
    const userData = response.data.result;
    console.log(userData);
    await seeUsersOfGroup(userData, groupId, adminId);
  } catch (error) {
    console.log(error);
  }
}

// Usage example for displaying all users
async function showAllUsersOfChatApp(groupId, adminId) {
  try {
    const response = await axios.get('http://localhost:3000/groupuser/listOfAllUsers');
    const userData = response.data.result;
    console.log(">",response);
    await displayUsersInTable(userData, groupId, adminId);
  } catch (error) {
    console.log(error);
  }
}

async function removeUserFromGroup(groupId, adminId) {
  try {
    const response = await axios.get(`http://localhost:3000/groupuser/listOfGroupUsers/${groupId}`);
    const userData = response.data.result;
    console.log(userData);
    await deleteUsersFromGroup(userData, groupId, adminId);
  } catch (error) {
    console.log(error);
  }
  
}