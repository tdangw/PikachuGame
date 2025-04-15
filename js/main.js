// main.js - Xử lý chính game flow, gợi ý, khởi động level

import { createGrid } from './grid.js';
import {
  updateLevelDisplay,
  updateScoreDisplay,
  updateHintDisplay,
  showBonusOverlay,
} from './ui.js';
import { gameState, resetGame } from './gameState.js';
import { applySettingsAndStartGame } from './settings.js';
import { checkLevelComplete, initLogic } from './logic.js';

// Giao diện khi load
import { createMainMenu } from './mainmenu.js';
window.onload = () => createMainMenu();

/**
 * Khởi tạo màn chơi tương ứng với level
 */
export function initializeLevel(level) {
  console.log(`[🧩 INIT] Tạo lưới cho level ${level}`);

  gameState.currentLevel = level;

  // Hiển thị container chơi game
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) gameContainer.style.display = 'flex';

  updateLevelDisplay(level);
  updateScoreDisplay(gameState.score);
  updateHintDisplay(gameState.hints || 0);

  const gridSize = Math.min(level, 12);
  createGrid(gridSize);
  initLogic(); // ✅ Gắn sự kiện click vào ô
}

/**
 * Chuyển sang màn tiếp theo
 */
export function nextLevel() {
  gameState.currentLevel++;
  console.log(`[📤 nextLevel()] Chuyển sang level ${gameState.currentLevel}`);
  initializeLevel(gameState.currentLevel);
}

/**
 * Tìm cặp để gợi ý khi người chơi bấm nút "Gợi ý"
 */
function handleHintClick() {
  if (!gameState.hints || gameState.hints <= 0) {
    showBonusOverlay('🚫 Hết lượt gợi ý!');
    return;
  }

  const tiles = document.querySelectorAll('.tile:not(.matched)');
  const tilePairs = {};

  tiles.forEach((tile) => {
    const imageId = tile.dataset.imageId;
    if (!tilePairs[imageId]) {
      tilePairs[imageId] = [tile];
    } else {
      tilePairs[imageId].push(tile);
    }
  });

  for (let imageId in tilePairs) {
    if (tilePairs[imageId].length >= 2) {
      const [t1, t2] = tilePairs[imageId];

      simulateTileMatch(t1, t2);

      gameState.hints--;
      updateHintDisplay(gameState.hints);
      return;
    }
  }

  showBonusOverlay('😕 Không tìm thấy cặp nào để gợi ý!');
}

/**
 * Gợi ý: Tự động ghép cặp 2 ô
 */
function simulateTileMatch(tile1, tile2) {
  const img1 = tile1.querySelector('img');
  const img2 = tile2.querySelector('img');

  if (img1) img1.classList.remove('hidden');
  if (img2) img2.classList.remove('hidden');

  tile1.classList.add('matched');
  tile2.classList.add('matched');

  gameState.score += 20;
  updateScoreDisplay(gameState.score);

  checkLevelComplete(); // ✅ kiểm tra xem đã hoàn thành màn chưa
}

/**
 * Gán sự kiện xác nhận cài đặt nếu tồn tại nút
 */
const confirmBtn = document.getElementById('confirm-settings-btn');
if (confirmBtn) {
  confirmBtn.onclick = () => {
    gameState.hints = 30;
    applySettingsAndStartGame();
  };
}

/**
 * Gán sự kiện nút bắt đầu lại
 */
const restartBtn = document.getElementById('btn-restart');
if (restartBtn) {
  restartBtn.onclick = () => {
    resetGame();
    initializeLevel(1);
  };
}

/**
 * Gán sự kiện nút gợi ý
 */
const hintBtn = document.getElementById('btn-hint');
if (hintBtn) {
  hintBtn.onclick = handleHintClick;
}
