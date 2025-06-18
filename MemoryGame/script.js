let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;
let score = 0;
let moves = 0;
let seconds = 0;
let timer;

function checkUser() {
  const user = localStorage.getItem('username');
  if (!user) {
    document.getElementById('login-modal').classList.remove('hidden');
  } else {
    document.getElementById('player-name').textContent = user;
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    loadBestScore();
  }
}

function saveUser() {
  const username = document.getElementById('username').value.trim();
  if (username !== "") {
    localStorage.setItem('username', username);
    checkUser();
  } else {
    alert("Please enter your name.");
  }
}

function loadBestScore() {
  const best = localStorage.getItem('bestScore');
  document.getElementById('best-score').textContent = best || 0;
}

function startGame() {
  const theme = document.getElementById('theme').value;
  const level = document.getElementById('level').value;

  totalPairs = level === 'easy' ? 4 : level === 'medium' ? 6 : 8;
  const images = [];
  for (let i = 1; i <= totalPairs; i++) {
    images.push(`assets/${theme}/${i}.png`);
  }

  const shuffled = shuffle([...images, ...images]);
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  matchedPairs = 0;
  score = 0;
  moves = 0;
  seconds = 0;
  updateStats();

  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    updateStats();
  }, 1000);

  board.style.gridTemplateColumns = `repeat(${Math.min(totalPairs, 4)}, 100px)`;

  shuffled.forEach(src => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.image = src;

    const img = document.createElement('img');
    img.src = src;
    card.appendChild(img);

    card.addEventListener('click', () => revealCard(card));
    board.appendChild(card);
  });

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function revealCard(card) {
  if (lockBoard || card.classList.contains('revealed')) return;

  card.classList.add('revealed');
  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;

  if (firstCard.dataset.image === secondCard.dataset.image) {
    matchedPairs++;
    score += 10;
    resetTurn();
    updateStats();

    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      saveBestScore();
      setTimeout(() => {
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('end-message').textContent =
          `🎉 You won! Score: ${score}, Moves: ${moves}, Time: ${seconds}s`;
        document.getElementById('end-screen').classList.remove('hidden');
      }, 500);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('revealed');
      secondCard.classList.remove('revealed');
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function restartGame() {
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
  loadBestScore();
}

function updateStats() {
  document.getElementById('score').textContent = score;
  document.getElementById('moves').textContent = moves;
  document.getElementById('time').textContent = `${seconds}s`;
  document.getElementById('progress').textContent =
    `${Math.round((matchedPairs / totalPairs) * 100)}%`;
}

function saveBestScore() {
  const best = localStorage.getItem('bestScore');
  if (!best || score > best) {
    localStorage.setItem('bestScore', score);
    alert('🎉 New High Score!');
  }
}

// Dark Mode Toggle
document.getElementById('darkToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

window.onload = checkUser;
