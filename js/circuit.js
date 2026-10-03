(function () {
  'use strict';

  const GRID_SIZE = 8;

  const SVG_PIECES = {
    'horizontal': `
      <svg viewBox="0 0 100 100" class="circuit-svg">
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="16" stroke-linecap="square" />
      </svg>`,
    'cross': `
      <svg viewBox="0 0 100 100" class="circuit-svg">
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="16" stroke-linecap="square" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="16" stroke-linecap="square" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>`,
    't-down': `
      <svg viewBox="0 0 100 100" class="circuit-svg">
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="16" stroke-linecap="square" />
        <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" stroke-width="16" stroke-linecap="square" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>`,
    'l': `
      <svg viewBox="0 0 100 100" class="circuit-svg">
        <line x1="50" y1="0" x2="50" y2="50" stroke="currentColor" stroke-width="16" stroke-linecap="square" />
        <line x1="50" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="16" stroke-linecap="square" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>`
  };

  const PIECE_TYPES = {
    'horizontal': { ports: [false, true, false, true] },
    'cross':      { ports: [true, true, true, true] },
    't-down':     { ports: [false, true, true, true] },
    'l':          { ports: [true, true, false, false] }
  };

  const PIECE_KEYS = Object.keys(PIECE_TYPES);

  const DIR_OFFSETS = [
    { dr: -1, dc: 0, port: 0, oppPort: 2 },
    { dr: 0, dc: 1, port: 1, oppPort: 3 },
    { dr: 1, dc: 0, port: 2, oppPort: 0 },
    { dr: 0, dc: -1, port: 3, oppPort: 1 }
  ];

  let gridState = [];
  let isWon = false;

  function getRotatedPorts(basePorts, rotationSteps) {
    const steps = ((rotationSteps % 4) + 4) % 4;
    const newPorts = [false, false, false, false];
    for (let i = 0; i < 4; i++) {
      if (basePorts[i]) {
        newPorts[(i + steps) % 4] = true;
      }
    }
    return newPorts;
  }

  function generateRandomPath() {
    let bestPath = null;
    let attempts = 0;

    while (!bestPath && attempts < 500) {
      attempts++;
      const visited = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
      const path = [];

      function dfs(r, c) {
        visited[r][c] = true;
        path.push({ r, c });

        if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) {
          return true;
        }

        const dirs = [
          { dr: -1, dc: 0, dir: 0 },
          { dr: 0, dc: 1, dir: 1 },
          { dr: 1, dc: 0, dir: 2 },
          { dr: 0, dc: -1, dir: 3 }
        ].sort(() => Math.random() - 0.5);

        for (const d of dirs) {
          const nr = r + d.dr;
          const nc = c + d.dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && !visited[nr][nc]) {
            if (dfs(nr, nc)) return true;
          }
        }

        path.pop();
        return false;
      }

      if (dfs(0, 0)) {
        bestPath = path;
      }
    }

    return bestPath;
  }

  function choosePieceForPorts(neededPorts) {
    const exactConfigs = [];
    const validConfigs = [];
    const neededCount = neededPorts.filter(Boolean).length;

    for (const type of PIECE_KEYS) {
      const basePorts = PIECE_TYPES[type].ports;
      const typeCount = basePorts.filter(Boolean).length;

      for (let rot = 0; rot < 4; rot++) {
        const ports = getRotatedPorts(basePorts, rot);
        let matches = true;
        for (let i = 0; i < 4; i++) {
          if (neededPorts[i] && !ports[i]) {
            matches = false;
            break;
          }
        }
        if (matches) {
          if (typeCount === neededCount) {
            exactConfigs.push({ type, baseRotation: rot });
          }
          validConfigs.push({ type, baseRotation: rot });
        }
      }
    }

    if (exactConfigs.length > 0 && Math.random() < 0.85) {
      return exactConfigs[Math.floor(Math.random() * exactConfigs.length)];
    }

    if (validConfigs.length > 0) {
      return validConfigs[Math.floor(Math.random() * validConfigs.length)];
    }

    return { type: 'cross', baseRotation: 0 };
  }

  function testCircuitSolved(grid) {
    const startTile = grid[0][0];
    const startPorts = getRotatedPorts(startTile.basePorts, startTile.rotationSteps);
    if (!startPorts[3]) {
      return false;
    }

    const queue = [{ r: 0, c: 0 }];
    const visited = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
    visited[0][0] = true;

    while (queue.length > 0) {
      const curr = queue.shift();
      const currTile = grid[curr.r][curr.c];
      const currPorts = getRotatedPorts(currTile.basePorts, currTile.rotationSteps);

      if (curr.r === GRID_SIZE - 1 && curr.c === GRID_SIZE - 1 && currPorts[1]) {
        return true;
      }

      for (let d = 0; d < 4; d++) {
        if (currPorts[d]) {
          const nr = curr.r + DIR_OFFSETS[d].dr;
          const nc = curr.c + DIR_OFFSETS[d].dc;

          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && !visited[nr][nc]) {
            const nextTile = grid[nr][nc];
            const nextPorts = getRotatedPorts(nextTile.basePorts, nextTile.rotationSteps);

            if (nextPorts[DIR_OFFSETS[d].oppPort]) {
              visited[nr][nc] = true;
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }

    return false;
  }

  function isSolvableInOneMove(grid) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const tile = grid[r][c];
        const originalSteps = tile.rotationSteps;
        for (let rot = 1; rot <= 3; rot++) {
          tile.rotationSteps = (originalSteps + rot) % 4;
          const won = testCircuitSolved(grid);
          tile.rotationSteps = originalSteps;
          if (won) return true;
        }
      }
    }
    return false;
  }

  function initGame() {
    isWon = false;

    const victoryContainer = document.getElementById('circuit-victory-container');
    if (victoryContainer) {
      victoryContainer.classList.remove('active');
    }

    const path = generateRandomPath();
    const neededPortsGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => [false, false, false, false])
    );

    neededPortsGrid[0][0][3] = true;

    for (let i = 0; i < path.length - 1; i++) {
      const curr = path[i];
      const next = path[i + 1];

      let exitDir = -1;
      let entryDir = -1;
      if (next.r === curr.r - 1) { exitDir = 0; entryDir = 2; }
      else if (next.c === curr.c + 1) { exitDir = 1; entryDir = 3; }
      else if (next.r === curr.r + 1) { exitDir = 2; entryDir = 0; }
      else if (next.c === curr.c - 1) { exitDir = 3; entryDir = 1; }

      if (exitDir !== -1) {
        neededPortsGrid[curr.r][curr.c][exitDir] = true;
        neededPortsGrid[next.r][next.c][entryDir] = true;
      }
    }

    neededPortsGrid[GRID_SIZE - 1][GRID_SIZE - 1][1] = true;

    gridState = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const needed = neededPortsGrid[r][c];
        const isPathCell = needed.some(Boolean);

        let pieceType;
        let solutionRotation;

        if (isPathCell) {
          const config = choosePieceForPorts(needed);
          pieceType = config.type;
          solutionRotation = config.baseRotation;
        } else {
          pieceType = PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
          solutionRotation = Math.floor(Math.random() * 4);
        }

        let randomExtraSteps;
        if (pieceType === 'horizontal') {
          randomExtraSteps = Math.random() < 0.5 ? 1 : 3;
        } else {
          randomExtraSteps = Math.floor(Math.random() * 3) + 1;
        }
        const currentSteps = (solutionRotation + randomExtraSteps) % 4;

        row.push({
          r,
          c,
          type: pieceType,
          basePorts: PIECE_TYPES[pieceType].ports,
          solutionRotation,
          rotationSteps: currentSteps,
          displayDeg: currentSteps * 90,
          element: null,
          cellElement: null
        });
      }
      gridState.push(row);
    }

    let scrambleAttempts = 0;
    while ((testCircuitSolved(gridState) || isSolvableInOneMove(gridState)) && scrambleAttempts < 100) {
      scrambleAttempts++;
      for (const p of path) {
        const tile = gridState[p.r][p.c];
        let randomSteps;
        if (tile.type === 'horizontal') {
          randomSteps = Math.random() < 0.5 ? 1 : 3;
        } else {
          randomSteps = Math.floor(Math.random() * 3) + 1;
        }
        tile.rotationSteps = (tile.solutionRotation + randomSteps) % 4;
        tile.displayDeg = tile.rotationSteps * 90;
      }
    }

    renderBoard();
    checkConnectivity();
  }

  function renderBoard() {
    const boardContainer = document.getElementById('circuit-board');
    if (!boardContainer) return;

    boardContainer.innerHTML = '';

    for (let r = 0; r < GRID_SIZE; r++) {
      const leftColCell = document.createElement('div');
      leftColCell.className = 'circuit-grid-cell fixed-cell';
      if (r === 0) {
        leftColCell.classList.add('circuit-terminal', 'circuit-start-terminal');
        leftColCell.setAttribute('id', 'circuit-start-tile');
        const wrapper = document.createElement('div');
        wrapper.className = 'circuit-piece-wrapper';
        wrapper.innerHTML = SVG_PIECES['t-down'];
        wrapper.style.transform = 'rotate(270deg)';
        leftColCell.appendChild(wrapper);
      } else {
        leftColCell.classList.add('empty-cell');
      }
      boardContainer.appendChild(leftColCell);

      for (let c = 0; c < GRID_SIZE; c++) {
        const tile = gridState[r][c];
        const cell = document.createElement('button');
        cell.className = 'circuit-grid-cell circuit-playable-tile';
        cell.setAttribute('type', 'button');
        cell.setAttribute('aria-label', `Tile ${r + 1}, ${c + 1}`);

        const wrapper = document.createElement('div');
        wrapper.className = 'circuit-piece-wrapper';
        wrapper.innerHTML = SVG_PIECES[tile.type];
        wrapper.style.transform = `rotate(${tile.displayDeg}deg)`;

        cell.appendChild(wrapper);

        cell.addEventListener('click', () => onTileClick(r, c));

        tile.element = wrapper;
        tile.cellElement = cell;

        boardContainer.appendChild(cell);
      }

      const rightColCell = document.createElement('div');
      rightColCell.className = 'circuit-grid-cell fixed-cell';
      if (r === GRID_SIZE - 1) {
        rightColCell.classList.add('circuit-terminal', 'circuit-end-terminal');
        rightColCell.setAttribute('id', 'circuit-end-tile');
        const wrapper = document.createElement('div');
        wrapper.className = 'circuit-piece-wrapper';
        wrapper.innerHTML = SVG_PIECES['t-down'];
        wrapper.style.transform = 'rotate(90deg)';
        rightColCell.appendChild(wrapper);
      } else {
        rightColCell.classList.add('empty-cell');
      }
      boardContainer.appendChild(rightColCell);
    }
  }

  function onTileClick(r, c) {
    if (isWon) return;

    const tile = gridState[r][c];
    tile.rotationSteps = (tile.rotationSteps + 1) % 4;
    tile.displayDeg += 90;

    if (tile.element) {
      tile.element.style.transform = `rotate(${tile.displayDeg}deg)`;
    }

    checkConnectivity();
  }

  function checkConnectivity() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const tile = gridState[r][c];
        if (tile.cellElement) {
          tile.cellElement.classList.remove('connected-winning');
        }
      }
    }

    const startTerminal = document.getElementById('circuit-start-tile');
    const endTerminal = document.getElementById('circuit-end-tile');
    if (startTerminal) startTerminal.classList.remove('connected-winning');
    if (endTerminal) endTerminal.classList.remove('connected-winning');

    const startTile = gridState[0][0];
    const startPorts = getRotatedPorts(startTile.basePorts, startTile.rotationSteps);

    if (!startPorts[3]) {
      return;
    }

    const queue = [{ r: 0, c: 0 }];
    const visited = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
    visited[0][0] = true;
    const parentMap = new Map();

    let reachedExit = false;

    while (queue.length > 0) {
      const curr = queue.shift();
      const currTile = gridState[curr.r][curr.c];
      const currPorts = getRotatedPorts(currTile.basePorts, currTile.rotationSteps);

      if (curr.r === GRID_SIZE - 1 && curr.c === GRID_SIZE - 1 && currPorts[1]) {
        reachedExit = true;
      }

      for (let d = 0; d < 4; d++) {
        if (currPorts[d]) {
          const nr = curr.r + DIR_OFFSETS[d].dr;
          const nc = curr.c + DIR_OFFSETS[d].dc;

          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && !visited[nr][nc]) {
            const nextTile = gridState[nr][nc];
            const nextPorts = getRotatedPorts(nextTile.basePorts, nextTile.rotationSteps);

            if (nextPorts[DIR_OFFSETS[d].oppPort]) {
              visited[nr][nc] = true;
              parentMap.set(`${nr},${nc}`, `${curr.r},${curr.c}`);
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }

    if (reachedExit) {
      isWon = true;

      let currKey = `${GRID_SIZE - 1},${GRID_SIZE - 1}`;
      while (currKey) {
        const [r, c] = currKey.split(',').map(Number);
        const t = gridState[r][c];
        if (t.cellElement) {
          t.cellElement.classList.add('connected-winning');
        }
        currKey = parentMap.get(currKey);
      }

      if (startTerminal) startTerminal.classList.add('connected-winning');
      if (endTerminal) endTerminal.classList.add('connected-winning');

      const victoryContainer = document.getElementById('circuit-victory-container');
      if (victoryContainer) {
        victoryContainer.classList.add('active');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', initGame);
})();
