import { getFormattedTime } from "./utils/time.js";

const messageContainer = document.querySelector("#message-container");
const chatTitle = document.querySelector("#chat-title");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const chatRoomContainer = document.querySelector("#conversation-container");
const userNameSpan = document.querySelector("#user-name");
const leaveButton = document.querySelector("#leave-button");
const talkToButton = document.querySelector("#talk-to-button");

export function setTextInMessageContainer(text) {
  messageContainer.textContent = text;
}

export function emptyMessageContainer() {
  messageContainer.textContent = "";
}

export function addMessageToMessageContainer(senderName, message) {
  let messageRow = createMessageRow(senderName, message);
  messageContainer.appendChild(messageRow);
  // Scroll to bottom
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function createMessageRow(senderName, message) {
  let messageRow = document.createElement("div");
  messageRow.classList.add("p-2");
  let messageTitle = createMessageTitle(senderName, message);
  let messageText = createMessageText(message);

  messageRow.appendChild(messageTitle);
  messageRow.appendChild(messageText);
  return messageRow;
}

function createMessageTitle(senderName, message) {
  let messageTitle = document.createElement("div");
  messageTitle.classList.add("fw-bold");
  messageTitle.innerHTML = `
  ${senderName} (${getFormattedTime(message.date)}): `;
  return messageTitle;
}

function createMessageText(message) {
  let messageText = document.createElement("span");
  messageText.textContent = `${message.text}`;
  return messageText;
}

export function setTextInChatTitle(text) {
  chatTitle.textContent = text;
}

export function enableSendButton() {
  sendButton.disabled = false;
}

export function disableSendButton() {
  sendButton.disabled = true;
}

export function registerClickListenerOnSendButton(callback) {
  sendButton.addEventListener("click", callback);
}

export function getTextFromMessageInput() {
  return messageInput.value;
}

export function clearMessageInput() {
  messageInput.value = "";
}

export function setCurrentUserUI(user) {
  userNameSpan.innerHTML = `${user.email} (${user.roles[0].name})`;
}

export function clearChatRoomContainer() {
  chatRoomContainer.innerHTML = "";
}

export function prependChatRoomToChatRoomContainer(chatRoomRow) {
  chatRoomContainer.prepend(chatRoomRow);
}

export function disableLeaveButton() {
  leaveButton.disabled = true;
}

export function enableLeaveButton() {
  leaveButton.disabled = false;
}

export function registerClickListenerOnLeaveButton(callback) {
  leaveButton.addEventListener("click", callback);
}

export function eanbleTalkToButton() {
  talkToButton.disabled = false;
}

export function disableTalkToButton() {
  talkToButton.disabled = true;
}

export function updateUIAfterLeaving() {
  disableLeaveButton();
  emptyMessageContainer();
  setTextInChatTitle("");
  clearChatRoomContainer();
  populateChatRooms();
}

document.addEventListener("keydown", (event) => {
  if (document.activeElement === messageInput && event.key === "Enter") {
    sendButton.click();
  }
});
