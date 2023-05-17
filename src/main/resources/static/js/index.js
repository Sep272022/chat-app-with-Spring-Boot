
const userNameSpan = document.getElementById("#user-name");

function getCurrentUser() {
  fetch("/users/current").then(res => {
    console.log('/users/current',res);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Could not get user");
    }
  }).then(user => {
    console.log('user',user);
    userNameSpan.innerHTML = user.name;
  }).catch(err => {
    console.error(err);
    // window.location.href = "/error.html";
  });
}

getCurrentUser();
