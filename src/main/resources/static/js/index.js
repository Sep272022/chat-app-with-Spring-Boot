
const messageContainer = document.querySelector("#message-container");
const chatTitle = document.querySelector("#chat-title");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
sendButton.disabled = true;
sendButton.addEventListener("click", (event) => {
  if (messageInput.value === "") return;
  let msg = {
    fromUserId: currentUser.id,
    toUserId: selectedUser.id,
    text: messageInput.value,
    date: new Date()
  }
  sendMessage(msg);
  addMessageToContainer(currentUser.name, msg);
  messageInput.value = "";
});

document.addEventListener('keydown', (event) => {
  if (document.activeElement === messageInput && event.key === "Enter") {
    sendButton.click();
  }
})


const userNameSpan = document.querySelector("#user-name");
let currentUser = null;
async function getCurrentUser() {
  try {
    let res = await fetch("/users/current");
    if (res.ok) {
      let user = await res.json();
      currentUser = user;
      userNameSpan.innerHTML = `${user.name} (${user.roles[0].name})`;
      initSock();
    }
  } catch (error) {
    console.error(error);
    window.location.href = "/error";
  }
}
getCurrentUser();
console.log('currentUser', currentUser);

let stompClient = null;
function initSock() {
  connect();
  stompClient.debug = (str) => {
    // console.log(str);
  }
  establishConnection(stompClient);
}

function connect() {
  let url = location.protocol + "//" + location.host + "/websocket-endpoint";
  // let socket = new WebSocket("ws://localhost:8080//websocket-endpoint");
  let sockjs = new SockJS(url);
  stompClient = Stomp.over(sockjs);
  // console.log("Connecting to " + url);
}

function establishConnection(stompClient) {
  stompClient.connect({}, (frame) => {
    // console.log("Connected: " + frame);
    sendButton.disabled = false;

    stompClient.subscribe(
      "/user/topic/messages",
      (message) => { // callback function for when a message is received from the server
        console.log("received message: " + message);
        let msg = JSON.parse(message.body);
        let sender = allUsers.find(user => user.id === msg.fromUserId);
        addMessageToContainer(sender.name, msg);
      },
      (error) => { // callback function for when an error is received from the server
        console.log("STOMP error: " + error);
      }
    );
  }, (error) => {
    console.log("STOMP error: " + error);
    sendButton.disabled = true;
  });
}

let allUsers = null;
const modalBodyAllUsers = document.querySelector("#modal-body-all-users");
function fillUsersInModal() {
  modalBodyAllUsers.innerHTML = "";
  fetch("/users/all")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Could not get users");
      }
    })
    .then((users) => {
      allUsers = users;
      users.forEach((user) => {
        if (user.email === currentUser.email) return;
        let userRow = document.createElement("div");
        userRow.classList.add("row");
        userRow.innerHTML = `
          <input type="radio" class="btn-check" name="user-radio-button" id="${user.id}" autocomplete="off">
          <label class="btn btn-outline-primary w-100" for="${user.id}">${user.name}</label>
        `;
        modalBodyAllUsers.appendChild(userRow);
      });
    });
}

let modalNewConversation = document.getElementById("modal-new-conversation");
modalNewConversation.addEventListener("show.bs.modal", (event) => {
  let button = event.relatedTarget;
  let recipient = button.getAttribute("data-bs-whatever");
  fillUsersInModal();
});

let selectedUser = null;
const talkButton = document.querySelector("#talk-button");
talkButton.addEventListener("click", (event) => {
  let selectedUserInUserSelection = document.querySelector(
    "input[name='user-radio-button']:checked"
  );
  if (selectedUserInUserSelection === null) {
    alert("Please select a user to talk to");
    return;
  }
  
  let selectedUserName = selectedUserInUserSelection.nextElementSibling.innerHTML;
  chatTitle.innerHTML = `Chat with ${selectedUserName}`;
  selectedUser = allUsers.find(user => user.id === selectedUserInUserSelection.id);
  addChatRoomWith(selectedUser.name);
});

const conversationContainer = document.querySelector("#conversation-container");
function addChatRoomWith(userName) {
  let conversationRow = document.createElement("div");
  conversationRow.classList.add("d-flex", "justify-content-between");
  conversationRow.innerHTML = `
    <input type="radio" class="btn-check" name="talk-partners" id="${userName}" autocomplete="off" checked>
    <label class="btn btn-outline-primary w-100" for="${userName}">${userName}</label>
  `;
  conversationContainer.appendChild(conversationRow);
  conversationRow.addEventListener("click", (event) => {
    
  });
}

function addMessageToContainer(sender, message) {
  let messageRow = document.createElement("div");
  messageRow.classList.add("p-2");
  messageRow.innerHTML = `${sender}: ${message.text}`;
  messageContainer.appendChild(messageRow);
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function sendMessage(message) {
  stompClient.send("/app/chat", {}, JSON.stringify(message));
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
    stompClient = null;
  }
}
