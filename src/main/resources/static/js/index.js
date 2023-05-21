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

let stompClient = null;
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
  connect();
  establishConnection(stompClient);
  closeModal(modalNewConversation);
});

function establishConnection(stompClient) {
  stompClient.connect({}, (frame) => {
    console.log("Connected: " + frame);
    stompClient.subscribe(
      "/topic/messages",
      (message) => { // callback function for when a message is received from the server
        console.log("received message: " + message);
      },
      (error) => { // callback function for when an error is received from the server
        console.log("STOMP error: " + error);
      }
    );
  });
}

function connect() {
  // let socket = new WebSocket("ws://localhost:8080/app");
  let url = location.protocol + "//" + location.host + "/websocket-endpoint";
  let sockjs = new SockJS(url);
  stompClient = Stomp.over(sockjs);
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
    stompClient = null;
  }
}

function closeModal(modalToClose) {
  document.querySelector(".modal-backdrop.fade.show").classList.remove("show");
  modalToClose.style.display = "none";
}
