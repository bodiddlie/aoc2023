import { getSampleInput, getInput } from "../util";

function buildGrid(input: string[]): string[][] {
  const grids: string[][] = [];

  let grid: string[] = [];

  for (const line of input) {
    if (line === "") {
      grids.push(grid);
      grid = [];
    } else {
      grid.push(line);
    }
  }

  grids.push(grid);

  return grids;
}

function orientGridByColumn(grid: string[]): string[] {
  const translatedToColumns: string[] = [];
  for (let x = 0; x < grid[0].length; x++) {
    const col: string[] = [];
    for (let y = 0; y < grid.length; y++) {
      col.push(grid[y][x]);
    }
    translatedToColumns.push(col.join(""));
  }
  return translatedToColumns;
}

function printGrid(grid: string[]) {
  for (const row of grid) {
    console.log(row);
  }
}

function checkForMirror(grid: string[]): number {
  for (let i = 1; i < grid.length; i++) {
    let mirror = true;

    for (let j = 0; j < Math.min(grid.length - i, i); j++) {
      const top = grid[i - j - 1];
      const bottom = grid[i + j];

      if (top !== bottom) {
        mirror = false;
      }
    }
    if (mirror) {
      console.log("<---------->");
      console.log(`Mirror at ${i}`);
      console.log("<---------->");
      printGrid(grid);
      return i;
    }
  }
  return 0;
}

function checkForSmudgedMirror(grid: string[]): number {
  for (let i = 1; i < grid.length; i++) {
    let diff = 0;

    for (let j = 0; j < Math.min(grid.length - i, i); j++) {
      const up = grid[i - j - 1];
      const down = grid[i + j];

      diff += up
        .split("")
        .map((c, i) => c !== down[i])
        .filter(Boolean).length;
    }
    if (diff === 1) return i;
  }
  return 0;
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(13);
  const input = await getInput(13);

  const grids = buildGrid(input);

  let vertical = 0;
  let horizontal = 0;

  for (const grid of grids) {
    const h = checkForMirror(grid);
    const orientedGrid = orientGridByColumn(grid);
    const v = checkForMirror(orientedGrid);

    if (v > 0 && h > 0) {
      console.log("shits fucked");
    }

    horizontal += h;
    vertical += v;
  }

  console.log(horizontal, vertical);
  return horizontal * 100 + vertical;
}

async function part2(): Promise<number> {
  // const input = await getSampleInput(13);
  const input = await getInput(13);

  const grids = buildGrid(input);

  let vertical = 0;
  let horizontal = 0;

  for (const grid of grids) {
    const h = checkForSmudgedMirror(grid);
    const orientedGrid = orientGridByColumn(grid);
    const v = checkForSmudgedMirror(orientedGrid);

    if (v > 0 && h > 0) {
      console.log("shits fucked");
    }

    horizontal += h;
    vertical += v;
  }

  console.log(horizontal, vertical);
  return horizontal * 100 + vertical;
}

// part1().then(console.log);
part2().then(console.log);
