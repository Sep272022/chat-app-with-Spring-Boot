import { getFormattedTime } from "./utils/time.js";

const messageContainer = document.querySelector("#message-container");
const chatTitle = document.querySelector("#chat-title");
const messageInput = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const chatRoomContainer = document.querySelector("#conversation-container");
const userNameSpan = document.querySelector("#user-name");

export function setTextInMessageContainer(text) {
  messageContainer.textContent = text;
}

export function emptyMessageContainer() {
  messageContainer.textContent = "";
}

export function addMessageToMessageContainer(senderName, message) {
  let messageRow = document.createElement("div");
  messageRow.classList.add("p-2");

  let messageTitle = document.createElement("div");
  messageTitle.classList.add("fw-bold");
  messageTitle.innerHTML = `${senderName} (${getFormattedTime(
    message.date
  )}): `;

  let messageText = document.createElement("span");
  messageText.textContent = `${message.text}`;

  messageRow.appendChild(messageTitle);
  messageRow.appendChild(messageText);
  messageContainer.appendChild(messageRow);
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
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

document.addEventListener("keydown", (event) => {
  if (document.activeElement === messageInput && event.key === "Enter") {
    sendButton.click();
  }
});
