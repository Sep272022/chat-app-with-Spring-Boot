

function validateUserForm() {
  let name = document.forms["userForm"]["name"].value;
  if (name == '') {
    alert("Name must be filled out");
    return false;
  }
}

const emailCheckSuccess = document.querySelector('#check-success');
emailCheckSuccess.hidden = true;
const emailCheckFailure = document.querySelector('#check-failure');
emailCheckFailure.hidden = true;

const checkButton = document.querySelector('#check-button');
checkButton.addEventListener('click', (e) => {
  let email = document.forms["userForm"]["email"].value;
  checkEmailAvailable(email);
});

function checkEmailAvailable(email) {
  fetch("/check_email?email=" + email)
  .then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("User email is not available");
    }
  }).then(inUse => {
    if (inUse) {
      emailCheckSuccess.hidden = false;
      emailCheckFailure.hidden = true;
    } else {
      emailCheckSuccess.hidden = true;
      emailCheckFailure.hidden = false;
    }
  }).catch(err => {
    alert(err.message);
  });
}
