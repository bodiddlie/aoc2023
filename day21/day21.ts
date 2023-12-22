import { getSampleInput, getInput } from "../util";

type Cell = {
  char: string;
  visited: boolean;
  canReach: boolean;
};

function buildMap(input: string[]): Cell[][] {
  const map: Cell[][] = [];
  for (const line of input) {
    const row: Cell[] = [];
    for (const char of line) {
      row.push({ char, visited: false, canReach: false });
    }
    map.push(row);
  }

  return map;
}

function printMap(map: Cell[][]) {
  for (const row of map) {
    let line = "";
    for (const cell of row) {
      line += cell.canReach ? "O" : cell.char;
    }
    console.log(line);
  }
}

function takeStep(map: Cell[][], starts: Set<string>): Set<string> {
  const nextStarts = new Set<string>();

  const deltas = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  for (const start of starts) {
    const [startX, startY] = start.split(",").map(Number);
    for (const [dx, dy] of deltas) {
      const x = startX + dx;
      const y = startY + dy;
      if (x < 0 || y < 0 || x >= map.length || y >= map[x].length) {
        continue;
      }

      if (map[y][x].char === "." || map[y][x].char === "S") {
        nextStarts.add(`${x},${y}`);
      }
    }
  }
  return nextStarts;
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(21);
  const input = await getInput(21);
  const map = buildMap(input);

  let y = 0;
  let start = "";
  while (y < map.length) {
    let x = 0;
    while (x < map[y].length) {
      if (map[y][x].char === "S") {
        start = `${x},${y}`;
      }
      x++;
    }
    y++;
  }

  let starts = new Set<string>();
  starts.add(start);

  for (let i = 0; i < 64; i++) {
    starts = takeStep(map, starts);
  }

  return starts.size;
}

part1().then(console.log);
