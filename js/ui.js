/**
 * Cập nhật hiển thị cấp độ hiện tại trên giao diện.
 * @param {number} level - Cấp độ hiện tại.
 */
export function updateLevelDisplay(level) {
  const levelElement = document.getElementById('level');
  if (levelElement) {
    levelElement.innerText = level; // ✅ KHÔNG thêm "Level:" vì đã có sẵn ngoài
  } else {
    console.error('Không tìm thấy phần tử hiển thị cấp độ (id="level").');
  }
}

/**
 * Cập nhật hiển thị điểm số hiện tại trên giao diện.
 * @param {number} score - Điểm hiện tại.
 */
export function updateScoreDisplay(score) {
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.innerText = score; // ✅ Chỉ là số
  } else {
    console.error('Không tìm thấy phần tử hiển thị điểm số (id="score").');
  }
}

/**
 * Cập nhật hiển thị số lượt gợi ý còn lại.
 * @param {number} hints - Số gợi ý còn lại.
 */
export function updateHintDisplay(hints) {
  const hintElement = document.getElementById('hint');
  if (hintElement) {
    hintElement.innerText = `💡 Gợi ý: ${hints}`;
  } else {
    console.warn('Không tìm thấy phần tử hiển thị gợi ý (id="hint").');
  }
}

/**
 * Hiển thị giao diện chơi game (ẩn menu).
 */
export function showGameUI() {
  const menuContainer = document.getElementById('menu-container');
  const gameContainer = document.getElementById('game-container');
  if (menuContainer) menuContainer.style.display = 'none';
  if (gameContainer) gameContainer.style.display = 'flex';
}

/**
 * Hiển thị lại menu chính (ẩn game).
 */
export function showMainMenu() {
  const menuContainer = document.querySelector('.menu-container');
  const gameContainer = document.getElementById('game-container');
  if (menuContainer) menuContainer.style.display = 'block';
  if (gameContainer) gameContainer.style.display = 'none';
}

/**
 * Hiển thị overlay thông báo điểm thưởng hoặc thông tin bất kỳ.
 * @param {string} message - Nội dung thông báo.
 */
export function showBonusOverlay(message) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay fade-in';

  const modal = document.createElement('div');
  modal.className = 'modal slide-down';
  modal.innerHTML = `
    <h2>🎁 Thông báo</h2>
    <p>${message}</p>
    <button class="settings-btn">Tiếp tục</button>
  `;

  modal.querySelector('button').onclick = () => {
    modal.classList.add('slide-up');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => document.body.removeChild(overlay), 300);
  };

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
