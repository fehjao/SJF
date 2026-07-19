const faqData = [
  {
    question: 'E se eu me cansar?',
    answer: 'Eu não vou me cansar.'
  },
  {
    question: 'E se você me machucar?',
    answer: 'Me avise, eu prometo tentar melhorar.'
  },
  {
    question: 'E se eu te machucar?',
    answer: 'Vamos conversar, a gente se ajeita.'
  },
  {
    question: 'O que você quer?',
    answer: 'Você, mas acima disso, você bem.'
  },
  {
    question: 'Você me espera?',
    answer: 'Sim, com muito desejo, mas sim.'
  },
  {
    question: 'E se minha vida tiver uma bagunça?',
    answer: 'Eu não quero você pronta ou perfeita, eu quero você do jeito que é.'
  },
  {
    question: 'E se eu cair?',
    answer: 'Eu vou te segurar.'
  },
  {
    question: 'E se eu chorar?',
    answer: 'Eu vou te abraçar.'
  },
  {
    question: 'E se eu me achar encostada?',
    answer: 'Eu vou insistir que você é a jovem mais independente, responsável e madura que eu conheço.'
  },
  {
    question: 'O que você acha dos meus problemas?',
    answer: 'Você não tem culpa deles, por mais que acredite ter.'
  },
  {
    question: 'Quem eu sou?',
    answer: 'Uma mulher incrível, forte, responsável, dedicada, esforçada e que se preocupa com as pessoas próximas.'
  },
  {
    question: 'O que você acha de mim?',
    answer: 'Linda, sensível, empática e tem um coração muito bom.'
  },
  {
    question: 'O que você quer de mim?',
    answer: 'Viver ao seu lado, independente da situação.'
  },
  {
    question: 'Qual seu maior objetivo?',
    answer: 'Te fazer feliz.'
  },
  {
    question: 'Quais os benefícios do seu plano?',
    answer: 'Cobertura de carinho em toda região do seu Coração.'
  },
  {
    question: 'Quanto tempo dura o seu plano?',
    answer: 'Não tem limite de uso, sempre vou amar seus carinhos.'
  }
];

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