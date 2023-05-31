
import { ChatRooms } from "./class/ChatRooms.js";
import { ChatRoom } from "./class/ChatRoom.js";
import { getCurrentUser } from "./currentUser.js";
import { SocketHandler } from "./utils/socket.js";
import { getFormattedTime } from "./utils/time.js";

let chatRooms = new ChatRooms();

let url = location.protocol + "//" + location.host + "/websocket-endpoint";
const socket = new SocketHandler(url, (message) => {
  let chatRoom = chatRooms.getChatRoomById(message.chatRoomId);
  if (message.chatRoomId === currentChatRoom.id) {
    chatRoom.addMessage(message);
    let senderName = chatRoom.getMemberById(message.fromUser.id).email;
    addMessageToContainer(senderName, message);
  } else {
    if (chatRoom === undefined) { // new chat room created by other user
      chatRoom = {
        id: message.chatRoomId,
        name: "",
        members: [message.fromUser, message.toUser],
        messages: [message],
      };
      chatRooms.addChatRoom(chatRoom);
      addChatRoomButton(chatRoom);
    } else {
      chatRoom.addMessage(message);
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
    toUserId: selectedUser.id, // TODO: is this really needed?
    text: messageInput.value,
    date: new Date(),
    chatRoomId: chatRooms.getCurrentChatRoom().id,
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

async function populateChatRooms() {
  conversationContainer.innerHTML = "";
  try {
    let res = await fetch("/chatrooms?userId=" + currentUser.id);
    if (res.ok) {
      let returnedChatRooms = await res.json();
      console.log('chatRooms', returnedChatRooms);
      returnedChatRooms.forEach((chatRoom) => {
        if (chatRoom == null) return;
        let chatRoomObj = new ChatRoom(chatRoom);
        chatRooms.addChatRoom(chatRoomObj);
        chatRoomObj.setButtonDomElement(addChatRoomButton(chatRoom));
        chatRooms.setCurrentChatRoom(chatRoomObj);
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

  let chatRoom = chatRooms.getChatRoomWith(selectedUser);
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
      let returnedChatRoom = new ChatRoom(await res.json());
      addChatRoomButton(returnedChatRoom);
      chatRooms.addChatRoom(returnedChatRoom);
    }
  } catch (error) {
    console.error(error);
    alert("Could not create chat room");
  }
}

function addChatRoomButton(chatRoom) {
  // let chatRoomName = getChatRoomName(chatRoom)
  let chatRoomName = chatRooms.getChatRoomById(chatRoom.id).getName();
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
  return chatRoomRow;
}

function getChatRoomName(chatRoom) {
  let chatRoomName = chatRoom.getName();
  if (chatRoom.members.length === 1 && chatRoom.members[0].id === currentUser.id) {
    chatRoomName = "(Empty)";
  }
  return chatRoomName;
}

function addMessageToContainer(senderName, message) {
  let messageRow = document.createElement("div");
  messageRow.classList.add("p-2");

  let messageTitle = document.createElement("div");
  messageTitle.classList.add("fw-bold");
  messageTitle.innerHTML = `${senderName} (${getFormattedTime(message.date)}): `;

  let messageText = document.createElement("span");
  messageText.textContent = `${message.text}`;

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
  let currentChatRoomId = chatRooms.getCurrentChatRoom().id;
  try {
    let res = await fetch(
      `/chatrooms/${currentUser.id}/leave/${currentChatRoomId}`,
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
        chatRoomId: currentChatRoomId,
      };
      sendMessageToServer(msg);
      chatRooms = chatRooms.removeChatRoom(currentChatRoomId);
      chatRooms.setCurrentChatRoom(null);
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
