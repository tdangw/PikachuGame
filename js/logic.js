// logic.js - Xử lý click và logic kiểm tra ghép hình

import { increaseScore, gameState } from './gameState.js';
import { showBonusOverlay, updateScoreDisplay } from './ui.js';
import { nextLevel } from './main.js';

let selectedTiles = [];

/**
 * Gắn sự kiện click cho tất cả tile sau khi render
 */
export function initLogic() {
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((tile) => {
    tile.onclick = () => handleTileClick(tile);
  });
}

/**
 * Xử lý khi người chơi click 1 ô
 */
export function handleTileClick(tileElement) {
  if (gameState.currentLevel > 1 && gameState.isLocked) return;

  const isBonus = tileElement.dataset.isBonus === 'true';
  const imageId = tileElement.dataset.imageId;
  const img = tileElement.querySelector('img');

  if (
    tileElement.classList.contains('matched') ||
    tileElement.classList.contains('selected') ||
    !img
  )
    return;

  // Hiển thị ảnh
  img.classList.remove('hidden');
  tileElement.classList.add('selected');

  if (isBonus) {
    // 🎯 Ô lẻ → cộng điểm ngẫu nhiên, chỉ glow khi trúng
    const bonusPoints = Math.floor(Math.random() * 100) + 1;
    increaseScore(bonusPoints);
    updateScoreDisplay(gameState.score);

    tileElement.classList.add('matched', 'bonus-tile'); // thêm glow khi click trúng

    console.log(`[🎁 Bonus] +${bonusPoints} điểm từ tile ${tileElement.id}`);
    showBonusOverlay(`🎯 Bạn nhận được ${bonusPoints} điểm thưởng!`);

    checkLevelComplete();
  } else {
    // Ô thường → kiểm tra ghép
    selectedTiles.push({ element: tileElement, imageId });
    if (selectedTiles.length === 2) {
      checkMatch();
    }
  }
}

/**
 * Kiểm tra 2 ô được chọn có match không
 */
function checkMatch() {
  const [first, second] = selectedTiles;

  if (first.imageId === second.imageId) {
    first.element.classList.add('matched');
    second.element.classList.add('matched');

    increaseScore(20);
    updateScoreDisplay(gameState.score);

    console.log(`[✅ Match] ${first.imageId}`);
    checkLevelComplete();
  } else {
    first.element.classList.add('wrong');
    second.element.classList.add('wrong');

    setTimeout(() => {
      first.element.classList.remove('selected', 'wrong');
      second.element.classList.remove('selected', 'wrong');

      const img1 = first.element.querySelector('img');
      const img2 = second.element.querySelector('img');
      if (img1) img1.classList.add('hidden');
      if (img2) img2.classList.add('hidden');
    }, 800);
  }

  selectedTiles = [];
}

/**
 * Kiểm tra điều kiện để qua màn:
 * - Tất cả ô thường đã matched
 * - Nếu có ô bonus thì phải matched
 */
export function checkLevelComplete() {
  const allNormalTiles = document.querySelectorAll(
    '.tile:not([data-is-bonus="true"])'
  );
  const matchedNormalTiles = document.querySelectorAll(
    '.tile.matched:not([data-is-bonus="true"])'
  );
  const bonusTile = document.querySelector('.tile[data-is-bonus="true"]');

  const bonusMatched = bonusTile
    ? bonusTile.classList.contains('matched')
    : true;

  if (allNormalTiles.length === matchedNormalTiles.length && bonusMatched) {
    console.log(`[🚀 HOÀN THÀNH] Level ${gameState.currentLevel} hoàn tất`);
    showBonusOverlay(`🎉 Bạn đã hoàn thành Level ${gameState.currentLevel}!`);

    setTimeout(() => {
      nextLevel();
    }, 600);
  }
}
