const userNameSpan = document.querySelector("#user-name");

let currentUser = null;
function getCurrentUser() {
  fetch("/users/current")
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Could not get user");
      }
    })
    .then((user) => {
      currentUser = user;
      userNameSpan.innerHTML = `${user.username} (${user.authorities[0].authority})`;
    })
    .catch((err) => {
      console.error(err);
      window.location.href = "/error";
    });
}
getCurrentUser();

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
        if (user.email === currentUser.username) return;
        let userRow = document.createElement("div");
        userRow.classList.add("row");
        userRow.innerHTML = `
          <input type="radio" class="btn-check" name="user-radio-button" id="${user.name}" autocomplete="off">
          <label class="btn btn-outline-primary w-100" for="${user.name}">${user.name}</label>
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

const talkButton = document.querySelector("#talk-button");
talkButton.addEventListener("click", (event) => {
  let selectedUser = document.querySelector(
    "input[name='user-radio-button']:checked"
  );
  if (selectedUser === null) {
    alert("Please select a user to talk to");
    return;
  }
  let selectedUserName = selectedUser.id;
  // let socket = new WebSocket("ws://localhost:8080/chat");
  let sockjs = new SockJS("/websocket-endpoint");
  stompClient = Stomp.over(sockjs);
  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);
    stompClient.subscribe("/topic/messages", (message) => {
      console.log("received message: " + message);
    });
  });
  closeModal(modalNewConversation);
});

function closeModal(modalToClose) {
  document.querySelector(".modal-backdrop.fade.show").classList.remove("show");
  modalToClose.style.display = "none";
}
