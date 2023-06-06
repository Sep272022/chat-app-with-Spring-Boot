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
  registerClickListenerOnLeaveButton,
  enableLeaveButton,
  disableLeaveButton,
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
    console.log("allUsers", allUsers);
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
  // let chatRoomName = getChatRoomName(chatRoom)
  let chatRoomName = chatRooms.getChatRoomById(chatRoom.id).getName();
  let chatRoomRow = document.createElement("div");
  chatRoomRow.classList.add("d-flex", "justify-content-between");
  chatRoomRow.innerHTML = `
        <input type="radio" class="btn-check" name="talk-partners" id="${chatRoom.id}" autocomplete="off" checked>
        <label class="btn btn-outline-primary w-100" for="${chatRoom.id}">${chatRoomName}</label>
      `;

  chatRoomRow.addEventListener("click", () => {
    selectedUser = chatRoom.members.find(
      (member) => member.id !== currentUser.id
    );
    setTextInChatTitle(chatRoomName);
    emptyMessageContainer();
    chatRoom.messages.forEach((message) => {
      addMessageToMessageContainer(message.fromUser?.email, message);
    });
    chatRooms.setCurrentChatRoom(new ChatRoom(chatRoom));
    enableLeaveButton();
  });
  prependChatRoomToChatRoomContainer(chatRoomRow);
  return chatRoomRow;
}

function sendMessageToServer(message) {
  socket.sendMessage(message);
}

registerClickListenerOnLeaveButton(async () => {
  let currentChatRoomId = chatRooms.getCurrentChatRoom().id;
  try {
    leaveChatRoom(currentChatRoomId);
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
  disableLeaveButton();
  emptyMessageContainer();
  setTextInChatTitle("");
  clearChatRoomContainer();
  populateChatRooms();
}
