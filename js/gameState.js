import { formatTime } from './utils.js';

export const DEFAULT_TIMER = 999;

export const gameState = {
  timer: DEFAULT_TIMER,
  score: 0,
  hintCount: 30, // Giá trị hiện tại của hintCount
  defaultHintCount: 30, // Giá trị mặc định của hintCount
  isLocked: false,
  level: 1, // Cấp độ hiện tại
};