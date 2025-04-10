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
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; // Xóa lưới cũ

  const gridSize = 12; // Lưới 12x12
  const totalTiles = gridSize * gridSize;

  const imageIds = [];
  for (let i = 1; i <= totalTiles / 2; i++) {
    imageIds.push(i, i); // Mỗi ID xuất hiện 2 lần
  }

  shuffleArray(imageIds); // Trộn ngẫu nhiên danh sách ID ảnh

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile', 'hidden');
    tile.dataset.imgId = imageIds[i];
    const img = document.createElement('img');
    img.src = `assets/images/level${level}/Pikachu (${imageIds[i]}).png`; // Sử dụng đúng tên file
    tile.appendChild(img);
    gameBoard.appendChild(tile);
  }
}
