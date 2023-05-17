
const userNameSpan = document.querySelector("#user-name");

function getCurrentUser() {
  fetch("/users/current").then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Could not get user");
    }
  }).then(user => {
    userNameSpan.innerHTML = user.username;
  }).catch(err => {
    console.error(err);
    window.location.href = "/error.html";
  });
}

getCurrentUser();
