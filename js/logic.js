// logic.js

import { gameState } from './gameState.js';
import { updateScore, updateHint, updateTimer } from './ui.js';
import { drawLineBetweenTiles } from './canvas.js';
import { initGrid } from './grid.js';
import {
  showMatchOverlay,
  showLevelCompleteOverlay,
  showBonusOverlay,
  showLevelStartOverlay,
} from './ui.js';

const DEFAULT_TIMER = 600;
const LEVEL_INTRO_DURATION = 3000; // Thời gian hiện overlay giới thiệu level (ms)
const IMAGE_PREVIEW_DURATION = 3000; // Thời gian hiện ảnh trước khi ẩn (ms)

let isLevelCompleted = false;

// Khởi tạo logic khi bắt đầu
export function initLogic() {
  const tiles = document.querySelectorAll('.tile');
  let selectedTiles = [];

  tiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      if (
        gameState.isLocked ||
        tile.classList.contains('matched') ||
        tile.classList.contains('selected')
      )
        return;

      tile.classList.remove('hidden'); // Hiện hình khi click
      tile.classList.add('selected');
      selectedTiles.push(tile);

      if (selectedTiles.length === 2) {
        gameState.isLocked = true;
        checkMatch(selectedTiles);

        setTimeout(() => {
          selectedTiles = [];
          gameState.isLocked = false;
        }, 1000);
      }
    });
  });
}

// Kiểm tra ghép cặp
function checkMatch([tile1, tile2]) {
  if (tile1.dataset.imgId === tile2.dataset.imgId) {
    tile1.classList.add('matched');
    tile2.classList.add('matched');
    drawLineBetweenTiles(tile1, tile2);

    gameState.score += 10;
    gameState.timer += 5;
    updateScore(gameState.score);
    updateTimer(gameState.timer, formatTime);

    showMatchOverlay(tile2, 5, 10);

    if (
      document.querySelectorAll('.tile:not(.matched)').length === 0 &&
      !isLevelCompleted
    ) {
      isLevelCompleted = true;
      setTimeout(handleLevelComplete, 600);
    }
  } else {
    handleWrongSelection(tile1, tile2);
    setTimeout(() => {
      tile1.classList.add('hidden');
      tile2.classList.add('hidden');
      tile1.classList.remove('selected', 'wrong');
      tile2.classList.remove('selected', 'wrong');
    }, 1000);
  }
}

function handleWrongSelection(tile1, tile2) {
  tile1.classList.add('wrong');
  tile2.classList.add('wrong');
}

// Xử lý khi qua màn
function handleLevelComplete() {
  const levelOverlay = showLevelCompleteOverlay(gameState.level);
  const bonusPoints =
    100 + Math.floor(gameState.score / 2) + gameState.level * 2;

  gameState.score += bonusPoints;
  gameState.hintCount += 5;
  updateScore(gameState.score);
  updateHint(gameState.hintCount);

  const bonusOverlay = showBonusOverlay(bonusPoints, 5);

  setTimeout(() => {
    levelOverlay.remove();
    bonusOverlay.remove();
    goToNextLevel();
  }, 1000);
}

// Tăng level và khởi tạo lại lưới, xử lý hiển thị hình trong 3s
export function goToNextLevel(startFromLevel1 = false) {
  gameState.level = startFromLevel1 ? 1 : (gameState.level || 1) + 1;
  gameState.timer = DEFAULT_TIMER;
  gameState.isLocked = true;
  isLevelCompleted = false;

  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';

  initGrid(gameState.level);

  const overlay = showLevelStartOverlay(
    gameState.level,
    gameState.score,
    gameState.hintCount,
    gameState.timer
  );

  // Giai đoạn 1: chờ LEVEL_INTRO_DURATION trước khi bắt đầu hiện ảnh
  setTimeout(() => {
    if (overlay) overlay.remove();

    const allTiles = document.querySelectorAll('.tile');

    // Giai đoạn 2: Hiện ảnh có hiệu ứng mờ dần
    allTiles.forEach((tile, i) => {
      tile.classList.remove('hidden');
      tile.style.opacity = 0;
      tile.style.transition = 'opacity 0.6s ease';
      setTimeout(() => {
        tile.style.opacity = 1;
      }, i * 20);
    });

    // Sau IMAGE_PREVIEW_DURATION thì ẩn lại và bắt đầu game
    setTimeout(() => {
      allTiles.forEach((tile) => {
        if (!tile.classList.contains('matched')) {
          tile.classList.add('hidden');
        }
        tile.style.opacity = '';
        tile.style.transition = '';
      });

      gameState.isLocked = false;
      initLogic();
    }, IMAGE_PREVIEW_DURATION);
  }, LEVEL_INTRO_DURATION);
}

// Hàm định dạng thời gian
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
