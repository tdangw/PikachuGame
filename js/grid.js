import { shuffleArray } from './utils.js';
import { gameState } from './gameState.js';
import { initLogic } from './logic.js';

const MAX_IMAGE_ID = 72;
export let gridData = [];

/**
 * Tạo lưới game theo level hiện tại
 * @param {number} level
 */
export function createGrid(level = 1) {
  const gridSize = Math.min(level, 12);
  const totalTiles = gridSize * gridSize;
  const numberOfPairs = Math.floor(totalTiles / 2);

  // Tạo danh sách ảnh từ 1–72 và xáo trộn
  const availableImages = Array.from({ length: MAX_IMAGE_ID }, (_, i) => i + 1);
  shuffleArray(availableImages);

  // Chọn ảnh không trùng → mỗi ảnh dùng đúng 2 lần
  const selectedImages = availableImages.slice(0, numberOfPairs);
  let imageIds = [];
  selectedImages.forEach((id) => {
    imageIds.push(id, id);
  });

  // Nếu số ô là lẻ → thêm 1 ô lẻ bonus
  let bonusImageId = null;
  let bonusTileIndex = null;

  if (totalTiles % 2 !== 0) {
    bonusImageId = availableImages[numberOfPairs]; // ảnh tiếp theo chưa dùng
    imageIds.push(bonusImageId);
  }

  // Trộn mảng ảnh cuối cùng
  shuffleArray(imageIds);

  // Chuẩn bị DOM
  gridData = [];
  const gridContainer = document.getElementById('grid-container');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  imageIds.forEach((imageId, idx) => {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    const tileId = `tile-${row}-${col}`;

    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.id = tileId;

    const img = document.createElement('img');
    img.src = `assets/images/level${level}/Pikachu (${imageId}).png`;
    img.alt = `Pikachu ${imageId}`;
    img.draggable = false;
    img.classList.add('hidden');

    tile.dataset.imageId = imageId;
    tile.dataset.isBonus = 'false';

    let isBonus = false;

    if (
      bonusImageId !== null &&
      imageId === bonusImageId &&
      bonusTileIndex === null
    ) {
      // ✅ Chỉ gán 1 ô duy nhất làm bonus
      tile.dataset.isBonus = 'true';
      isBonus = true;
      bonusTileIndex = idx;

      console.log(`[🎯 BONUS TILE] id=${tileId}, imageId=${bonusImageId}`);
    }

    tile.appendChild(img);
    gridContainer.appendChild(tile);

    // Lưu dữ liệu cho game logic
    gridData.push({
      id: tileId,
      imageId,
      isBonus,
      isMatched: false,
    });
  });

  // ✅ Preview ảnh trước khi bắt đầu
  setTimeout(() => {
    revealAndHideTiles();
  }, 0);
}

/**
 * Hiển thị tất cả ảnh trong 3s rồi ẩn lại nếu chưa matched
 */
function revealAndHideTiles() {
  const allImgs = document.querySelectorAll('.tile img');
  allImgs.forEach((img) => img.classList.remove('hidden'));

  gameState.isLocked = true;

  setTimeout(() => {
    allImgs.forEach((img) => {
      const parent = img.parentElement;
      if (!parent.classList.contains('matched')) {
        img.classList.add('hidden');
      }
    });

    gameState.isLocked = false;
    initLogic();
  }, 3000);
}
