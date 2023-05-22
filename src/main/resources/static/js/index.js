
const messageContainer = document.querySelector("#message-container");
const chatTitle = document.querySelector("#chat-title");
const sendButton = document.querySelector("#send-button");
sendButton.disabled = true;
sendButton.addEventListener("click", (event) => {
  let msg = {
    fromUserId: currentUser.id,
    toUserId: selectedUserId,
    text: "Hello",
    date: "2021-08-01"
  }
  sendMessage(msg);
  updateMessageContainer(msg);
});


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
    console.log(str);
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
      "/topic/messages",
      (message) => { // callback function for when a message is received from the server
        console.log("received message: " + message);
        let msg = JSON.parse(message.body);
        updateMessageContainer(msg);
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

let selectedUserId = null;
const talkButton = document.querySelector("#talk-button");
talkButton.addEventListener("click", (event) => {
  let selectedUser = document.querySelector(
    "input[name='user-radio-button']:checked"
  );
  if (selectedUser === null) {
    alert("Please select a user to talk to");
    return;
  }
  chatTitle.innerHTML = `Chat with ${selectedUser.nextElementSibling.innerHTML}`;
  selectedUserId = selectedUser.id;
  addConversation(selectedUser);
});

const conversationContainer = document.querySelector("#conversation-container");
function addConversation(user) {
  console.log('user',user);
  let conversationRow = document.createElement("button");
  conversationRow.classList.add("list-group-item", "d-flex", "justify-content-between", "list-group-item-action", "active");
  
  conversationRow.innerHTML = `
    ${user.id}
    <span class="badge bg-primary rounded-pill"></span>
  `;
  conversationContainer.appendChild(conversationRow);
} 

function updateMessageContainer(message) {
  let messageRow = document.createElement("div");
  messageRow.classList.add("p-2");
  messageRow.innerHTML = `${message.fromUserId}: ${message.text}`;
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
