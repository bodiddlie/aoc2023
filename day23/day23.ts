import { getSampleInput, getInput } from "../util";

function findStartEnd(input: string[]): [number, number][] {
  const start: [number, number] = [input[0].indexOf("."), 0];
  const end: [number, number] = [
    input[input.length - 1].indexOf("."),
    input.length - 1,
  ];

  return [start, end];
}

function findIntersections(
  input: string[],
  start: [number, number],
  end: [number, number],
): [number, number][] {
  const points: [number, number][] = [start, end];

  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      if (char === "#") continue;

      let neighbors = 0;
      const neighborsToCheck = [
        [x, y - 1],
        [x, y + 1],
        [x - 1, y],
        [x + 1, y],
      ];
      for (const [nx, ny] of neighborsToCheck) {
        if (
          0 <= ny &&
          ny < input.length &&
          0 <= nx &&
          nx < input[0].length &&
          input[ny][nx] !== "#"
        ) {
          neighbors++;
        }
      }
      if (neighbors >= 3) {
        points.push([x, y]);
      }
    }
  }
  return points;
}

type Node = Record<string, number>;
type Graph = Record<string, Node>;

function buildGraph(
  input: string[],
  points: [number, number][],
  directions: Record<string, [number, number][]>,
): Graph {
  const graph: Graph = {};
  for (const point of points) {
    graph[`${point[0]},${point[1]}`] = {};
  }

  for (const [sx, sy] of points) {
    const stack: [number, number, number][] = [[0, sx, sy]];
    const seen: Set<string> = new Set();
    seen.add(`${sx},${sy}`);

    while (stack.length) {
      const [n, x, y] = stack.pop();

      if (n !== 0 && points.some(([px, py]) => px === x && py === y)) {
        graph[`${sx},${sy}`][`${x},${y}`] = n;
        continue;
      }

      for (const [dx, dy] of directions[input[y][x]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          0 <= ny &&
          ny < input.length &&
          0 <= nx &&
          nx < input[0].length &&
          input[ny][nx] !== "#" &&
          !seen.has(`${nx},${ny}`)
        ) {
          stack.push([n + 1, nx, ny]);
          seen.add(`${nx},${ny}`);
        }
      }
    }
  }

  return graph;
}

const visited: Set<string> = new Set();

function dfs(
  point: [number, number],
  end: [number, number],
  graph: Graph,
): number {
  if (point[0] === end[0] && point[1] === end[1]) return 0;

  const key = `${point[0]},${point[1]}`;
  let m = -Infinity;

  visited.add(key);
  for (const node of Object.keys(graph[`${point[0]},${point[1]}`])) {
    if (!visited.has(node)) {
      m = Math.max(
        m,
        dfs(node.split(",").map(Number) as [number, number], end, graph) +
          graph[key][node],
      );
    }
  }
  visited.delete(key);

  return m;
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(23);
  const input = await getInput(23);

  const [start, end] = findStartEnd(input);

  const points = findIntersections(input, start, end);

  const directions: Record<string, [number, number][]> = {
    "^": [[0, -1]],
    v: [[0, 1]],
    "<": [[-1, 0]],
    ">": [[1, 0]],
    ".": [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ],
  };

  const graph = buildGraph(input, points, directions);

  return dfs(start, end, graph);
}

async function part2(): Promise<number> {
  // const input = await getSampleInput(23);
  const input = await getInput(23);

  const [start, end] = findStartEnd(input);

  const points = findIntersections(input, start, end);

  const directions: Record<string, [number, number][]> = {
    "^": [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ],
    v: [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ],
    ">": [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ],
    "<": [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ],
    ".": [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ],
  };

  const graph = buildGraph(input, points, directions);

  return dfs(start, end, graph);
}

// part1().then(console.log);
part2().then(console.log);
