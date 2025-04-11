// Hàm xóa canvas
export function clearCanvas() {
  const canvas = document.getElementById('connection-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Hàm vẽ đường nối giữa hai tile
export function drawLineBetweenTiles(tile1, tile2) {
  let canvas = document.getElementById('connection-canvas');

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'connection-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999'; // Đảm bảo nằm trên grid
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  clearCanvas();

  const rect1 = tile1.getBoundingClientRect();
  const rect2 = tile2.getBoundingClientRect();

  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;
  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;

  const midX = x1;
  const midY = y2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(midX, midY);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
  ctx.lineWidth = 4;
  ctx.setLineDash([]);
  ctx.stroke();

  setTimeout(clearCanvas, 500);
}

// Đảm bảo canvas luôn resize đúng khi thay đổi kích thước cửa sổ
window.addEventListener('resize', () => {
  const canvas = document.getElementById('connection-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
