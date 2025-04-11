// main.js

import { initGrid } from './grid.js';
import { initLogic } from './logic.js';
import { formatTime } from './utils.js';
import { gameState, DEFAULT_TIMER } from './gameState.js';
import { drawLineBetweenTiles } from './canvas.js';
import {
  updateScore,
  updateTimer,
  updateHint,
  startHintCountdown,
} from './ui.js';
import { showLevelStartOverlay } from './ui.js';

let interval;
let roundsWon = 0; // Số vòng đã thắng liên tiếp
let gridSize = 2; // Kích thước lưới khởi đầu là 2x2

// Tự động scale game theo kích thước màn hình
function autoScaleGame() {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const baseWidth = 960;
  const baseHeight = 720;

  const scaleX = screenWidth / baseWidth;
  const scaleY = screenHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  gameContainer.style.transform = `scale(${scale})`;
  gameContainer.style.transformOrigin = 'top left';

  const offsetX = (screenWidth - baseWidth * scale) / 2;
  const offsetY = (screenHeight - baseHeight * scale) / 2;
  gameContainer.style.position = 'absolute';
  gameContainer.style.left = `${offsetX}px`;
  gameContainer.style.top = `${offsetY}px`;
}

// Bắt đầu đếm thời gian (mỗi giây trừ 1)
function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    gameState.timer--;
    updateTimer(gameState.timer, formatTime);
    if (gameState.timer <= 0) {
      clearInterval(interval);
      alert('⏰ Thời gian đã hết!');
    }
  }, 1000);
}

// Khởi động lại game toàn bộ
function restartGame() {
  gameState.level = 1;
  gridSize = 2;
  roundsWon = 0;

  setupLevel();
}

// Cài đặt level hiện tại
function setupLevel() {
  gameState.isLocked = false;
  gameState.score = 0;
  gameState.timer = DEFAULT_TIMER;
  gameState.hintCount = gameState.defaultHintCount;

  updateScore(gameState.score);
  updateHint(gameState.hintCount);
  updateTimer(gameState.timer, formatTime);

  initGrid(gridSize); // Truyền gridSize tùy vào level
  initLogic();
  startTimer();
  showLevelStartOverlay(
    gameState.level,
    gameState.score,
    gameState.hintCount,
    gameState.timer
  );
}

// Gợi ý 1 cặp hình giống nhau
function showHint() {
  if (gameState.isLocked) {
    alert('⛔ Đừng bấm quá nhanh!');
    return;
  }

  if (gameState.hintCount > 0) {
    gameState.isLocked = true;
    gameState.hintCount--;
    updateHint(gameState.hintCount);

    const tiles = document.querySelectorAll('.tile.hidden');
    let foundHint = false;
    let hintTile1 = null;
    let hintTile2 = null;

    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i].dataset.imgId === tiles[j].dataset.imgId) {
          hintTile1 = tiles[i];
          hintTile2 = tiles[j];
          foundHint = true;
          break;
        }
      }
      if (foundHint) break;
    }

    if (!foundHint) {
      alert('❌ Không còn cặp nào để gợi ý!');
      gameState.isLocked = false;
      return;
    }

    tiles.forEach((tile) => tile.classList.remove('hidden'));

    startHintCountdown(() => {
      tiles.forEach((tile) => {
        if (tile !== hintTile1 && tile !== hintTile2) {
          tile.classList.add('hidden');
        }
      });

      hintTile1.classList.remove('hidden');
      hintTile2.classList.remove('hidden');

      drawLineBetweenTiles(hintTile1, hintTile2);

      gameState.isLocked = false;
    });
  } else {
    alert('💡 Bạn đã hết lượt gợi ý!');
  }
}

// Khi thắng 1 màn sẽ gọi hàm này
export function onLevelComplete() {
  roundsWon++;
  if (roundsWon >= 3 && gridSize < 12) {
    gridSize += 2;
    roundsWon = 0;
  }
  gameState.level++;
  setupLevel();
}

// Gán sự kiện nút

document.getElementById('restart-btn')?.addEventListener('click', restartGame);
document.getElementById('hint-btn')?.addEventListener('click', showHint);

// Auto scale khi resize
window.addEventListener('resize', autoScaleGame);

// Khi DOM đã sẵn sàng, bắt đầu game

document.addEventListener('DOMContentLoaded', () => {
  autoScaleGame();
  restartGame();
});
