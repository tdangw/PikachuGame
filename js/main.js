// main.js

// Khởi tạo grid và logic chính
import { initGrid } from './grid.js';
import { initLogic } from './logic.js';
import { formatTime } from './utils.js';
import { gameState, DEFAULT_TIMER } from './gameState.js';
import { drawLineBetweenTiles } from './canvas.js';
import { goToNextLevel } from './logic.js';

import {
  updateScore,
  updateTimer,
  updateHint,
  startHintCountdown,
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  goToNextLevel(true); // Bắt đầu từ level 1
});
autoScaleGame();
window.addEventListener('resize', autoScaleGame);

let interval;

// Bắt đầu đếm thời gian (đếm ngược mỗi giây)
function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    gameState.timer--;
    updateTimer(gameState.timer, formatTime);
    if (gameState.timer <= 0) {
      clearInterval(interval);
      alert('Thời gian đã hết!');
    }
  }, 1000);
}

// Khởi động lại game
function restartGame() {
  gameState.isLocked = false;
  gameState.score = 0;
  gameState.timer = DEFAULT_TIMER;
  gameState.hintCount = gameState.defaultHintCount;

  updateScore(gameState.score);
  updateHint(gameState.hintCount);
  updateTimer(gameState.timer, formatTime);

  initGrid(); // Tạo lại lưới
  initLogic(); // Kích hoạt lại logic chọn hình
  startTimer(); // Bắt đầu lại đồng hồ
}

// Hiển thị gợi ý (highlight 1 cặp hình giống nhau)
function showHint() {
  if (gameState.isLocked) {
    alert('Đừng bấm quá nhanh!');
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

    // Tìm 1 cặp hình giống nhau chưa lật
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

    // Nếu không tìm được cặp nào
    if (!foundHint) {
      alert('Không còn cặp nào để gợi ý!');
      gameState.isLocked = false;
      return;
    }

    // Hiện tất cả hình tạm thời
    tiles.forEach((tile) => tile.classList.remove('hidden'));

    // Bắt đầu đếm ngược gợi ý (mặc định là 5s)
    startHintCountdown(() => {
      tiles.forEach((tile) => {
        if (tile !== hintTile1 && tile !== hintTile2) {
          tile.classList.add('hidden');
        }
      });

      // Giữ lại 2 hình được gợi ý
      hintTile1.classList.remove('hidden');
      hintTile2.classList.remove('hidden');

      drawLineBetweenTiles(hintTile1, hintTile2);

      gameState.isLocked = false;
    });
  } else {
    alert('Bạn đã hết lượt gợi ý!');
  }
}

// Gán sự kiện cho nút Restart và Hint
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('hint-btn').addEventListener('click', showHint);

// Tự động scale game theo kích thước màn hình
function autoScaleGame() {
  const gameContainer = document.getElementById('game-container');
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Tính tỉ lệ scale dựa trên thiết kế gốc (ví dụ khung gốc là 960x720)
  const baseWidth = 960;
  const baseHeight = 720;

  const scaleX = screenWidth / baseWidth;
  const scaleY = screenHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY); // Giữ đúng tỉ lệ không méo hình

  gameContainer.style.transform = `scale(${scale})`;
  gameContainer.style.transformOrigin = 'top left';

  // Căn giữa màn hình (nếu muốn)
  const offsetX = (screenWidth - baseWidth * scale) / 2;
  const offsetY = (screenHeight - baseHeight * scale) / 2;
  gameContainer.style.position = 'absolute';
  gameContainer.style.left = `${offsetX}px`;
  gameContainer.style.top = `${offsetY}px`;
}

// Bắt đầu game lần đầu
restartGame();
