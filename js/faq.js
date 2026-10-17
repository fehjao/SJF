const faqList = document.getElementById('faq-list');
const faqOverlay = document.getElementById('faq-overlay');
const faqAnswer = document.getElementById('faq-answer');
const faqCard = document.querySelector('.faq-card');

function openAnswer(answer) {
  faqAnswer.textContent = answer;
  faqOverlay.classList.add('open');
}

function closeAnswer() {
  faqOverlay.classList.remove('open');
}

function buildFaqList() {
  for (let i = 0; i < faqData.length; i++) {
    const item = faqData[i];

    const listItem = document.createElement('li');
    const button = document.createElement('button');

    button.classList.add('faq-question');
    button.textContent = item.question;
    button.addEventListener('click', function () {
      openAnswer(item.answer);
    });

    listItem.appendChild(button);
    faqList.appendChild(listItem);
  }
}

faqOverlay.addEventListener('click', function (event) {
  if (event.target === faqOverlay) {
    closeAnswer();
  }
});

faqCard.addEventListener('click', closeAnswer);

buildFaqList();