// utils.js

/**
 * Xáo trộn một mảng theo thuật toán Fisher-Yates
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Định dạng thời gian từ giây thành mm:ss
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Sinh danh sách ảnh Pikachu từ Pikachu (1).png đến Pikachu (72).png
 */
export function generateImageList() {
  const list = [];
  for (let i = 1; i <= 72; i++) {
    const fileName = `assets/images/Pikachu (${i}).png`;
    list.push(fileName);
  }
  return list;
}
