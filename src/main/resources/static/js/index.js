
import { getCurrentUser } from "./currentUser.js";
import { SocketHandler } from "./socket.js";
import { getFormattedTime } from "./time.js";

let url = location.protocol + "//" + location.host + "/websocket-endpoint";
const socket = new SocketHandler(url, (message) => {
  if (message.chatRoomId === currentChatRoom.id) {
    let chatRoom = chatRooms.find((room) => room.id === message.chatRoomId);
    chatRoom.messages.push(message);
    let senderName = chatRoom.members.find((member) => member.id === message.fromUserId).email;
    addMessageToContainer(senderName, message);
  } else {
    let chatRoom = chatRooms.find((room) => room.id === message.chatRoomId);
    if (chatRoom === undefined) { // new chat room created by other user
      chatRoom = {
        id: message.chatRoomId,
        name: "",
        members: [message.fromUser, message.toUser],
        messages: [message],
      };
      chatRooms.push(chatRoom);
      addChatRoomButton(chatRoom);
    } else {
      chatRoom.messages.push(message);
    }
  }
});

const messageContainer = document.querySelector("#message-container");
const chatTitle = document.querySelector("#chat-title");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const conversationContainer = document.querySelector("#conversation-container");
const userNameSpan = document.querySelector("#user-name");

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
  addMessageToContainer(currentUser.email, msg);
  messageInput.value = "";
});

document.addEventListener("keydown", (event) => {
  if (document.activeElement === messageInput && event.key === "Enter") {
    sendButton.click();
  }
});

let currentUser = await getCurrentUser();
userNameSpan.innerHTML = `${currentUser.email} (${currentUser.roles[0].name})`;
populateChatRooms();

let chatRooms = [];
async function populateChatRooms() {
  conversationContainer.innerHTML = "";
  try {
    let res = await fetch("/chatrooms?userId=" + currentUser.id);
    if (res.ok) {
      chatRooms = await res.json();
      console.log('chatRooms', chatRooms);
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
          <label class="btn btn-outline-primary w-100" for="${user.id}">${user.email}</label>
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

  selectedUser = allUsers.find(
    (user) => user.id === selectedUserInUserSelection.id
  );

  let chatRoom = chatRooms.find((room) => room.members.find((member) => member.id === selectedUser.id));
  if (chatRoom !== undefined) {
    document.getElementById(`${chatRoom.id}`).click();
  } else {
    addChatRoomWith(selectedUser);
  }
});

let currentChatRoom = null;
async function addChatRoomWith(user) {
  const chatRooom = {
    name: "",
    members: [currentUser, user],
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
    chatRoomName = "(Empty)";
  } else {
    chatRoomName =
      chatRoomName === ""
        ? chatRoom.members.find((member) => member.id !== currentUser.id).email
        : "Failed to load name";
  }
  let chatRoomRow = document.createElement("div");
  chatRoomRow.classList.add("d-flex", "justify-content-between");
  chatRoomRow.innerHTML = `
        <input type="radio" class="btn-check" name="talk-partners" id="${chatRoom.id}" autocomplete="off" checked>
        <label class="btn btn-outline-primary w-100" for="${chatRoom.id}">${chatRoomName}</label>
      `;

  chatRoomRow.addEventListener("click", (event) => {
    // let foundChatRoom = chatRooms.find((room) => room.id === chatRoom.id);
    selectedUser = chatRoom.members.find(
      (member) => member.id !== currentUser.id
    );
    chatTitle.innerHTML = chatRoomName;
    messageContainer.innerHTML = "";
    chatRoom.messages.forEach((message) => {
      let sender = chatRoom.members.find(
        (user) => user.id === message.fromUserId
      );
      addMessageToContainer(sender === undefined ? "Unknown" : sender.email, message);
    });
    currentChatRoom = chatRoom;
  });
  conversationContainer.prepend(chatRoomRow);
}

function addMessageToContainer(senderName, message) {
  let messageRow = document.createElement("div");
  messageRow.classList.add("p-2");

  let messageTitle = document.createElement("div");
  messageTitle.classList.add("fw-bold");
  messageTitle.innerHTML = `${senderName} (${getFormattedTime(message.date)}): `;

  let messageText = document.createElement("span");
  messageText.innerHTML = `${message.text}`;

  messageRow.appendChild(messageTitle);
  messageRow.appendChild(messageText);
  messageContainer.appendChild(messageRow);
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function sendMessageToServer(message) {
  socket.sendMessage(message);
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
        text: `${currentUser.email} has left the chat`,
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
