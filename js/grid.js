import { shuffleArray } from './utils.js';
import { gameState } from './gameState.js';
import { initLogic } from './logic.js';

const IMAGE_COUNT = 72; // Tổng số ảnh Pikachu có sẵn (1–72)
export let gridData = [];

export function initGrid(gridSize = 2, level = 1) {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; // Xóa toàn bộ lưới cũ
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  const totalTiles = gridSize * gridSize;
  const imageIds = [];

  // Sinh danh sách ảnh ghép cặp
  for (let i = 1; i <= Math.floor(totalTiles / 2); i++) {
    const id = ((i - 1) % IMAGE_COUNT) + 1;
    imageIds.push(id, id); // Ghép đôi
  }

  // Nếu lưới có số ô lẻ → thêm ảnh đặc biệt
  let specialImageId = null;
  let specialImageIndex = -1;
  if (totalTiles % 2 !== 0) {
    specialImageId = (Math.floor(totalTiles / 2) % IMAGE_COUNT) + 1;
    imageIds.push(specialImageId); // Hình không ghép
  }

  shuffleArray(imageIds); // Trộn thứ tự ảnh

  // Xác định vị trí hình đặc biệt
  if (specialImageId !== null) {
    specialImageIndex = imageIds.indexOf(specialImageId);
  }

  gridData = []; // Reset dữ liệu grid

  for (let row = 0; row < gridSize; row++) {
    const rowData = [];

    for (let col = 0; col < gridSize; col++) {
      const idx = row * gridSize + col;
      const imgId = imageIds[idx] || 0;
      rowData.push(imgId);

      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.dataset.imgId = imgId;

      // Gắn thêm nếu là ô lẻ (ô bonus)
      if (specialImageId !== null && idx === specialImageIndex) {
        tile.dataset.isOddTile = 'true';
        tile.classList.add('last-tile-bonus');
        tile.innerHTML += `<div class="bonus-glow"></div>`; // Hiệu ứng glow
      }

      if (imgId > 0) {
        const img = document.createElement('img');
        img.src = `assets/images/level${level}/Pikachu (${imgId}).png`;
        img.alt = `Pikachu ${imgId}`;
        img.draggable = false;
        tile.appendChild(img);
      }

      gameBoard.appendChild(tile);
    }

    gridData.push(rowData);
  }

  // Hiện toàn bộ ảnh trước → ẩn lại
  setTimeout(() => {
    revealAndHideTiles();
  }, 0);
}

/**
 * Hiện ảnh trong 3 giây đầu, rồi ẩn lại (trừ ảnh matched)
 */
function revealAndHideTiles() {
  const allTiles = document.querySelectorAll('.tile');

  allTiles.forEach((tile) => {
    tile.classList.remove('hidden');
  });

  gameState.isLocked = true;

  setTimeout(() => {
    allTiles.forEach((tile) => {
      if (!tile.classList.contains('matched')) {
        tile.classList.add('hidden');
      }
    });

    gameState.isLocked = false;
    initLogic(); // Gắn lại sự kiện click
  }, 3000);
}
