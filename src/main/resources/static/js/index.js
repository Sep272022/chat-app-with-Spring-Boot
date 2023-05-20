const userNameSpan = document.querySelector("#user-name");

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
      userNameSpan.innerHTML = `${user.username} (${user.authorities[0].authority})`;
    })
    .catch((err) => {
      console.error(err);
      window.location.href = "/error";
    });
}
getCurrentUser();

const modalBodyAllUsers = document.querySelector("#modal-body-all-users");
function fillUsers() {
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
        let userRow = document.createElement("button");
        userRow.innerHTML = user.username;
        modalBodyAllUsers.appendChild(userRow);
      });
    });
}

let modalId = document.getElementById("modalId");
modalId.addEventListener("show.bs.modal", (event) => {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let recipient = button.getAttribute("data-bs-whatever");

  // Use above variables to manipulate the DOM
});
