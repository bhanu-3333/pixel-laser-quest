const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const startBtn = document.getElementById('start-btn');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const quitBtn = document.getElementById('quit-btn');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');

let playerX = 375, playerY = 275;
let gameInterval, laserInterval, powerUpInterval;
let score = 0;
let time = 0;
let running = false;

const powerUps = [
  'assets/power1.png',
  'assets/power2.png',
  'assets/power3.png',
  'assets/power4.png',
  'assets/power5.png'
];

// Move player with arrow keys
document.addEventListener('keydown', (e) => {
  if (!running) return;
  const step = 10;
  if (e.key === 'ArrowUp' && playerY > 0) playerY -= step;
  if (e.key === 'ArrowDown' && playerY < 550) playerY += step;
  if (e.key === 'ArrowLeft' && playerX > 0) playerX -= step;
  if (e.key === 'ArrowRight' && playerX < 750) playerX += step;
  player.style.left = playerX + 'px';
  player.style.top = playerY + 'px';
});

// Create a neon laser
function createLaser() {
  const laser = document.createElement('div');
  laser.classList.add('laser');
  
  const isHorizontal = Math.random() > 0.5;
  if (isHorizontal) {
    laser.style.width = '800px';
    laser.style.height = '8px';
    laser.style.left = '0';
    laser.style.top = Math.random() * 600 + 'px';
  } else {
    laser.style.width = '8px';
    laser.style.height = '600px';
    laser.style.top = '0';
    laser.style.left = Math.random() * 800 + 'px';
  }

  gameArea.appendChild(laser);
  setTimeout(() => laser.remove(), 1000);

  checkLaserCollision(laser);
}

// Power-up spawn
function spawnPowerUp() {
  const powerUp = document.createElement('img');
  powerUp.classList.add('power-up');
  powerUp.src = powerUps[Math.floor(Math.random() * powerUps.length)];

  powerUp.style.left = Math.random() * 760 + 'px';
  powerUp.style.top = Math.random() * 560 + 'px';

  gameArea.appendChild(powerUp);

  const checkInterval = setInterval(() => {
    if (!running) { clearInterval(checkInterval); powerUp.remove(); return; }

    const powerRect = powerUp.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (
      playerRect.left < powerRect.right &&
      playerRect.right > powerRect.left &&
      playerRect.top < powerRect.bottom &&
      playerRect.bottom > powerRect.top
    ) {
      score += 10;
      scoreDisplay.textContent = `Score: ${score}`;
      powerUp.remove();
      clearInterval(checkInterval);
    }
  }, 100);
  
  setTimeout(() => {
    if (gameArea.contains(powerUp)) powerUp.remove();
  }, 5000);
}

// Laser collision check
function checkLaserCollision(laser) {
  const laserRect = laser.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  if (
    playerRect.left < laserRect.right &&
    playerRect.right > laserRect.left &&
    playerRect.top < laserRect.bottom &&
    playerRect.bottom > laserRect.top
  ) {
    endGame();
  }
}

// Start the game
function startGame() {
  running = true;
  score = 0;
  time = 0;
  startBtn.style.display = 'none';
  gameOverScreen.style.display = 'none';

  gameInterval = setInterval(() => {
    time++;
    timeDisplay.textContent = `Time: ${time}s`;
  }, 1000);

  laserInterval = setInterval(createLaser, 2000);
  powerUpInterval = setInterval(spawnPowerUp, 3000);
}

// End the game
function endGame() {
  running = false;
  clearInterval(gameInterval);
  clearInterval(laserInterval);
  clearInterval(powerUpInterval);
  finalScore.textContent = `Your Score: ${score} (Time: ${time}s)`;
  gameOverScreen.style.display = 'block';
}

// Restart
restartBtn.addEventListener('click', () => {
  window.location.reload();
});

// Quit
quitBtn.addEventListener('click', () => {
  window.location.reload();
});

startBtn.addEventListener('click', startGame);
