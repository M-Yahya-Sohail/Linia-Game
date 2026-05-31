const buildPath = (r, c, visited, path, targetLength, rows, cols) => {
  if (path.length === targetLength) return path;

  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]].sort(() => Math.random() - 0.5);

  for (let [dr, dc] of dirs) {
    let nr = r + dr, nc = c + dc;
    let nodeID = `${nr}-${nc}`;
    
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nodeID)) {
      visited.add(nodeID);
      path.push([nr, nc]);
      let result = buildPath(nr, nc, visited, path, targetLength, rows, cols);
      if (result) return result;
      visited.delete(nodeID);
      path.pop();
    }
  }
  return null;
};

export const generateLevel = (levelNumber) => {
  const sizeSequence = [
    [3, 3], // Level 1 
    [4, 3], // Level 2 
    [3, 4], // Level 3 
    [4, 4], // Level 4 
    [5, 3], // Level 5 
    [3, 5], // Level 6 
    [4, 5], // Level 7 
    [5, 4], // Level 8 
    [5, 5], // Level 9 
    [6, 4], // Level 10
  ];

  let rows, cols;
  
  if (levelNumber <= sizeSequence.length) {
    [rows, cols] = sizeSequence[levelNumber - 1];
  } else {
    const hardSizes = sizeSequence.slice(3); 
    const cycleIndex = (levelNumber - 1 - sizeSequence.length) % hardSizes.length;
    [rows, cols] = hardSizes[cycleIndex];
  }

  const totalNodes = rows * cols;
  const minBlocks = Math.floor(totalNodes * 0.1);
  const maxBlocks = Math.floor(totalNodes * 0.35);
  const numBlocks = Math.floor(Math.random() * (maxBlocks - minBlocks + 1)) + minBlocks;

  const targetPathLength = totalNodes - numBlocks;

  while (true) {
    let grid = Array(rows).fill(0).map(() => Array(cols).fill(1)); 
    let startRow = Math.floor(Math.random() * rows);
    let startCol = Math.floor(Math.random() * cols);

    let path = [[startRow, startCol]];
    let visited = new Set([`${startRow}-${startCol}`]);

    let validPath = buildPath(startRow, startCol, visited, path, targetPathLength, rows, cols);
    
    if (validPath) {
      validPath.forEach(([r, c], index) => {
        if (index === 0) {
          grid[r][c] = 2; 
        } else {
          grid[r][c] = 0; 
        }
      });
      return grid; 
    }
  }
};