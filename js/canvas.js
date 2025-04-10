export function drawLineBetweenTiles(tile1, tile2) {
  // Lấy canvas từ DOM hoặc tạo mới nếu chưa có
  let canvas = document.getElementById('connection-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'connection-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none'; // Không ảnh hưởng đến sự kiện click
    document.body.appendChild(canvas);
  }

  // Cập nhật kích thước canvas theo kích thước màn hình
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');

  // Lấy vị trí trung tâm của hai ô
  const rect1 = tile1.getBoundingClientRect();
  const rect2 = tile2.getBoundingClientRect();

  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;
  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;

  // Tính toán điểm trung gian để tạo đường nối hình chữ L
  const midX = x1;
  const midY = y2;

  // Vẽ đường nối hình chữ L
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ
  ctx.beginPath();
  ctx.moveTo(x1, y1); // Điểm bắt đầu
  ctx.lineTo(midX, midY); // Điểm trung gian
  ctx.lineTo(x2, y2); // Điểm kết thúc
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)'; // Màu đường nối (xanh lá)
  ctx.lineWidth = 4; // Độ dày đường nối
  ctx.setLineDash([]); // Đường liền nét
  ctx.stroke();

  // Xóa đường nối sau 0.5 giây
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 500);
}