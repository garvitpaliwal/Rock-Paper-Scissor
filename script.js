const choicesSection = document.getElementById('choices-section');
const resultSection = document.getElementById('result-section');
const hurraySection = document.getElementById('hurray-section');
const playerScoreElem = document.getElementById('player-score');
const computerScoreElem = document.getElementById('computer-score');
const playerChoiceDisplay = document.getElementById('player-choice-display');
const computerChoiceDisplay = document.getElementById('computer-choice-display');
const resultText = document.getElementById('result-text');
const playAgainBtn = document.getElementById('play-again-btn');
const nextBtn = document.getElementById('next-btn');
const rulesBtn = document.getElementById('rules-btn');
const rulesPopup = document.getElementById('rules-popup');
const closeRulesBtn = document.getElementById('close-rules');
const hurrayPlayAgainBtn = document.getElementById('hurray-play-again');


const choices = ['rock', 'paper', 'scissors'];

let playerScore = Number(localStorage.getItem('playerScore')) || 0;
let computerScore = Number(localStorage.getItem('computerScore')) || 0;

playerScoreElem.textContent = playerScore;
computerScoreElem.textContent = computerScore;

const choiceMap = {
  rock: { image: 'rock.png', class: 'rock-circle' },
  paper: { image: 'paper.png', class: 'paper-circle' },
  scissors: { image: 'scissor.png', class: 'scissors-circle' }
};

function saveScores() {
  localStorage.setItem('playerScore', playerScore);
  localStorage.setItem('computerScore', computerScore);
}

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return 'tie';

  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'scissors' && computerChoice === 'paper') ||
    (playerChoice === 'paper' && computerChoice === 'rock')
  ) {
    return 'player';
  } else {
    return 'computer';
  }
}

function showWinnerAnimation(winnerElement, color) {
  winnerElement.style.setProperty('--ripple-color', color);
  winnerElement.classList.add('winner');

  setTimeout(() => {
    winnerElement.classList.remove('winner');
  }, 1500);
}

function updateChoiceDisplay(element, choice ) {
  element.innerHTML = '';

  const div = document.createElement('div');
  div.classList.add('choice-circle', choiceMap[choice].class);
  
  const img = document.createElement('img');
  img.src = choiceMap[choice].image;
  img.alt = choice;
  
  div.appendChild(img);
  element.appendChild(div);

  const existingRing = element.querySelector('.ring-three');
  if (existingRing) existingRing.remove();

  const ring3 = document.createElement('span');
  ring3.classList.add('ring-three');
  element.appendChild(ring3);
}

function showResultMessage(winner) {
  if (winner === 'player') {
    resultText.innerHTML = 'YOU WIN<br>AGAINST PC';
  } else if (winner === 'computer') {
    resultText.innerHTML = 'YOU LOSE<br>AGAINST PC';
  } else {
    resultText.innerHTML = 'IT\'S A TIE';
  }
}

choicesSection.addEventListener('click', (e) => {
  const btn = e.target.closest('button.choice-btn');
  if (!btn) return;

  const playerChoice = btn.getAttribute('data-choice');
  const computerChoice = getComputerChoice();

  const winner = determineWinner(playerChoice, computerChoice);

  if (winner === 'player') playerScore++;
  else if (winner === 'computer') computerScore++;

  saveScores();

  playerScoreElem.textContent = playerScore;
  computerScoreElem.textContent = computerScore;

  choicesSection.style.display = 'none';
  resultSection.style.display = 'block';

  updateChoiceDisplay(playerChoiceDisplay, playerChoice);
  updateChoiceDisplay(computerChoiceDisplay, computerChoice);

  showResultMessage(winner);

  if (winner === 'player') {
    showWinnerAnimation(playerChoiceDisplay, 'rgba(50,168,82,0.45)'); // green
    nextBtn.classList.add('show');
  } else if (winner === 'computer') {
    showWinnerAnimation(computerChoiceDisplay, 'rgba(50,168,82,0.45)'); // always green
    nextBtn.classList.remove('show');
  } else {
    nextBtn.classList.remove('show');
  }

  playAgainBtn.style.display = 'inline-block';
});

playAgainBtn.addEventListener('click', () => {
  resultSection.style.display = 'none';
  choicesSection.style.display = 'flex';
  nextBtn.classList.remove('show');
});

nextBtn.addEventListener('click', () => {
  resultSection.style.display = 'none';
  hurraySection.style.display = 'flex';
  nextBtn.classList.remove('show');
});

hurrayPlayAgainBtn.addEventListener('click', () => {
  hurraySection.style.display = 'none';
  choicesSection.style.display = 'flex';
});

rulesBtn.addEventListener('click', () => {
  rulesPopup.classList.add('show');
});

closeRulesBtn.addEventListener('click', () => {
  rulesPopup.classList.remove('show');
});

rulesPopup.addEventListener('click', (e) => {
  if (e.target === rulesPopup) {
    rulesPopup.classList.remove('show');
  }
});

function showWinnerAnimation(winnerElement, color) {
  winnerElement.style.setProperty('--ripple-color', color);
  winnerElement.classList.remove('winner');
  void winnerElement.offsetWidth;
  winnerElement.classList.add('winner');
  const ring3 = winnerElement.querySelector('.ring-three');

  let removed = false;
  function cleanUp() {
    if (removed) return;
    removed = true;
    winnerElement.classList.remove('winner');
    winnerElement.removeEventListener('animationend', onAnimEnd);
  }

  function onAnimEnd(e) {
   
    if (e.animationName === 'ripple-scale') {
      cleanUp();
    }
  }

  winnerElement.addEventListener('animationend', onAnimEnd);
  if (ring3) ring3.addEventListener('animationend', onAnimEnd);

  setTimeout(cleanUp, 1600);

}
