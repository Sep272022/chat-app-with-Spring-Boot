import { ChatRooms } from "./class/ChatRooms.js";
import { ChatRoom } from "./class/ChatRoom.js";
import { getCurrentUser } from "./currentUser.js";
import { SocketHandler } from "./utils/socket.js";
import {
  addMessageToMessageContainer,
  disableSendButton,
  emptyMessageContainer,
  getTextFromMessageInput,
  registerClickListenerOnSendButton,
  setCurrentUserUI,
  setTextInChatTitle,
  setTextInMessageContainer,
  clearMessageInput,
  prependChatRoomToChatRoomContainer,
  clearChatRoomContainer,
} from "./ui.js";

let chatRooms = new ChatRooms();

let url = location.protocol + "//" + location.host + "/websocket-endpoint";
const socket = new SocketHandler(url, (message) => {
  chatRooms.addMessageToChatRoomById(message.chatRoomId, message);
  let targetChatRoom = chatRooms.getChatRoomById(message.chatRoomId);
  let isNewChatRoom = targetChatRoom === undefined;

  if (isNewChatRoom) {
    addChatRoomButton(targetChatRoom);
  } else {
    let isCurrentChatRoom =
      message.chatRoomId === chatRooms.getCurrentChatRoom().id;
    if (isCurrentChatRoom) {
      let senderName = targetChatRoom.getMemberById(message.fromUser.id).email;
      addMessageToMessageContainer(senderName, message);
    }
  }
});

disableSendButton();
registerClickListenerOnSendButton(() => {
  let message = getTextFromMessageInput();
  if (message === "") return;
  let msg = {
    fromUserId: currentUser.id,
    toUserId: selectedUser.id, // TODO: is this really needed?
    text: message,
    date: new Date(),
    chatRoomId: chatRooms.getCurrentChatRoom().id,
  };
  sendMessageToServer(msg);
  addMessageToMessageContainer(currentUser.email, msg);
  chatRooms.getCurrentChatRoom().addMessage(msg);
  clearMessageInput();
});

let currentUser = await getCurrentUser();
setCurrentUserUI(currentUser);
populateChatRooms();

async function populateChatRooms() {
  clearChatRoomContainer();
  try {
    let res = await fetch("/chatrooms?userId=" + currentUser.id);
    if (res.ok) {
      let returnedChatRooms = await res.json();
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
      chatRooms.addChatRoom(returnedChatRoom);
      addChatRoomButton(returnedChatRoom);
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
    // chatTitle.innerHTML = chatRoomName;
    setTextInChatTitle(chatRoomName);
    emptyMessageContainer();
    chatRoom.messages.forEach((message) => {
      let sender = chatRoom.members.find(
        (user) => user.id === message.fromUserId
      );
      addMessageToMessageContainer(
        sender === undefined ? "Unknown" : sender.email, // TODO: sender is undefined when current chat room is not the one with the message
        message
      );
    });
    chatRooms.setCurrentChatRoom(new ChatRoom(chatRoom));
  });
  prependChatRoomToChatRoomContainer(chatRoomRow);
  return chatRoomRow;
}

function getChatRoomName(chatRoom) {
  let chatRoomName = chatRoom.getName();
  if (
    chatRoom.members.length === 1 &&
    chatRoom.members[0].id === currentUser.id
  ) {
    chatRoomName = "(Empty)";
  }
  return chatRoomName;
}

function sendMessageToServer(message) {
  socket.sendMessage(message);
}

// TODO: move it to ui.js
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
        toUserId: selectedUser.id, // TODO: this will be null if this chat room has only one user
        text: `${currentUser.email} has left the chat`,
        date: new Date(),
        chatRoomId: currentChatRoomId,
      };
      sendMessageToServer(msg);
      chatRooms = chatRooms.removeChatRoomById(currentChatRoomId);
      console.log("chatRooms", chatRooms);
      chatRooms.setCurrentChatRoom(null);
      emptyMessageContainer();
      setTextInChatTitle("");
      clearChatRoomContainer();
      populateChatRooms();
    }
  } catch (error) {
    console.error(error);
    alert("Could not leave chat room");
  }
});
