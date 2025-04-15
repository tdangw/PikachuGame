import { showSettingsPanel } from './settings.js';
import { gameState } from './gameState.js';
import { initializeLevel } from './main.js';
import {
  updateLevelDisplay,
  updateScoreDisplay,
  updateHintDisplay,
} from './ui.js';

export function createMainMenu() {
  if (document.getElementById('menu-container')) return;

  const menuOverlay = document.createElement('div');
  menuOverlay.id = 'menu-container';
  menuOverlay.className = 'menu-overlay';

  const wrapper = document.createElement('div');
  wrapper.className = 'menu-wrapper';

  const title = document.createElement('h1');
  title.className = 'game-title';
  title.textContent = 'Pikachu Memory Match';
  wrapper.appendChild(title);

  const menuList = document.createElement('ul');
  menuList.className = 'menu-list';

  const menuItems = [
    {
      text: '🎮 Bắt đầu',
      action: () => {
        document.body.removeChild(menuOverlay);
        showDifficultyOverlay();
      },
    },
    {
      text: '⚙️ Cài đặt',
      action: () => {
        document.body.removeChild(menuOverlay);
        showSettingsPanel();
      },
    },
    {
      text: '📖 Hướng dẫn',
      action: () => {
        document.body.removeChild(menuOverlay);
        showInfoModal(
          'Hướng dẫn',
          '🎯 Ghép các cặp hình giống nhau để ghi điểm.\n🎁 Click đúng ô lẻ để nhận thưởng!'
        );
      },
    },
    {
      text: 'ℹ️ Thông tin',
      action: () => {
        document.body.removeChild(menuOverlay);
        showInfoModal(
          'Thông tin game',
          'Pikachu Memory Match V1.0\nTác giả: Bạn & ChatGPT 🤖'
        );
      },
    },
    {
      text: '❌ Thoát',
      action: () => window.close(),
    },
  ];

  menuItems.forEach(({ text, action }) => {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.textContent = text;
    li.onclick = action;
    menuList.appendChild(li);
  });

  wrapper.appendChild(menuList);
  menuOverlay.appendChild(wrapper);
  document.body.appendChild(menuOverlay);
}

function showDifficultyOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay fade-in';

  const modal = document.createElement('div');
  modal.className = 'modal slide-down';

  const h2 = document.createElement('h2');
  h2.textContent = 'Chọn chế độ chơi';

  const levels = [
    { label: 'Dễ', level: 1 },
    { label: 'Bình thường', level: 4 },
    { label: 'Khó', level: 12 },
  ];

  levels.forEach(({ label, level }) => {
    const btn = document.createElement('button');
    btn.className = 'difficulty-btn';
    btn.textContent = label;

    btn.onclick = () => {
      gameState.currentLevel = level;
      gameState.score = 0;
      gameState.hints = 30;

      updateLevelDisplay(level);
      updateScoreDisplay(0);
      updateHintDisplay(30);

      document.body.removeChild(overlay);

      // 🔊 Bạn có thể play nhạc menu ở đây nếu muốn
      // playBackgroundMusic();

      initializeLevel(level);
    };

    modal.appendChild(btn);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'back-menu-btn';
  cancelBtn.textContent = '❌ Hủy';
  cancelBtn.onclick = () => {
    document.body.removeChild(overlay);
    createMainMenu(); // Quay lại menu
  };

  modal.appendChild(cancelBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function showInfoModal(title, message) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay fade-in';

  const modal = document.createElement('div');
  modal.className = 'modal slide-down';

  const h2 = document.createElement('h2');
  h2.textContent = title;

  const p = document.createElement('p');
  p.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'settings-btn';
  closeBtn.textContent = 'Đóng';

  closeBtn.onclick = () => {
    modal.classList.add('slide-up');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(overlay);
      createMainMenu();
    }, 300);
  };

  modal.appendChild(h2);
  modal.appendChild(p);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
