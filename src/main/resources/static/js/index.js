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
  clearMessageInput,
  prependChatRoomToChatRoomContainer,
  clearChatRoomContainer,
  registerClickListenerOnLeaveButton,
  enableLeaveButton,
} from "./ui.js";
import { APIClient } from "./utils/apiClient.js";

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
    let returnedChatRooms = await APIClient.getChatRoomsByUserId(
      currentUser.id
    );
    returnedChatRooms.forEach((chatRoom) => {
      if (chatRoom == null) return;
      let chatRoomObj = new ChatRoom(chatRoom);
      chatRooms.addChatRoom(chatRoomObj);
      chatRoomObj.setButtonDomElement(addChatRoomButton(chatRoom));
      chatRooms.setCurrentChatRoom(chatRoomObj);
      enableLeaveButton();
    });
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
    allUsers = await APIClient.getAllUsers();
    console.table("allUsers", allUsers);
    fillUserRows(allUsers);
  } catch (error) {
    console.error(error);
    alert("Could not get users");
  }
}

function fillUserRows(users) {
  users.forEach((user) => {
    if (user.email === currentUser.email) return;
    let userRow = createUserRow(user);
    modalBodyAllUsers.appendChild(userRow);
  });
}

function createUserRow(user) {
  let userRow = document.createElement("div");
  userRow.classList.add("row");
  userRow.innerHTML = `
          <input type="radio" class="btn-check" name="user-radio-button" id="${user.id}" autocomplete="off">
          <label class="btn btn-outline-primary w-100" for="${user.id}">${user.email}</label>
        `;
  return userRow;
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

async function addChatRoomWith(user) {
  const chatRooom = {
    name: "",
    members: [currentUser, user],
    messages: [],
  };
  try {
    let res = await APIClient.createChatRoom(chatRooom);
    let returnedChatRoom = new ChatRoom(res);
    chatRooms.addChatRoom(returnedChatRoom);
    addChatRoomButton(returnedChatRoom);
  } catch (error) {
    console.error(error);
    alert("Could not create chat room");
  }
}

function addChatRoomButton(chatRoom) {
  let chatRoomName = chatRooms.getChatRoomById(chatRoom.id).getName();
  let chatRoomRow = createChatRoomRow(chatRoom.id, chatRoomName);

  chatRoomRow.addEventListener("click", () => {
    handleChatRoomRowClick(chatRoom, chatRoomName);
  });
  prependChatRoomToChatRoomContainer(chatRoomRow);
  chatRoomRow.click();
  return chatRoomRow;
}

function createChatRoomRow(chatRoomId, chatRoomName) {
  let chatRoomRow = document.createElement("div");
  chatRoomRow.classList.add("d-flex", "justify-content-between");
  chatRoomRow.innerHTML = `
    <input type="radio" class="btn-check" name="talk-partners" id="${chatRoomId}" autocomplete="off" checked>
    <label class="btn btn-outline-primary w-100" for="${chatRoomId}">${chatRoomName}</label>
  `;
  return chatRoomRow;
}

function handleChatRoomRowClick(chatRoom, chatRoomName) {
  selectedUser = chatRoom.members.find(
    (member) => member.id !== currentUser.id
  );
  setTextInChatTitle(chatRoomName);
  emptyMessageContainer();
  addMessagesToMessageContainer(chatRoom.members, chatRoom.messages);
  chatRooms.setCurrentChatRoom(new ChatRoom(chatRoom));
  enableLeaveButton();
  console.log("currentChatRoom changed: ", chatRooms.getCurrentChatRoom().id);
}

function addMessagesToMessageContainer(chatRoomMembers, chatRoomMessages) {
  chatRoomMessages.forEach((message) => {
    let fromUser = chatRoomMembers.find(
      (member) =>
        member.id === message.fromUserId || member.id === message.fromUser?.id
    );
    addMessageToMessageContainer(fromUser?.email, message);
  });
}

function sendMessageToServer(message) {
  socket.sendMessage(message);
}

registerClickListenerOnLeaveButton(async () => {
  let currentChatRoomId = chatRooms.getCurrentChatRoom()?.id;
  if (currentChatRoomId === undefined) return;
  try {
    await leaveChatRoom(currentChatRoomId);
    updateUIAfterLeaving();
  } catch (error) {
    console.error(error);
    alert("Could not leave chat room");
  }
});

async function leaveChatRoom(chatRoomId) {
  await APIClient.leaveChatRoomByUesrIdAndRoomId(currentUser.id, chatRoomId);
  let msg = createLeavingMessage(chatRoomId);
  sendMessageToServer(msg);
  chatRooms.removeChatRoomById(chatRoomId);
}

function createLeavingMessage(chatRoomId) {
  return {
    fromUserId: currentUser.id,
    toUserId: selectedUser.id, // TODO: this will be null if this chat room has only one user
    text: `${currentUser.email} has left the chat`,
    date: new Date(),
    chatRoomId: chatRoomId,
  };
}

function updateUIAfterLeaving() {
  chatRooms.setCurrentChatRoom(null);
  updateUIAfterLeaving();
}
