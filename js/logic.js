// logic.js
import { gameState } from './gameState.js';
import { updateScoreUI } from './main.js';

let lastMatchTime = 0; // Thời điểm của lần match cuối cùng
let matchCount = 0; // Số lần match liên tục
let isChecking = false; // Biến trạng thái để kiểm soát hành vi click

export function initLogic() {
  const tiles = document.querySelectorAll('.tile');
  let selectedTiles = [];

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      // Kiểm tra trạng thái khóa và trạng thái của ô
      if (gameState.isLocked || tile.classList.contains('matched') || tile.classList.contains('selected') || isChecking) return;

      tile.classList.remove('hidden');
      tile.classList.add('selected');
      selectedTiles.push(tile);

      if (selectedTiles.length === 2) {
        isChecking = true; // Đặt trạng thái đang kiểm tra
        gameState.isLocked = true; // Khóa click trong lúc kiểm tra
        setTimeout(() => {
          checkMatch(selectedTiles); // Kiểm tra 2 ô
          selectedTiles = []; // Reset danh sách các ô được chọn
          isChecking = false; // Đặt lại trạng thái
          gameState.isLocked = false; // Mở khóa click
        }, 1000);
      }
    });
  });
}

function checkMatch(selectedTiles) {
  const [tile1, tile2] = selectedTiles;

  if (tile1.dataset.imgId === tile2.dataset.imgId) {
    // Nếu khớp
    tile1.classList.add('matched');
    tile2.classList.add('matched');
    gameState.score += 10; // Cộng điểm
    updateScoreUI(); // Cập nhật giao diện điểm số

    // Cộng thêm thời gian khi match
    gameState.timer += 5; // Cộng thêm 5 giây
    document.getElementById('timer').innerText = formatTime(gameState.timer); // Cập nhật hiển thị thời gian

    // Hiển thị thông báo +5s tại vị trí của ô thứ hai
    const plusTime = document.createElement('div');
    plusTime.innerText = '+5s';
    plusTime.style.position = 'absolute';
    plusTime.style.color = 'green';
    plusTime.style.fontWeight = 'bold';
    plusTime.style.fontSize = '16px';
    plusTime.style.top = `${tile2.offsetTop}px`;
    plusTime.style.left = `${tile2.offsetLeft}px`;
    plusTime.style.zIndex = '1000';
    document.body.appendChild(plusTime);

    // Hiển thị thông báo +10p tại vị trí của ô thứ hai (bên cạnh +5s)
    const plusPoints = document.createElement('div');
    plusPoints.innerText = '+10p';
    plusPoints.style.position = 'absolute';
    plusPoints.style.color = 'blue';
    plusPoints.style.fontWeight = 'bold';
    plusPoints.style.fontSize = '16px';
    plusPoints.style.top = `${tile2.offsetTop + 20}px`; // Dịch xuống một chút so với +5s
    plusPoints.style.left = `${tile2.offsetLeft}px`;
    plusPoints.style.zIndex = '1000';
    document.body.appendChild(plusPoints);

    // Xóa thông báo sau 1 giây
    setTimeout(() => {
      plusTime.remove();
      plusPoints.remove();
    }, 1000);

    // Kiểm tra nếu tất cả các ô đã matched
    const allMatched = Array.from(document.querySelectorAll('.tile')).every(tile => tile.classList.contains('matched'));
    if (allMatched && !isLevelCompleted) {
      isLevelCompleted = true;
      alert('Bạn đã hoàn thành màn! Qua màn tiếp theo!');
      gameState.hintCount++;
      updateHintUI();
      const currentLevel = parseInt(document.querySelector('.tile').dataset.level) || 1;
      initGrid(currentLevel + 1);
    }
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

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
