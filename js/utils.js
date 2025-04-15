// utils.js

/**
 * Tạo một số nguyên ngẫu nhiên trong khoảng [min, max].
 * @param {number} min - Giá trị nhỏ nhất (bao gồm).
 * @param {number} max - Giá trị lớn nhất (bao gồm).
 * @returns {number} Số nguyên ngẫu nhiên.
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Xáo trộn ngẫu nhiên các phần tử trong một mảng (thuật toán Fisher-Yates).
 * @param {Array} arr - Mảng cần xáo trộn.
 * @returns {Array} Mảng đã được xáo trộn.
 */
export function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Hoán đổi các phần tử
  }
  return arr;
}

/**
 * Định dạng thời gian từ số giây thành định dạng "phút:giây".
 * Ví dụ: 65 giây -> "1:05".
 * @param {number} seconds - Tổng số giây.
 * @returns {string} Chuỗi định dạng thời gian.
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
}

/**
 * Tạo một ID ngẫu nhiên cho các phần tử (ví dụ: ô).
 * @returns {string} Chuỗi ID ngẫu nhiên.
 */
export function generateRandomID() {
  return 'tile-' + Math.floor(Math.random() * 1000000);
}
