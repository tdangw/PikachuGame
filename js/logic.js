import { gameState } from './gameState.js';
import { updateScore, updateHint, updateTimer } from './ui.js';
import { drawLineBetweenTiles } from './canvas.js';
import { initGrid } from './grid.js';
import {
  showMatchOverlay,
  showLevelCompleteOverlay,
  showBonusOverlay,
  showLevelStartOverlay, // ⚠️ HÀM NÀY PHẢI RETURN OVERLAY ĐỂ REMOVE ĐƯỢC
} from './ui.js';

const DEFAULT_TIMER = 600;
const LEVEL_INTRO_DURATION = 3000;
const IMAGE_PREVIEW_DURATION = 3000;

let isLevelCompleted = false;
let selectedTiles = [];

/**
 * Khởi tạo logic bắt sự kiện click các ô
 */
export function initLogic() {
  const tiles = document.querySelectorAll('.tile');

  tiles.forEach((tile) => {
    // Xóa event listener cũ nếu có
    tile.replaceWith(tile.cloneNode(true));
  });

  const refreshedTiles = document.querySelectorAll('.tile');
  refreshedTiles.forEach((tile) => {
    tile.addEventListener('click', () => handleTileClick(tile));
  });
}

/**
 * Hàm xử lý khi click 1 ô
 */
function handleTileClick(tile) {
  if (
    gameState.isLocked ||
    tile.classList.contains('matched') ||
    tile.classList.contains('selected')
  )
    return;

  tile.classList.remove('hidden');
  tile.classList.add('selected');
  selectedTiles.push(tile);

  const unmatchedTiles = document.querySelectorAll('.tile:not(.matched)');

  // Ô lẻ cuối cùng
  if (unmatchedTiles.length === 1 && selectedTiles.length === 1) {
    handleLastTile(tile);
    return;
  }

  if (selectedTiles.length === 2) {
    gameState.isLocked = true;
    checkMatch(selectedTiles[0], selectedTiles[1]);

    setTimeout(() => {
      selectedTiles = [];
      gameState.isLocked = false;
    }, 800);
  }
}

/**
 * Kiểm tra 2 ô có khớp hình không
 */
function checkMatch(tile1, tile2) {
  if (tile1.dataset.imgId === tile2.dataset.imgId) {
    tile1.classList.add('matched');
    tile2.classList.add('matched');
    drawLineBetweenTiles(tile1, tile2);

    gameState.score += 10;
    gameState.timer += 5;
    updateScore(gameState.score);
    updateTimer(gameState.timer, formatTime);

    showMatchOverlay(tile2, 5, 10);

    checkLevelComplete();
  } else {
    handleWrongSelection(tile1, tile2);
  }
}

/**
 * Xử lý khi chọn sai
 */
function handleWrongSelection(tile1, tile2) {
  tile1.classList.add('wrong');
  tile2.classList.add('wrong');

  setTimeout(() => {
    tile1.classList.add('hidden');
    tile2.classList.add('hidden');
    tile1.classList.remove('selected', 'wrong');
    tile2.classList.remove('selected', 'wrong');
  }, 800);
}

/**
 * Xử lý ô lẻ cuối cùng (auto matched, tính điểm + bonus)
 */
function handleLastTile(tile) {
  gameState.isLocked = true;

  tile.classList.remove('hidden', 'selected');
  tile.classList.add('matched', 'last-tile-bonus');

  const bonusRandom = Math.floor(Math.random() * 100) + 1;
  const bonus =
    bonusRandom * (gameState.hintCount || 1) * (gameState.timer || 1);

  gameState.score += bonus;
  updateScore(gameState.score);

  gameState.hintCount += 1;
  updateHint(gameState.hintCount);

  showMatchOverlay(tile, 1, bonus, 'Ô Lẻ! +1 Gợi ý');

  createParticles(tile, 20);

  checkLevelComplete();
}

/**
 * Kiểm tra khi đã matched hết hoặc còn 1 ô
 */
function checkLevelComplete() {
  const unmatched = document.querySelectorAll('.tile:not(.matched)');
  if ((unmatched.length === 0 || unmatched.length === 1) && !isLevelCompleted) {
    isLevelCompleted = true;
    setTimeout(handleLevelComplete, 600);
  }
}

/**
 * Xử lý khi qua màn chơi
 */
function handleLevelComplete() {
  const overlay = showLevelCompleteOverlay(gameState.level);
  const bonusPoints =
    10 +
    Math.floor(gameState.score / 2) +
    gameState.level +
    gameState.hintCount +
    gameState.timer;

  gameState.score += bonusPoints;
  gameState.hintCount += 5;
  updateScore(gameState.score);
  updateHint(gameState.hintCount);

  const bonusOverlay = showBonusOverlay(bonusPoints, 5);

  setTimeout(() => {
    overlay.remove();
    bonusOverlay.remove();
    goToNextLevel();
  }, 1000);
}

/**
 * Chuyển sang màn chơi kế tiếp
 */
export function goToNextLevel(startFromLevel1 = false) {
  gameState.level = startFromLevel1 ? 1 : (gameState.level || 1) + 1;
  gameState.timer = DEFAULT_TIMER;
  gameState.isLocked = true;
  isLevelCompleted = false;

  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';

  // ✅ Khởi tạo lưới trước
  initGrid(gameState.level);

  // ✅ Sau khi khởi tạo xong, delay rồi mới xử lý tiếp
  setTimeout(() => {
    const overlay = showLevelStartOverlay(
      gameState.level,
      gameState.score,
      gameState.hintCount,
      gameState.timer
    );

    // ✅ Lấy lại tất cả tile sau khi đã có lưới
    const allTiles = document.querySelectorAll('.tile');

    // ✅ Bắt đầu preview hình
    allTiles.forEach((tile, i) => {
      tile.classList.remove('hidden');
      tile.style.opacity = 0;
      tile.style.transition = 'opacity 0.6s ease';
      setTimeout(() => {
        tile.style.opacity = 1;
      }, i * 20);
    });

    // ✅ Kết thúc preview -> ẩn các ô chưa matched
    setTimeout(() => {
      allTiles.forEach((tile) => {
        if (!tile.classList.contains('matched')) {
          tile.classList.add('hidden');
        }
        tile.style.opacity = '';
        tile.style.transition = '';
      });

      // 🛠️ FIX: overlay giờ đã được return trong ui.js nên remove được
      if (overlay) overlay.remove();

      gameState.isLocked = false;
      initLogic(); // ✅ Gắn lại sự kiện click
    }, IMAGE_PREVIEW_DURATION);
  }, LEVEL_INTRO_DURATION);
}

/**
 * Định dạng thời gian kiểu mm:ss
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Hiệu ứng hạt khi ăn ô đặc biệt
 */
function createParticles(targetTile, count = 15) {
  const tileRect = targetTile.getBoundingClientRect();
  const board = document.getElementById('game-board');

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const left =
      tileRect.left +
      tileRect.width / 2 +
      (Math.random() * tileRect.width - tileRect.width / 2);
    const top =
      tileRect.top +
      tileRect.height / 2 +
      (Math.random() * tileRect.height - tileRect.height / 2);

    particle.style.left = `${left}px`;
    particle.style.top = `${top}px`;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1500);
  }
}
