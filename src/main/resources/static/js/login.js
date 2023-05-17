
console.log('login.js loaded');

const registerButton = document.querySelector('#register-button');
registerButton.addEventListener('click', () => {
  window.location.href = '/register';
});
