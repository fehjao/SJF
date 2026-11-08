const WORD_SEARCH_CONFIG = {
  grid: [
    ['T', 'W', 'O', 'M', 'V', 'O', 'B', 'E', 'N', 'Z', 'I', 'N', 'T'],
    ['O', 'Q', 'B', 'V', 'P', 'I', 'P', 'O', 'C', 'A', 'P', 'K', 'A'],
    ['Z', 'E', 'M', 'N', 'G', 'F', 'Z', 'O', 'N', 'J', 'E', 'Z', 'X'],
    ['U', 'R', 'I', 'H', 'W', 'M', 'P', 'K', 'B', 'Z', 'T', 'P', 'S'],
    ['T', 'S', 'R', 'W', 'X', 'I', 'I', 'O', 'A', 'V', 'E', 'A', 'A'],
    ['I', 'V', 'E', 'A', 'F', 'N', 'R', 'E', 'T', 'L', 'C', 'O', 'L'],
    ['N', 'J', 'I', 'L', 'H', 'I', 'O', 'X', 'A', 'D', 'O', 'D', 'X'],
    ['H', 'C', 'A', 'L', 'D', 'T', 'L', 'J', 'T', 'O', 'X', 'E', 'I'],
    ['A', 'O', 'U', 'E', 'W', 'I', 'I', 'A', 'A', 'C', 'F', 'M', 'C'],
    ['M', 'S', 'R', 'Z', 'Y', 'T', 'R', 'V', 'T', 'I', 'M', 'E', 'H'],
    ['O', 'V', 'U', 'D', 'A', 'I', 'O', 'M', 'F', 'N', 'T', 'L', 'A'],
    ['G', 'C', 'A', 'U', 'L', 'F', 'K', 'H', 'F', 'H', 'H', 'J', 'V'],
    ['F', 'Z', 'Y', 'L', 'A', 'N', 'V', 'V', 'J', 'O', 'O', 'A', 'B']
  ],

  words: [
    {
      name: 'benzin',
      coords: [[0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11]]
    },
    {
      name: 'pipoca',
      coords: [[1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9]]
    },
    {
      name: 'peteco',
      coords: [[1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10]]
    },
    {
      name: 'paodemel',
      coords: [[3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11], [10, 11]]
    },
    {
      name: 'salxicha',
      coords: [[3, 12], [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12]]
    },
    {
      name: 'docinho',
      coords: [[6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9]]
    },
    {
      name: 'batata',
      coords: [[3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8]]
    },
    {
      name: 'piroliro',
      coords: [[3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6]]
    },
    {
      name: 'minititi',
      coords: [[3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5]]
    },
    {
      name: 'walle',
      coords: [[4, 3], [5, 3], [6, 3], [7, 3], [8, 3]]
    },
    {
      name: 'mireia',
      coords: [[2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]]
    },
    {
      name: 'tinhamo',
      coords: [[4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0]]
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('word-search-grid');
  const revealBtn = document.getElementById('reveal-btn');
  let revealed = false;

  if (!container) return;

  const totalCols = WORD_SEARCH_CONFIG.grid[0].length;
  const cellHighlightClasses = new Map();

  WORD_SEARCH_CONFIG.words.forEach(word => {
    const coords = word.coords;
    const len = coords.length;
    if (len === 0) return;

    const isHorizontal = coords[0][0] === coords[len - 1][0];

    coords.forEach(([r, c], idx) => {
      const key = `${r}-${c}`;
      if (!cellHighlightClasses.has(key)) {
        cellHighlightClasses.set(key, []);
      }
      const classes = cellHighlightClasses.get(key);

      if (isHorizontal) {
        if (idx === 0) classes.push('hl-start-h');
        else if (idx === len - 1) classes.push('hl-end-h');
        else classes.push('hl-mid-h');
      } else {
        if (idx === 0) classes.push('hl-start-v');
        else if (idx === len - 1) classes.push('hl-end-v');
        else classes.push('hl-mid-v');
      }
    });
  });

  container.style.gridTemplateColumns = `repeat(${totalCols}, 1fr)`;

  WORD_SEARCH_CONFIG.grid.forEach((row, rIndex) => {
    row.forEach((letter, cIndex) => {
      const cell = document.createElement('div');
      cell.classList.add('ws-cell');
      const letterSpan = document.createElement('span');
      letterSpan.textContent = letter;
      cell.appendChild(letterSpan);
      cell.dataset.row = rIndex;
      cell.dataset.col = cIndex;

      const key = `${rIndex}-${cIndex}`;
      if (cellHighlightClasses.has(key)) {
        cell.dataset.highlight = 'true';
        cell.dataset.classes = cellHighlightClasses.get(key).join(' ');
      }

      container.appendChild(cell);
    });
  });

  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      revealed = !revealed;
      const cells = container.querySelectorAll('.ws-cell[data-highlight="true"]');
      cells.forEach(cell => {
        const extraClasses = (cell.dataset.classes || '').split(' ');
        if (revealed) {
          cell.classList.add('highlighted');
          extraClasses.forEach(cls => {
            if (cls) cell.classList.add(cls);
          });
        } else {
          cell.classList.remove('highlighted');
          extraClasses.forEach(cls => {
            if (cls) cell.classList.remove(cls);
          });
        }
      });
      revealBtn.textContent = revealed ? 'Ocultar palavras' : 'Revelar palavras';
    });
  }
});
