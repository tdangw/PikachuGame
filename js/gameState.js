// 📦 Trạng thái toàn cục của game
export const gameState = {
  currentLevel: 1, // Level hiện tại
  score: 0, // Tổng điểm người chơi
  hints: 30, // Số lượt gợi ý còn lại
  isLocked: false, // Trạng thái khóa click khi đang hiệu ứng
  settings: {
    mode: 'easy', // Chế độ chơi: easy | normal | hard
  },
};

/**
 * 🔄 Reset lại trạng thái game về ban đầu
 */
export function resetGame() {
  gameState.currentLevel = 1;
  gameState.score = 0;
  gameState.hints = 30;
  gameState.isLocked = false;
  gameState.settings.mode = 'easy';
}

/**
 * ➕ Cộng điểm cho người chơi
 * @param {number} points - số điểm cần cộng
 */
export function increaseScore(points) {
  gameState.score += points;
}

/**
 * ⚙️ Đặt chế độ chơi
 * @param {string} difficulty - easy | normal | hard
 */
export function setGameDifficulty(difficulty) {
  gameState.settings.mode = difficulty;
}

/**
 * 🔍 Trả về chế độ chơi hiện tại
 */
export function getGameDifficulty() {
  return gameState.settings.mode;
}
