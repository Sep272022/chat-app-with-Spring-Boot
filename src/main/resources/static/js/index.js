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
    date: new Date(),
    chatRoomId: currentChatRoom.id,
  };
  sendMessageToServer(msg);
  addMessageToContainer(currentUser.name, msg);
  messageInput.value = "";
});

document.addEventListener("keydown", (event) => {
  if (document.activeElement === messageInput && event.key === "Enter") {
    sendButton.click();
  }
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
      populateChatRooms();
    }
  } catch (error) {
    console.error(error);
    window.location.href = "/error";
  }
}
getCurrentUser();

let stompClient = null;
function initSock() {
  connect();
  stompClient.debug = (str) => {
    // console.log(str);
  };
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
  stompClient.connect(
    {},
    (frame) => {
      // console.log("Connected: " + frame);
      sendButton.disabled = false;

      stompClient.subscribe(
        "/user/topic/messages",
        (message) => {
          // callback function for when a message is received from the server
          console.log("received message: " + message);
          let msg = JSON.parse(message.body);
          let sender = allUsers.find((user) => user.id === msg.fromUserId);
          addMessageToContainer(sender.name, msg);
        },
        (error) => {
          // callback function for when an error is received from the server
          console.log("STOMP error: " + error);
        }
      );
    },
    (error) => {
      console.log("STOMP error: " + error);
      sendButton.disabled = true;
    }
  );
}

let chatRooms = [];
async function populateChatRooms() {
  conversationContainer.innerHTML = "";
  try {
    let res = await fetch("/chatrooms?userId=" + currentUser.id);
    if (res.ok) {
      chatRooms = await res.json();
      chatRooms.forEach((chatRoom) => {
        if (chatRoom == null) return;
        addChatRoomButton(chatRoom);
      });
    }
  } catch (error) {
    console.error(error);
    alert("Could not get chat rooms");
  }
}

let modalNewConversation = document.getElementById("modal-new-conversation");
modalNewConversation.addEventListener("show.bs.modal", (event) => {
  let button = event.relatedTarget;
  let recipient = button.getAttribute("data-bs-whatever");
  fillUsersInModal();
});

let allUsers = null;
const modalBodyAllUsers = document.querySelector("#modal-body-all-users");
async function fillUsersInModal() {
  modalBodyAllUsers.innerHTML = "";
  try {
    let res = await fetch("/users/all");
    if (res.ok) {
      allUsers = await res.json();
      allUsers.forEach((user) => {
        if (user.email === currentUser.email) return;
        let userRow = document.createElement("div");
        userRow.classList.add("row");
        userRow.innerHTML = `
          <input type="radio" class="btn-check" name="user-radio-button" id="${user.id}" autocomplete="off">
          <label class="btn btn-outline-primary w-100" for="${user.id}">${user.name}</label>
        `;
        modalBodyAllUsers.appendChild(userRow);
      });
    }
  } catch (error) {
    console.error(error);
    alert("Could not get users");
  }
}

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

  let selectedUserName =
    selectedUserInUserSelection.nextElementSibling.innerHTML;
  chatTitle.innerHTML = `${selectedUserName}`;
  selectedUser = allUsers.find(
    (user) => user.id === selectedUserInUserSelection.id
  );
  addChatRoomWith(selectedUser.name);
});

let currentChatRoom = null;
const conversationContainer = document.querySelector("#conversation-container");
async function addChatRoomWith(userName) {
  const chatRooom = {
    name: "",
    members: [currentUser, selectedUser],
    messages: [],
  };
  try {
    let res = await fetch("/chatrooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatRooom),
    });
    if (res.ok) {
      currentChatRoom = await res.json();
      addChatRoomButton(currentChatRoom);
    }
  } catch (error) {
    console.error(error);
    alert("Could not create chat room");
  }
}

function addChatRoomButton(chatRoom) {
  let chatRoomName = chatRoom.name;
  if (chatRoom.members.length === 1) {
    chatRoomName = "Empty";
  } else {
    chatRoomName =
      chatRoomName === ""
        ? chatRoom.members.find((member) => member.id != currentUser.id).name
        : chatRoomName;
  }
  let chatRoomRow = document.createElement("div");
  chatRoomRow.classList.add("d-flex", "justify-content-between");
  chatRoomRow.innerHTML = `
        <input type="radio" class="btn-check" name="talk-partners" id="${chatRoom.id}" autocomplete="off" checked>
        <label class="btn btn-outline-primary w-100" for="${chatRoom.id}">${chatRoomName}</label>
      `;

  chatRoomRow.addEventListener("click", (event) => {
    currentChatRoom = chatRooms.find((room) => room.id === chatRoom.id);
    selectedUser = currentChatRoom.members.find(
      (member) => member.id !== currentUser.id
    );
    chatTitle.innerHTML = currentChatRoom.name;
    messageContainer.innerHTML = "";
    currentChatRoom.messages.forEach((message) => {
      let sender = currentChatRoom.members.find(
        (user) => user.id === message.fromUserId
      );
      addMessageToContainer(sender.name, message); // TODO: handle if sender is null
    });
  });
  conversationContainer.prepend(chatRoomRow);
}

function addMessageToContainer(sender, message) {
  let messageRow = document.createElement("div");
  messageRow.classList.add("p-2");
  messageRow.innerHTML = `${sender}: ${message.text}`;
  messageContainer.appendChild(messageRow);
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function sendMessageToServer(message) {
  stompClient.send("/app/chat", {}, JSON.stringify(message));
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
    stompClient = null;
  }
}

const leaveButton = document.querySelector("#leave-button");
leaveButton.addEventListener("click", async (event) => {
  try {
    let res = await fetch(
      `/chatrooms/${currentUser.id}/leave/${currentChatRoom.id}`,
      {
        method: "POST",
      }
    );
    if (res.ok) {
      let msg = {
        fromUserId: currentUser.id,
        toUserId: selectedUser.id,
        text: `${currentUser.name} has left the chat`,
        date: new Date(),
        chatRoomId: currentChatRoom.id,
      };
      sendMessageToServer(msg);
      chatRooms = chatRooms.filter((room) => room.id !== currentChatRoom.id);
      currentChatRoom = null;
      messageContainer.innerHTML = "";
      chatTitle.innerHTML = "";
      conversationContainer.innerHTML = "";
      populateChatRooms();
    }
  } catch (error) {
    console.error(error);
    alert("Could not leave chat room");
  }
});
