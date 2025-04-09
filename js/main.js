// main.js
import { initGrid } from './grid.js';
import { initLogic } from './logic.js';
import { formatTime } from './utils.js';
import { gameState } from './gameState.js';

let interval;
let hintTimeout;

export function updateScoreUI() {
  document.getElementById('score').innerText = gameState.score; // Cập nhật điểm số hiển thị
}

function updateHintUI() {
  document.getElementById('hint-count').innerText = gameState.hintCount; // Cập nhật hiển thị lượt gợi ý
}

function updateTimerUI() {
  document.getElementById('timer').innerText = formatTime(gameState.timer);
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    gameState.timer--;
    updateTimerUI();
    if (gameState.timer <= 0) {
      clearInterval(interval);
      alert('Thời gian đã hết!');
    }
  }, 1000);
}

function restartGame() {
  gameState.isLocked = false; // Đặt lại trạng thái khóa click
  gameState.score = 0; // Đặt lại điểm về 0
  gameState.timer = 600; // Reset timer
  gameState.hintCount = 3; // Đặt lại lượt gợi ý
  updateScoreUI(); // Cập nhật điểm hiển thị
  updateHintUI(); // Cập nhật lượt gợi ý hiển thị
  initGrid(); // Khởi tạo lưới game
  initLogic(); // Khởi tạo logic game
  startTimer(); // Bắt đầu bộ đếm thời gian
}

function showHint() {
  if (gameState.hintCount > 0 && !gameState.isLocked) {
    gameState.isLocked = true; // Khóa click
    gameState.timer = 600; // Reset timer
    updateTimerUI(); // Cập nhật hiển thị thời gian
    
    gameState.hintCount--; // Giảm số lượt gợi ý
    updateHintUI(); // Cập nhật hiển thị lượt gợi ý

    const hiddenTiles = document.querySelectorAll('.tile.hidden');
    hiddenTiles.forEach(tile => {
      tile.classList.remove('hidden'); // Hiển thị tất cả các ô
    });

    clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
      document.querySelectorAll('.tile:not(.matched)').forEach(tile => {
        tile.classList.add('hidden'); // Ẩn lại các ô không khớp
      });
      gameState.isLocked = false; // Mở khóa click sau khi gợi ý kết thúc
    }, 5000);
  } else if (gameState.hintCount <= 0) {
    alert('Bạn đã hết lượt gợi ý!'); // Thông báo hết lượt gợi ý
  }
}

// Gắn sự kiện cho các nút
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('hint-btn').addEventListener('click', showHint);

// Khởi chạy game ban đầu
restartGame();
