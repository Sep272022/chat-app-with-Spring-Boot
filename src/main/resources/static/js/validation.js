

let registerButton = document.querySelector('#register-button');
registerButton.addEventListener('click', (e) => {
  if (!validateUserForm()) {
    e.preventDefault();
  }
})

function validateUserForm() {
  let email = document.forms["userForm"]["user-email"].value;
  let password = document.forms["userForm"]["password"].value;
  let confirmPassword = document.forms["userForm"]["confirm"].value;
  if (email == '') {
    alert("Email address must be filled out");
    return false;
  }
  if (password == '') {
    alert("Password must be filled out");
    return false;
  }
  if (confirmPassword == '') {
    alert("Confirm password must be filled out");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return false;
  }
  return true;
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
        throw new Error("Error occurred while checking email");
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


const passwordConfirm = document.querySelector('#confirm');
const passwordMatched = document.querySelector('#passwords-matched');
passwordConfirm.addEventListener('keyup', (e) => {
  let password = document.forms["userForm"]["password"].value;
  let confirmPassword = document.forms["userForm"]["confirm"].value;
  if (password === confirmPassword) {
    passwordMatched.innerHTML = 'Passwords matched';
    passwordMatched.classList.add('text-success');
    passwordMatched.classList.remove('text-danger');
  } else {
    passwordMatched.innerHTML = 'Passwords do not match';
    passwordMatched.classList.remove('text-success');
    passwordMatched.classList.add('text-danger');
  }
});
