import { getSampleInput, getInput } from "../util";

type Point = {
  key: string;
  cost: number;
  visited: boolean;
  shortestPath: number;
};

function buildMap(input: string[]): Point[][] {
  const map: Point[][] = [];
  for (let y = 0; y < input.length; y++) {
    const row: Point[] = [];
    for (let x = 0; x < input[y].length; x++) {
      row.push({
        key: `${x},${y}`,
        cost: parseInt(input[y][x]),
        visited: false,
        shortestPath: Infinity,
      });
    }
    map.push(row);
  }

  return map;
}

function getNeighbors(point: Point, grid: Point[][]) {
  const neighbors = [];
  const [x, y] = point.key.split(",").map((n) => parseInt(n));
  if (x > 0) {
    neighbors.push(grid[y][x - 1]);
  }
  if (x < grid[y].length - 1) {
    neighbors.push(grid[y][x + 1]);
  }
  if (y > 0) {
    neighbors.push(grid[y - 1][x]);
  }
  if (y < grid.length - 1) {
    neighbors.push(grid[y + 1][x]);
  }
  return neighbors;
}

function calculatePaths(grid: Point[][], startX: number, startY: number) {
  grid[startY][startX].shortestPath = 0;
  const queue = [grid[startY][startX]];

  while (queue.length > 0) {
    const point = queue.shift();
    point.visited = true;

    const neighbors = getNeighbors(point, grid);

    for (const neighbor of neighbors) {
      const shortestDist = neighbor.cost + point.shortestPath;
      const currentShortest = point.shortestPath;
      neighbor.shortestPath = Math.min(currentShortest, shortestDist);
      if (!neighbor.visited) {
        queue.push(neighbor);
        neighbor.visited = true;
      }
    }
  }
}

function printMap(map: Point[][]): void {
  for (const row of map) {
    const line = row.map((c) => c.shortestPath).join("");
    console.log(line);
  }
}

async function part1(): Promise<number> {
  const input = await getSampleInput(17);
  // const input = await getInput(17);

  const grid = buildMap(input);

  calculatePaths(grid, 0, 0);

  printMap(grid);

  return grid[grid.length - 1][grid[0].length - 1].shortestPath;
}

part1().then(console.log);
