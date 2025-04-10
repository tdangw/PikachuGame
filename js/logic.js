// logic.js
import { gameState } from './gameState.js';
import { updateScoreUI, updateHintUI, updateTimerUI } from './main.js';
import { formatTime } from './utils.js';
import { drawLineBetweenTiles } from './canvas.js';

let isLevelCompleted = false; // Trạng thái hoàn thành màn chơi

export function initLogic() {
  const tiles = document.querySelectorAll('.tile');
  let selectedTiles = [];

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      if (gameState.isLocked || tile.classList.contains('matched') || tile.classList.contains('selected')) return;

      tile.classList.remove('hidden');
      tile.classList.add('selected');
      selectedTiles.push(tile);

      if (selectedTiles.length === 2) {
        gameState.isLocked = true; // Khóa click trong lúc kiểm tra

        // Gọi checkMatch ngay lập tức
        checkMatch(selectedTiles);

        // Đặt lại trạng thái sau 1 giây
        setTimeout(() => {
          selectedTiles = [];
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

    // Vẽ đường nối giữa hai ô ngay lập tức
    drawLineBetweenTiles(tile1, tile2);

    // Cộng điểm và thời gian
    gameState.score += 10; // Cộng 10 điểm
    gameState.timer += 5; // Cộng thêm 5 giây
    updateScoreUI(); // Cập nhật giao diện điểm
    updateTimerUI(); // Cập nhật giao diện thời gian

    // Hiển thị thông báo tại vị trí giữa hình ảnh thứ 2
    const matchOverlay = document.createElement('div');
    matchOverlay.innerHTML = `
      <div>+5s</div>
      <div>+10point</div>
    `;
    matchOverlay.style.position = 'absolute';
    matchOverlay.style.top = `${tile2.offsetTop}px`; // Đặt vị trí top của ô thứ 2
    matchOverlay.style.left = `${tile2.offsetLeft}px`; // Đặt vị trí left của ô thứ 2
    matchOverlay.style.width = `${tile2.offsetWidth}px`; // Đặt chiều rộng bằng ô thứ 2
    matchOverlay.style.height = `${tile2.offsetHeight}px`; // Đặt chiều cao bằng ô thứ 2
    matchOverlay.style.display = 'flex';
    matchOverlay.style.flexDirection = 'column';
    matchOverlay.style.justifyContent = 'center';
    matchOverlay.style.alignItems = 'center';
    matchOverlay.style.backgroundColor = 'rgba(50, 205, 50, 0.9)'; // Màu nền xanh lá
    matchOverlay.style.color = 'yellow'; // Màu chữ vàng
    matchOverlay.style.fontSize = '13px';
    matchOverlay.style.borderRadius = '5px';
    matchOverlay.style.textAlign = 'center';
    matchOverlay.style.zIndex = '1000';
    matchOverlay.style.pointerEvents = 'none'; // Không cho phép click vào thông báo
    document.body.appendChild(matchOverlay);

    // Xóa thông báo sau 3 giây
    setTimeout(() => {
      matchOverlay.remove();
    }, 3000);

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

function handleLevelComplete() {
  // Hiển thị hiệu ứng qua màn
  const levelCompleteOverlay = document.createElement('div');
  levelCompleteOverlay.innerText = `Level ${gameState.level} Completed!`;
  levelCompleteOverlay.style.position = 'fixed';
  levelCompleteOverlay.style.top = '50%';
  levelCompleteOverlay.style.left = '50%';
  levelCompleteOverlay.style.transform = 'translate(-50%, -50%)';
  setMatchOverlayStyle(levelCompleteOverlay);
  levelCompleteOverlay.style.padding = '20px 40px';
  levelCompleteOverlay.style.fontSize = '24px';
  levelCompleteOverlay.style.borderRadius = '10px';
  levelCompleteOverlay.style.textAlign = 'center';
  levelCompleteOverlay.style.zIndex = '1000';
  document.body.appendChild(levelCompleteOverlay);

  // Tính điểm thưởng
  const bonusPoints = 100 + Math.floor(gameState.score / 2) + gameState.level * 2;
  gameState.score += bonusPoints;
  gameState.hintCount += 5; // Cộng thêm 5 lượt gợi ý
  updateScoreUI();
  updateHintUI();

  // Hiển thị điểm thưởng và lượt gợi ý
  const bonusOverlay = document.createElement('div');
  bonusOverlay.innerHTML = `
    <div>+${bonusPoints} điểm</div>
    <div>+5 lượt gợi ý</div>
  `;
  bonusOverlay.style.position = 'fixed';
  bonusOverlay.style.top = '60%';
  bonusOverlay.style.left = '50%';
  bonusOverlay.style.transform = 'translate(-50%, -50%)';
  setMatchOverlayStyle(bonusOverlay);
  bonusOverlay.style.padding = '10px 20px';
  bonusOverlay.style.fontSize = '18px';
  bonusOverlay.style.borderRadius = '10px';
  bonusOverlay.style.textAlign = 'center';
  bonusOverlay.style.zIndex = '1000';
  document.body.appendChild(bonusOverlay);

  // Xóa hiệu ứng sau 1 giây
  setTimeout(() => {
    levelCompleteOverlay.remove();
    bonusOverlay.remove();
    goToNextLevel(); // Chuyển sang màn tiếp theo
  }, 1000);
}

function goToNextLevel() {
  gameState.level = (gameState.level || 1) + 1; // Tăng level
  gameState.timer = DEFAULT_TIMER; // Đặt lại thời gian
  gameState.isLocked = false; // Mở khóa click
  isLevelCompleted = false; // Đặt lại trạng thái hoàn thành màn chơi

  // Khởi tạo lưới mới
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; // Xóa lưới cũ
  initGrid(gameState.level); // Khởi tạo lưới mới với level hiện tại
  initLogic(); // Khởi tạo logic mới
}

function setMatchOverlayStyle(overlay, backgroundColor = 'rgba(0, 0, 0, 0.8)', color = 'white') {
  overlay.style.backgroundColor = backgroundColor;
  overlay.style.color = color;
}
