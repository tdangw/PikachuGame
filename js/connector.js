// connector.js

/**
 * Kiểm tra 2 ô có thể nối với nhau không (theo luật Pikachu)
 * Trả về mảng các điểm đường đi nếu hợp lệ, hoặc null nếu không nối được
 * @param {Array} grid - ma trận 12x12 (2D array) chứa dữ liệu ảnh hoặc null
 * @param {Object} tile1 - {row, col}
 * @param {Object} tile2 - {row, col}
 */
export function canConnect(grid, tile1, tile2) {
  const rows = grid.length;
  const cols = grid[0].length;
  const start = { r: tile1.row, c: tile1.col };
  const end = { r: tile2.row, c: tile2.col };

  // Nếu cùng vị trí
  if (start.r === end.r && start.c === end.c) return null;

  // Nếu không cùng ảnh
  if (grid[start.r][start.c] !== grid[end.r][end.c]) return null;

  // Tạm thời loại bỏ 2 ô ra khỏi grid để kiểm tra đường đi
  const temp1 = grid[start.r][start.c];
  const temp2 = grid[end.r][end.c];
  grid[start.r][start.c] = null;
  grid[end.r][end.c] = null;

  // 1. Kiểm tra nối thẳng ngang hoặc dọc
  if (canConnectStraight(grid, start, end)) {
    grid[start.r][start.c] = temp1;
    grid[end.r][end.c] = temp2;
    return [start, end];
  }

  // 2. Kiểm tra nối với 1 góc
  const oneCorner = canConnectOneCorner(grid, start, end);
  if (oneCorner) {
    grid[start.r][start.c] = temp1;
    grid[end.r][end.c] = temp2;
    return [start, oneCorner, end];
  }

  // 3. Kiểm tra nối với 2 góc (tìm đường uốn 2 lần)
  const twoCorners = canConnectTwoCorners(grid, start, end);
  if (twoCorners) {
    grid[start.r][start.c] = temp1;
    grid[end.r][end.c] = temp2;
    return [start, ...twoCorners, end];
  }

  grid[start.r][start.c] = temp1;
  grid[end.r][end.c] = temp2;
  return null;
}

function canConnectStraight(grid, a, b) {
  if (a.r === b.r) {
    const row = a.r;
    const [min, max] = [a.c, b.c].sort((x, y) => x - y);
    for (let c = min + 1; c < max; c++) {
      if (grid[row][c] !== null) return false;
    }
    return true;
  }
  if (a.c === b.c) {
    const col = a.c;
    const [min, max] = [a.r, b.r].sort((x, y) => x - y);
    for (let r = min + 1; r < max; r++) {
      if (grid[r][col] !== null) return false;
    }
    return true;
  }
  return false;
}

function canConnectOneCorner(grid, a, b) {
  const corner1 = { r: a.r, c: b.c };
  const corner2 = { r: b.r, c: a.c };
  if (isEmpty(grid, corner1) && canConnectStraight(grid, a, corner1) && canConnectStraight(grid, corner1, b)) {
    return corner1;
  }
  if (isEmpty(grid, corner2) && canConnectStraight(grid, a, corner2) && canConnectStraight(grid, corner2, b)) {
    return corner2;
  }
  return null;
}

function canConnectTwoCorners(grid, a, b) {
  for (let r = 0; r < grid.length; r++) {
    const corner1 = { r, c: a.c };
    const corner2 = { r, c: b.c };
    if (isEmpty(grid, corner1) && isEmpty(grid, corner2)) {
      if (canConnectStraight(grid, a, corner1) && canConnectStraight(grid, corner1, corner2) && canConnectStraight(grid, corner2, b)) {
        return [corner1, corner2];
      }
    }
  }
  for (let c = 0; c < grid[0].length; c++) {
    const corner1 = { r: a.r, c };
    const corner2 = { r: b.r, c };
    if (isEmpty(grid, corner1) && isEmpty(grid, corner2)) {
      if (canConnectStraight(grid, a, corner1) && canConnectStraight(grid, corner1, corner2) && canConnectStraight(grid, corner2, b)) {
        return [corner1, corner2];
      }
    }
  }
  return null;
}

function isEmpty(grid, point) {
  return grid[point.r] && grid[point.r][point.c] === null;
}
