// grid.js
import { shuffleArray } from './utils.js';

const GRID_SIZE = 12; // Kích thước lưới
const IMAGE_COUNT = 72; // Số ảnh

export let gridData = []; // Ma trận 2D chứa id ảnh

/**
 * Tạo lưới và hiển thị lên DOM
 * @param {number} level - Mức độ hiện tại (1 hoặc 2 hoặc 3)
 */
export function initGrid(level = 1) {
  const container = document.getElementById('game-board');
  container.innerHTML = '';

  const imageIDs = [];
  for (let i = 1; i <= IMAGE_COUNT; i++) {
    imageIDs.push(i);
    imageIDs.push(i); // Mỗi ảnh xuất hiện 2 lần
  }

  shuffleArray(imageIDs);

  // Tạo ma trận gridData 12x12
  gridData = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      const imgId = imageIDs[r * GRID_SIZE + c];
      row.push(imgId);

      const tile = document.createElement('div');
      tile.classList.add('tile', 'hidden'); // Thêm class hidden để ẩn ảnh ban đầu
      tile.dataset.row = r;
      tile.dataset.col = c;
      tile.dataset.imgId = imgId; // Lưu id ảnh vào dataset

      const img = document.createElement('img');
      // Điều chỉnh đường dẫn theo level
      img.src = `./assets/images/level${level}/Pikachu (${imgId}).png`;
      img.alt = `Pikachu ${imgId}`;

      tile.appendChild(img);
      container.appendChild(tile);
    }
    gridData.push(row);
  }
}
