/**
 * Cập nhật điểm số lên giao diện
 * @param {number} score
 */
export function updateScore(score) {
  document.getElementById('score').innerText = score;
}

/**
 * Cập nhật bộ đếm thời gian lên giao diện
 * @param {number} seconds
 * @param {function} formatTimeFn - Hàm định dạng thời gian
 */
export function updateTimer(seconds, formatTimeFn) {
  document.getElementById('timer').innerText = formatTimeFn(seconds);
}

/**
 * Cập nhật lượt gợi ý lên giao diện
 * @param {number} hintCount
 */
export function updateHint(hintCount) {
  document.getElementById('hint-count').innerText = hintCount;
}

/**
 * Hiển thị đếm ngược gợi ý trong 5 giây
 * @param {function} callback - Gọi lại khi kết thúc đếm ngược
 */
export function startHintCountdown(callback) {
  let countdown = 5;
  const hintTimer = document.getElementById('hint-timer');

  // Cài style đồng hồ cát
  hintTimer.innerHTML = `⏳ ${countdown}`;
  Object.assign(hintTimer.style, {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 85, 255, 0.8)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '5px',
    fontWeight: 'bold',
  });

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      hintTimer.innerHTML = `⏳ ${countdown}`;
    } else {
      clearInterval(interval);
      hintTimer.innerHTML = '';
      hintTimer.style.display = 'none';
      if (callback) callback();
    }
  }, 1000);
}

/**
 * Hiển thị thông báo khi hai ô khớp, cộng điểm và thời gian
 * Gộp cả 2 cách hiển thị (gắn vào tile hoặc overlay toàn màn)
 * @param {HTMLElement} tile - Một trong 2 ô khớp
 * @param {number} bonusTime - Thời gian cộng thêm (giây)
 * @param {number} bonusScore - Điểm cộng thêm
 * @param {string} subtitle - (Tuỳ chọn) thông điệp phụ
 * @param {boolean} attachToTile - true để overlay nằm trên tile, false để overlay nằm toàn màn hình
 */
export function showMatchOverlay(
  tile,
  bonusTime = 5,
  bonusScore = 10,
  subtitle = '',
  attachToTile = false
) {
  const overlay = document.createElement('div');
  overlay.className = 'match-overlay';
  overlay.innerHTML = `
    <div>+${bonusScore} điểm</div>
    ${bonusTime ? `<div>+${bonusTime} giây</div>` : ''}
    ${subtitle ? `<div>${subtitle}</div>` : ''}
  `;

  if (attachToTile) {
    overlay.style.position = 'absolute';
    overlay.style.top = `${tile.offsetTop}px`;
    overlay.style.left = `${tile.offsetLeft}px`;
    overlay.style.width = `${tile.offsetWidth}px`;
    overlay.style.height = `${tile.offsetHeight}px`;
    document.body.appendChild(overlay);
  } else {
    applyOverlayBasicStyle(overlay, {
      top: `${tile.offsetTop}px`,
      left: `${tile.offsetLeft}px`,
      width: `${tile.offsetWidth}px`,
      height: `${tile.offsetHeight}px`,
    });
    document.body.appendChild(overlay);
  }

  setTimeout(() => {
    overlay.remove();
  }, 1000);
}

/**
 * Hiển thị thông báo hoàn thành level
 * @param {number} level
 */
export function showLevelCompleteOverlay(level) {
  const overlay = document.createElement('div');
  overlay.innerText = `Level ${level} Completed!`;
  applyOverlayBasicStyle(overlay, {
    padding: '20px 40px',
    fontSize: '24px',
  });
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hiển thị cộng điểm và gợi ý sau khi qua màn
 * @param {number} bonusPoints
 * @param {number} bonusHints
 */
export function showBonusOverlay(bonusPoints, bonusHints) {
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div>+${bonusPoints} điểm</div>
    <div>+${bonusHints} lượt gợi ý</div>
  `;
  applyOverlayBasicStyle(overlay, {
    padding: '10px 20px',
    fontSize: '18px',
    top: '60%',
  });
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hiển thị thông tin khi bắt đầu màn mới
 * @param {number} level
 * @param {number} score
 * @param {number} hintCount
 * @param {number} timeLeft
 */
export function showLevelStartOverlay(level, score, hintCount, timeLeft) {
  const overlay = document.createElement('div');
  overlay.className = 'level-start-overlay';
  overlay.innerHTML = `
    <div class="level-box">
      <h2>Level ${level}</h2>
      <p>🎯 Điểm: ${score}</p>
      <p>💡 Gợi ý: ${hintCount}</p>
      <p>⏱️ Thời gian: ${timeLeft}s</p>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => overlay.remove(), 3000);
}

/**
 * Hàm áp dụng style chung cho overlay
 * @param {HTMLElement} overlay
 * @param {Object} customStyle - Style bổ sung tùy từng overlay
 */
function applyOverlayBasicStyle(overlay, customStyle = {}) {
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '10px',
    textAlign: 'center',
    zIndex: '1000',
    pointerEvents: 'none',
    ...customStyle,
  });
}
