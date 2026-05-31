// src/utils/LevelGenerator.js

const buildPath = (r, c, visited, path, targetLength, rows, cols) => {
  if (path.length === targetLength) return path;

  // Directions: Right, Down, Left, Up (shuffled for randomness)
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]].sort(() => Math.random() - 0.5);

  for (let [dr, dc] of dirs) {
    let nr = r + dr, nc = c + dc;
    let nodeID = `${nr}-${nc}`;
    
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nodeID)) {
      visited.add(nodeID);
      path.push([nr, nc]);
      
      let result = buildPath(nr, nc, visited, path, targetLength, rows, cols);
      if (result) return result;
      
      // Backtrack
      visited.delete(nodeID);
      path.pop();
    }
  }
  return null;
};

export const generateLevel = (levelNumber) => {
  // 1. DYNAMIC GRID SIZE: Starts at 3x3, increases by 1 every 15 levels, capped at 6x6
  const size = Math.min(6, 3 + Math.floor((levelNumber - 1) / 15));
  const rows = size;
  const cols = size;
  const totalNodes = rows * cols;

  // 2. MAX BLOCKS LIMIT: Never block more than 35% of the board, otherwise it gets too restrictive/easy
  const maxBlocksLimit = Math.floor(totalNodes * 0.35);

  // 3. DIFFICULTY SCALING: Calculate progress within the current grid size (0 to 14)
  const progressInCurrentSize = (levelNumber - 1) % 15; 
  
  // Base blocks scale up mathematically as you progress within the same grid size
  let baseBlocks = Math.floor((progressInCurrentSize / 14) * maxBlocksLimit);
  
  // Add 0 or 1 extra block for slight randomness, ensuring it doesn't cross the max limit
  let numBlocks = Math.min(maxBlocksLimit, baseBlocks + Math.floor(Math.random() * 2));

  // Minimum required nodes to traverse
  const targetPathLength = totalNodes - numBlocks;

  while (true) {
    let grid = Array(rows).fill(0).map(() => Array(cols).fill(1)); // Start with solid blocks
    
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