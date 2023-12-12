import { getSampleInput, getInput } from "../util";

function buildGrid(input: string[]): string[][] {
  const grid: string[][] = [];

  for (const line of input) {
    const row = line.split("");
    grid.push(row);
  }

  return grid;
}

function expandGridByRow(grid: string[][]): string[][] {
  const expandedGrid: string[][] = [];

  for (const row of grid) {
    expandedGrid.push([...row]);
    if (row.every((c) => c === ".")) {
      expandedGrid.push([...row]);
    }
  }

  return expandedGrid;
}

function expandGridByCol(grid: string[][]): string[][] {
  const translatedToColumns: string[][] = [];

  for (let x = 0; x < grid[0].length; x++) {
    const col: string[] = [];
    for (let y = 0; y < grid.length; y++) {
      col.push(grid[y][x]);
    }
    translatedToColumns.push(col);
  }

  const expandedColumns = expandGridByRow(translatedToColumns);

  const translatedToRows: string[][] = [];
  for (let x = 0; x < expandedColumns[0].length; x++) {
    const row: string[] = [];
    for (let y = 0; y < expandedColumns.length; y++) {
      row.push(expandedColumns[y][x]);
    }
    translatedToRows.push(row);
  }

  return translatedToRows;
}

type Point = {
  x: number;
  y: number;
};

function getPairsFromGrid(grid: string[][]): Point[] {
  const points: Point[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "#") {
        points.push({ x, y });
      }
    }
  }

  return points;
}

function calcShortestDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function printGrid(grid: string[][]) {
  for (const row of grid) {
    console.log(row.join(""));
  }
}

async function part1(): Promise<number> {
  const input = await getInput(11);

  let grid = buildGrid(input);
  grid = expandGridByRow(grid);
  grid = expandGridByCol(grid);
  const points = getPairsFromGrid(grid);

  // printGrid(grid);
  let totalDistance = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      totalDistance += calcShortestDistance(points[i], points[j]);
    }
  }

  return totalDistance;
}

function getEmptyRows(grid: string[][]): number[] {
  const emptyRows: number[] = [];
  for (let y = 0; y < grid.length; y++) {
    if (grid[y].every((c) => c === ".")) {
      emptyRows.push(y);
    }
  }
  return emptyRows;
}

function getEmptyCols(grid: string[][]): number[] {
  const emptyCols: number[] = [];
  for (let x = 0; x < grid[0].length; x++) {
    if (grid.every((row) => row[x] === ".")) {
      emptyCols.push(x);
    }
  }
  return emptyCols;
}

const EXPANSION = 1000000;

async function part2(): Promise<number> {
  const input = await getInput(11);

  const grid = buildGrid(input);
  const points = getPairsFromGrid(grid);
  const emptyRows = getEmptyRows(grid);
  const emptyCols = getEmptyCols(grid);

  let totalDistance = 0;

  for (const point of points) {
    const rowsBefore = emptyRows.filter((r) => r < point.y).length;
    const columnsBefore = emptyCols.filter((c) => c < point.x).length;
    point.x += (EXPANSION - 1) * columnsBefore;
    point.y += (EXPANSION - 1) * rowsBefore;
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      totalDistance += calcShortestDistance(points[i], points[j]);
    }
  }

  return totalDistance;
}

// part1().then(console.log);
part2().then(console.log);
