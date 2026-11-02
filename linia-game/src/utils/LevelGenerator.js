const buildPath = (
  r,
  c,
  visited,
  path,
  targetLength,
  rows,
  cols,
  searchState,
) => {
  if (path.length === targetLength) {
    return [...path];
  }

  if (searchState.steps >= searchState.maxSteps) {
    return null;
  }

  searchState.steps++;

  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }

  for (const [dr, dc] of dirs) {
    if (searchState.steps >= searchState.maxSteps) {
      return null;
    }

    const nr = r + dr;
    const nc = c + dc;
    const nodeID = `${nr}-${nc}`;

    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nodeID)) {
      visited.add(nodeID);
      path.push([nr, nc]);

      const result = buildPath(
        nr,
        nc,
        visited,
        path,
        targetLength,
        rows,
        cols,
        searchState,
      );

      if (result) {
        return result;
      }

      visited.delete(nodeID);
      path.pop();
    }
  }

  return null;
};

const createFallbackPath = (rows, cols, targetLength) => {
  const path = [];

  const reverseRows = Math.random() < 0.5;
  const reverseCols = Math.random() < 0.5;
  const horizontal = Math.random() < 0.5;

  if (horizontal) {
    for (let i = 0; i < rows; i++) {
      const r = reverseRows ? rows - 1 - i : i;

      for (let j = 0; j < cols; j++) {
        const forward = i % 2 === 0;
        const index = forward ? j : cols - 1 - j;
        const c = reverseCols ? cols - 1 - index : index;

        path.push([r, c]);
      }
    }
  } else {
    for (let i = 0; i < cols; i++) {
      const c = reverseCols ? cols - 1 - i : i;

      for (let j = 0; j < rows; j++) {
        const forward = i % 2 === 0;
        const index = forward ? j : rows - 1 - j;
        const r = reverseRows ? rows - 1 - index : index;

        path.push([r, c]);
      }
    }
  }

  return path.slice(0, targetLength);
};

export const generateLevel = (levelNumber) => {
  const sizeSequence = [
    [3, 3],
    [4, 3],
    [3, 4],
    [4, 4],
    [5, 3],
    [3, 5],
    [4, 5],
    [5, 4],
    [5, 5],
    [6, 4],
  ];

  let rows, cols;

  if (levelNumber <= sizeSequence.length) {
    [rows, cols] = sizeSequence[levelNumber - 1];
  } else {
    const hardSizes = sizeSequence.slice(3);

    const cycleIndex =
      (levelNumber - 1 - sizeSequence.length) % hardSizes.length;

    [rows, cols] = hardSizes[cycleIndex];
  }

  const totalNodes = rows * cols;

  const minBlocks = Math.floor(totalNodes * 0.1);
  const maxBlocks = Math.floor(totalNodes * 0.35);

  const numBlocks =
    Math.floor(Math.random() * (maxBlocks - minBlocks + 1)) + minBlocks;

  const targetPathLength = totalNodes - numBlocks;

  const MAX_ATTEMPTS = 40;
  const MAX_SEARCH_STEPS = 5000;

  let validPath = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * cols);

    const path = [[startRow, startCol]];

    const visited = new Set([`${startRow}-${startCol}`]);

    const searchState = {
      steps: 0,
      maxSteps: MAX_SEARCH_STEPS,
    };

    validPath = buildPath(
      startRow,
      startCol,
      visited,
      path,
      targetPathLength,
      rows,
      cols,
      searchState,
    );

    if (validPath) {
      break;
    }
  }

  if (!validPath) {
    validPath = createFallbackPath(rows, cols, targetPathLength);
  }

  const grid = Array.from({ length: rows }, () => Array(cols).fill(1));

  validPath.forEach(([r, c], index) => {
    grid[r][c] = index === 0 ? 2 : 0;
  });

  return grid;
};
