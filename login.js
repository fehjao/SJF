const hints = [
  'A pessoa que eu gosto muito',
  'A pessoa que eu mais gosto',
  'A verdadeira identidade da Minititi',
  'Quem é minha pessoa preferida'
];

const hintText = document.getElementById('hint-text');
const loginButton = document.getElementById('login-button');
const passwordInput = document.getElementById('password-input');
const errorMessage = document.getElementById('error-message');

function showRandomHint() {
  const randomIndex = Math.floor(Math.random() * hints.length);
  const randomHint = hints[randomIndex];
  hintText.textContent = 'Dica: ' + randomHint;
}

function checkPassword() {
  const value = passwordInput.value;

  if (value.toLowerCase() === 'fernanda') {
    window.location.href = 'home.html';
  } else {
    errorMessage.style.visibility = 'visible';
  }
}

showRandomHint();
loginButton.addEventListener('click', checkPassword);