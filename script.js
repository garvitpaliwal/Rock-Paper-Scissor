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

// Load scores from localStorage or initialize
let playerScore = Number(localStorage.getItem('playerScore')) || 0;
let computerScore = Number(localStorage.getItem('computerScore')) || 0;

playerScoreElem.textContent = playerScore;
computerScoreElem.textContent = computerScore;

// Mapping choice to image and css class for border color
const choiceMap = {
  rock: { image: 'rock.png', class: 'rock-circle' },
  paper: { image: 'paper.png', class: 'paper-circle' },
  scissors: { image: 'scissor.png', class: 'scissors-circle' }
};

// Helper to save scores to localStorage
function saveScores() {
  localStorage.setItem('playerScore', playerScore);
  localStorage.setItem('computerScore', computerScore);
}

// Random computer choice
function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

// Determine winner: Returns 'player', 'computer', or 'tie'
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

// ✅ NEW FUNCTION — to show winner glow animation
function showWinnerAnimation(winnerElement, color) {
  winnerElement.style.setProperty('--ripple-color', color);
  winnerElement.classList.add('winner');

  setTimeout(() => {
    winnerElement.classList.remove('winner');
  }, 1500);
}

// Update the displayed choice with image and styling (DOES NOT toggle winner class)
function updateChoiceDisplay(element, choice /* string */) {
  // clear previous content
  element.innerHTML = '';

  // create the choice circle (existing structure)
  const div = document.createElement('div');
  div.classList.add('choice-circle', choiceMap[choice].class);
  
  // Create img element instead of emoji
  const img = document.createElement('img');
  img.src = choiceMap[choice].image;
  img.alt = choice;
  
  div.appendChild(img);
  element.appendChild(div);

  // create/ensure the third ring placeholder (used by CSS .ring-three)
  // remove if existing and add fresh (keeps things clean)
  const existingRing = element.querySelector('.ring-three');
  if (existingRing) existingRing.remove();

  const ring3 = document.createElement('span');
  ring3.classList.add('ring-three');
  // ring3 is empty; CSS will style it via .choice-display.winner .ring-three
  element.appendChild(ring3);
}


// Show result message based on winner
function showResultMessage(winner) {
  if (winner === 'player') {
    resultText.innerHTML = 'YOU WIN<br>AGAINST PC';
  } else if (winner === 'computer') {
    resultText.innerHTML = 'YOU LOSE<br>AGAINST PC';
  } else {
    resultText.innerHTML = 'IT\'S A TIE';
  }
}

// Handle user's choice click
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

  // inside choicesSection click handler, after you determine winner and updated scores:
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

// Play again resets views but keeps scores
playAgainBtn.addEventListener('click', () => {
  resultSection.style.display = 'none';
  choicesSection.style.display = 'flex';
  nextBtn.classList.remove('show');
});

// NEXT button shows Hurray section after win
nextBtn.addEventListener('click', () => {
  resultSection.style.display = 'none';
  hurraySection.style.display = 'flex';
  nextBtn.classList.remove('show');
});

// Play again from Hurray resets views but keeps scores
hurrayPlayAgainBtn.addEventListener('click', () => {
  hurraySection.style.display = 'none';
  choicesSection.style.display = 'flex';
});

// Rules popup show/hide
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
  // set the CSS variable for color (allow alpha by passing rgba or hex)
  winnerElement.style.setProperty('--ripple-color', color);

  // ensure no leftover class or animation
  winnerElement.classList.remove('winner');

  // force reflow to restart animation reliably
  // eslint-disable-next-line no-unused-expressions
  void winnerElement.offsetWidth;

  // add winner class to trigger the three-ring animation
  winnerElement.classList.add('winner');

  // We will remove the class when the last animation finishes.
  // Listen for animationend on the .ring-three element (most delayed)
  const ring3 = winnerElement.querySelector('.ring-three');

  // Fallback: if ring3 missing, remove after 1400ms
  let removed = false;
  function cleanUp() {
    if (removed) return;
    removed = true;
    winnerElement.classList.remove('winner');
    winnerElement.removeEventListener('animationend', onAnimEnd);
  }

  function onAnimEnd(e) {
    // Only respond to our ripple animation (keyframes name)
    if (e.animationName === 'ripple-scale') {
      // we wait until the event target is the ring-three or the last pseudo — safe to cleanup
      cleanUp();
    }
  }

  // attach listener to element (animationend bubbles from pseudo-elements too in many browsers,
  // but to be robust we also attach to ring3 if present)
  winnerElement.addEventListener('animationend', onAnimEnd);
  if (ring3) ring3.addEventListener('animationend', onAnimEnd);

  // Safety net in case animationend doesn't fire: remove after 1600ms
  setTimeout(cleanUp, 1600);
}