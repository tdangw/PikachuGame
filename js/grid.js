// grid.js
import { shuffleArray } from './utils.js';
import { gameState } from './gameState.js';
import { initLogic } from './logic.js'; // Đảm bảo bạn đã export hàm này trong logic.js

export const GRID_SIZE = 12; // Kích thước lưới 12x12
const IMAGE_COUNT = 72; // Số lượng ảnh gốc (từ Pikachu (1) đến Pikachu (72))

export let gridData = []; // Mảng lưu cấu trúc lưới hiện tại (dạng ma trận 2D)

/**
 * Hàm khởi tạo lưới game và hiển thị lên giao diện
 * @param {number} level - Cấp độ hiện tại để load đúng thư mục ảnh
 */
export function initGrid(level = 1) {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; // Xóa nội dung cũ nếu có

  const totalTiles = GRID_SIZE * GRID_SIZE; // Tổng số ô = 144

  // Tạo danh sách ID ảnh, mỗi ảnh xuất hiện 2 lần
  const imageIds = [];
  for (let i = 1; i <= totalTiles / 2; i++) {
    const id = ((i - 1) % IMAGE_COUNT) + 1; // Đảm bảo ảnh lặp lại nếu vượt quá IMAGE_COUNT
    imageIds.push(id, id);
  }

  shuffleArray(imageIds); // Trộn ngẫu nhiên mảng ảnh

  gridData = [];

  // Tạo HTML và gắn vào DOM
  for (let row = 0; row < GRID_SIZE; row++) {
    const rowData = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      const idx = row * GRID_SIZE + col;
      const imgId = imageIds[idx];
      rowData.push(imgId);

      // Tạo thẻ .tile
      const tile = document.createElement('div');
      tile.classList.add('tile'); // KHÔNG thêm 'hidden' ở đây để hiện hình trong 3s đầu
      tile.dataset.imgId = imgId;

      const img = document.createElement('img');
      img.src = `assets/images/level${level}/Pikachu (${imgId}).png`; // Đảm bảo đúng đường dẫn

      tile.appendChild(img);
      gameBoard.appendChild(tile);
    }
    gridData.push(rowData);
  }

  // Đợi DOM tạo xong rồi mới xử lý hiệu ứng ẩn hiện
  setTimeout(() => {
    revealAndHideTiles();
  }, 0);
}

/**
 * Hiển thị toàn bộ ảnh trong 3 giây đầu, sau đó ẩn đi
 */
function revealAndHideTiles() {
  const allTiles = document.querySelectorAll('.tile');

  // Hiện tất cả ảnh
  allTiles.forEach((tile) => {
    tile.classList.remove('hidden'); // Đảm bảo không bị ẩn
  });

  gameState.isLocked = true; // Tạm thời khóa click

  setTimeout(() => {
    // Ẩn lại các ảnh chưa matched
    allTiles.forEach((tile) => {
      if (!tile.classList.contains('matched')) {
        tile.classList.add('hidden'); // Ẩn hình ảnh nhưng vẫn còn ô
      }
    });

    gameState.isLocked = false; // Mở lại thao tác
    initLogic(); // Gắn lại sự kiện click
  }, 3000);
}
