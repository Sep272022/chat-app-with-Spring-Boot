

const registerButton = document.querySelector('#register-button');
registerButton.addEventListener('click', (e) => {
  validateUserForm();
});


function validateUserForm() {
  let name = document.forms["userForm"]["name"].value;
  if (name == '') {
    alert("Name must be filled out");
    return false;
  }
}