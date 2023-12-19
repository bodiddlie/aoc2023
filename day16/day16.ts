import { getSampleInput, getInput } from "../util";

type Tile = {
  char: string;
  energized: boolean;
};

enum Direction {
  up,
  down,
  left,
  right,
}

function buildMap(input: string[]): Tile[][] {
  const map: Tile[][] = [];

  for (const line of input) {
    const row: Tile[] = [];
    for (const char of line) {
      row.push({ char, energized: false });
    }
    map.push(row);
  }

  return map;
}

function printMap(map: Tile[][]) {
  for (const row of map) {
    let line = "";
    for (const tile of row) {
      if (tile.energized) {
        line += "#";
      } else {
        line += tile.char;
      }
    }
    console.log(line);
  }
}

function followBeam(map: Tile[][], beam: string): number {
  const beams = [beam];
  const seen = new Set<string>();

  while (beams.length > 0) {
    const beam = beams.shift();
    let [x, y, dx, dy] = beam.split(",").map(Number);
    x += dx;
    y += dy;

    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
      continue;
    }

    const { char } = map[y][x];

    if (
      char === "." ||
      (char === "-" && dx !== 0) ||
      (char === "|" && dy !== 0)
    ) {
      if (!seen.has(`${x},${y},${dx},${dy}`)) {
        seen.add(`${x},${y},${dx},${dy}`);
        beams.push(`${x},${y},${dx},${dy}`);
      }
    } else if (char === "/") {
      const newdx = -dy;
      const newdy = -dx;
      if (!seen.has(`${x},${y},${newdx},${newdy}`)) {
        seen.add(`${x},${y},${newdx},${newdy}`);
        beams.push(`${x},${y},${newdx},${newdy}`);
      }
    } else if (char === "\\") {
      const newdx = dy;
      const newdy = dx;
      if (!seen.has(`${x},${y},${newdx},${newdy}`)) {
        seen.add(`${x},${y},${newdx},${newdy}`);
        beams.push(`${x},${y},${newdx},${newdy}`);
      }
    } else if (char === "|") {
      dx = 0;
      dy = 1;
      if (!seen.has(`${x},${y},${dx},${dy}`)) {
        seen.add(`${x},${y},${dx},${dy}`);
        beams.push(`${x},${y},${dx},${dy}`);
      }
      dy = -1;
      if (!seen.has(`${x},${y},${dx},${dy}`)) {
        seen.add(`${x},${y},${dx},${dy}`);
        beams.push(`${x},${y},${dx},${dy}`);
      }
    } else if (char === "-") {
      dx = 1;
      dy = 0;
      if (!seen.has(`${x},${y},${dx},${dy}`)) {
        seen.add(`${x},${y},${dx},${dy}`);
        beams.push(`${x},${y},${dx},${dy}`);
      }
      dx = -1;
      if (!seen.has(`${x},${y},${dx},${dy}`)) {
        seen.add(`${x},${y},${dx},${dy}`);
        beams.push(`${x},${y},${dx},${dy}`);
      }
    }
  }

  const energized = new Set<string>();

  for (const beam of seen) {
    const [x, y] = beam.split(",").map(Number);
    map[y][x].energized = true;
    energized.add(`${x},${y}`);
  }

  // printMap(map);

  return energized.size;
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(16);
  const input = await getInput(16);

  const map = buildMap(input);

  return followBeam(map, "-1,0,1,0");
}

async function part2(): Promise<number> {
  // const input = await getSampleInput(16);
  const input = await getInput(16);

  const map = buildMap(input);

  let max = 0;

  for (let y = 0; y < map.length; y++) {
    max = Math.max(max, followBeam(map, `-1,${y},1,0`));
    max = Math.max(max, followBeam(map, `${map[0].length - 1},${y},-1,0`));
  }
  for (let x = 0; x < map[0].length; x++) {
    max = Math.max(max, followBeam(map, `${x},-1,0,1`));
    max = Math.max(max, followBeam(map, `${x},${map.length - 1},0,-1`));
  }

  return max;
}

// part1().then(console.log);
part2().then(console.log);
