import { initializeLevel } from './main.js';
import { gameState } from './gameState.js';

const settingsContainer = document.getElementById('settings-container');
const menuContainer = document.getElementById('menu-container');

// Tạo thuộc tính settings nếu chưa có
if (!gameState.settings) {
  gameState.settings = {
    mode: 'easy', // dự phòng
    sound: true, // sẽ dùng cho bật/tắt âm thanh
  };
}

/**
 * Hiển thị giao diện Cài đặt (dành cho ⚙️ menu)
 */
export function showSettingsPanel() {
  settingsContainer.style.display = 'block';
  if (menuContainer) menuContainer.style.display = 'none';

  // Cập nhật trạng thái checkbox âm thanh
  const toggleSound = document.getElementById('toggle-sound');
  if (toggleSound) {
    toggleSound.checked = gameState.settings.sound;
    toggleSound.onchange = () => {
      gameState.settings.sound = toggleSound.checked;
    };
  }
}

/**
 * Dùng cho hệ thống chọn chế độ chơi cũ (menu Bắt đầu cũ)
 * Nếu vẫn dùng hệ thống chọn độ khó dạng radio
 */
export function showSettings() {
  settingsContainer.style.display = 'block';
  if (menuContainer) menuContainer.style.display = 'none';

  // Gán radio tương ứng đã chọn
  const selectedMode = gameState.settings.mode;
  const input = document.querySelector(
    `input[name="mode"][value="${selectedMode}"]`
  );
  if (input) input.checked = true;
}

/**
 * Xác nhận lựa chọn từ menu "Chế độ" (dùng nếu giữ lại hệ thống cũ)
 */
export function applySettingsAndStartGame() {
  const selectedMode = document.querySelector(
    'input[name="mode"]:checked'
  )?.value;
  gameState.settings.mode = selectedMode || 'easy';

  // Gán level tương ứng với mode
  switch (selectedMode) {
    case 'easy':
      initializeLevel(1);
      break;
    case 'normal':
      initializeLevel(4);
      break;
    case 'hard':
      initializeLevel(12);
      break;
    default:
      initializeLevel(1);
  }

  // Ẩn menu cài đặt
  settingsContainer.style.display = 'none';
  document.getElementById('game-container').style.display = 'flex';
}

// Gán sự kiện nút "Bắt đầu" nếu dùng hệ thống radio cũ
const confirmBtn = document.getElementById('confirm-settings-btn');
if (confirmBtn) {
  confirmBtn.onclick = () => {
    applySettingsAndStartGame();
  };
}
import { createMainMenu } from './mainmenu.js';

// Gán toggle âm thanh
const toggleSound = document.getElementById('toggle-sound');
if (toggleSound) {
  toggleSound.checked = gameState.settings.sound ?? true;
  toggleSound.onchange = () => {
    gameState.settings.sound = toggleSound.checked;
    console.log('Âm thanh:', toggleSound.checked ? 'BẬT' : 'TẮT');
  };
}

// Quay về menu
const backBtn = document.getElementById('btn-back-menu');
if (backBtn) {
  backBtn.onclick = () => {
    document.getElementById('settings-container').style.display = 'none';
    createMainMenu();
  };
}
