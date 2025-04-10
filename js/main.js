// main.js
import { initGrid } from './grid.js';
import { initLogic } from './logic.js';
import { formatTime } from './utils.js';
import { gameState, DEFAULT_TIMER } from './gameState.js';
import { drawLineBetweenTiles } from './canvas.js';

let interval;
let hintTimeout;
let hintCountdownInterval;

export function updateScoreUI() {
  document.getElementById('score').innerText = gameState.score;
}

export function updateTimerUI() {
  document.getElementById('timer').innerText = formatTime(gameState.timer);
}

export function updateHintUI() {
  document.getElementById('hint-count').innerText = gameState.hintCount; // Cập nhật lượt gợi ý hiển thị
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
  gameState.isLocked = false;
  gameState.score = 0;
  gameState.timer = DEFAULT_TIMER;
  gameState.hintCount = gameState.defaultHintCount;

  updateScoreUI();
  updateHintUI();
  initGrid(); // Khởi tạo lưới game
  initLogic(); // Khởi tạo logic game
  startTimer(); // Bắt đầu bộ đếm thời gian
}

function startHintCountdown() {
  let countdown = 5; // Bắt đầu từ 5 giây
  const hintTimer = document.getElementById('hint-timer');

  // Hiển thị thời gian đếm ngược với màu nền và logo đồng hồ cát
  hintTimer.innerHTML = `⏳ ${countdown}`;
  hintTimer.style.display = 'inline-block'; // Hiển thị phần tử
  hintTimer.style.backgroundColor = 'rgba(0, 85, 255, 0.8)'; // Màu nền cam
  hintTimer.style.color = 'white'; // Màu chữ trắng
  hintTimer.style.padding = '2px 6px'; // Khoảng cách bên trong
  hintTimer.style.borderRadius = '5px'; // Bo góc
  hintTimer.style.fontWeight = 'bold'; // Chữ đậm

  // Xóa bộ đếm trước đó nếu có
  clearInterval(hintCountdownInterval);

  // Bắt đầu đếm ngược
  hintCountdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      hintTimer.innerHTML = `⏳ ${countdown}`; // Cập nhật đồng hồ cát và số giây
    } else {
      // Khi đếm ngược kết thúc
      clearInterval(hintCountdownInterval);
      hintTimer.innerHTML = ''; // Xóa nội dung
      hintTimer.style.display = 'none'; // Ẩn phần tử
    }
  }, 1000);
}

function showHint() {
  if (gameState.isLocked) {
    // Nếu game đang bị khóa, hiển thị thông báo
    alert('Đừng bấm quá nhanh!');
    return;
  }

  if (gameState.hintCount > 0) {
    gameState.isLocked = true; // Khóa click
    gameState.hintCount--; // Giảm số lượt gợi ý
    updateHintUI(); // Cập nhật hiển thị lượt gợi ý

    const tiles = document.querySelectorAll('.tile.hidden');
    let foundHint = false;
    let hintTile1 = null;
    let hintTile2 = null;

    // Tìm một cặp ô có thể match
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i].dataset.imgId === tiles[j].dataset.imgId) {
          hintTile1 = tiles[i];
          hintTile2 = tiles[j];
          foundHint = true;
          break;
        }
      }
      if (foundHint) break;
    }

    // Nếu không tìm thấy cặp nào, báo lỗi
    if (!foundHint) {
      alert('Không còn cặp nào để gợi ý!');
      gameState.isLocked = false;
      return;
    }

    // Hiển thị toàn bộ hình ảnh
    tiles.forEach(tile => tile.classList.remove('hidden')); // Hiển thị tất cả các ô

    // Bắt đầu đếm ngược 5 giây
    startHintCountdown();

    // Sau 5 giây, ẩn toàn bộ hình ảnh trừ cặp được tìm
    setTimeout(() => {
      tiles.forEach(tile => {
        if (tile !== hintTile1 && tile !== hintTile2) {
          tile.classList.add('hidden'); // Ẩn lại các ô không phải cặp gợi ý
        }
      });

      // Hiển thị cặp gợi ý
      hintTile1.classList.remove('hidden');
      hintTile2.classList.remove('hidden');

      // Vẽ đường nối giữa hai ô
      drawLineBetweenTiles(hintTile1, hintTile2);

      gameState.isLocked = false; // Mở khóa click
    }, 5000);
  } else {
    alert('Bạn đã hết lượt gợi ý!');
  }
}

function checkMatch(selectedTiles) {
  const [tile1, tile2] = selectedTiles;

  if (tile1.dataset.imgId === tile2.dataset.imgId) {
    // Nếu khớp
    tile1.classList.add('matched');
    tile2.classList.add('matched');

    // Vẽ đường nối giữa hai ô
    drawLineBetweenTiles(tile1, tile2);

    // Cộng điểm
    gameState.score += 10;
    updateScoreUI();
  } else {
    // Nếu không khớp, ẩn lại các ô sau 1 giây
    setTimeout(() => {
      tile1.classList.add('hidden');
      tile2.classList.add('hidden');
      tile1.classList.remove('selected');
      tile2.classList.remove('selected');
    }, 1000);
  }
}

// Gắn sự kiện cho các nút
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('hint-btn').addEventListener('click', showHint);

// Khởi chạy game ban đầu
restartGame();
