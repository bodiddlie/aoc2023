import { getSampleInput, getInput } from "../util";

function buildMap(input: string[]): string[][] {
  const map: string[][] = [];
  for (const line of input) {
    map.push(line.split(""));
  }
  return map;
}

function printMap(map: string[][]): void {
  for (const line of map) {
    console.log(line.join(""));
  }
  console.log();
}

function tiltMap(map: string[][], direction: number = 0): void {
  if (direction === 0) {
    for (let x = 0; x < map[0].length; x++) {
      for (let y = 1; y < map.length; y++) {
        let curY = y;
        while (curY > 0 && map[curY][x] === "O" && map[curY - 1][x] === ".") {
          map[curY][x] = ".";
          map[curY - 1][x] = "O";
          curY--;
        }
      }
    }
  } else if (direction === 1) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 1; x < map[0].length; x++) {
        let curX = x;
        while (curX > 0 && map[y][curX] === "O" && map[y][curX - 1] === ".") {
          map[y][curX] = ".";
          map[y][curX - 1] = "O";
          curX--;
        }
      }
    }
  } else if (direction === 2) {
    for (let x = 0; x < map[0].length; x++) {
      for (let y = map.length - 2; y >= 0; y--) {
        let curY = y;
        while (
          curY < map.length - 1 &&
          map[curY][x] === "O" &&
          map[curY + 1][x] === "."
        ) {
          map[curY][x] = ".";
          map[curY + 1][x] = "O";
          curY++;
        }
      }
    }
  } else if (direction === 3) {
    for (let y = 0; y < map.length; y++) {
      for (let x = map[0].length - 2; x >= 0; x--) {
        let curX = x;
        while (
          curX < map[0].length - 1 &&
          map[y][curX] === "O" &&
          map[y][curX + 1] === "."
        ) {
          map[y][curX] = ".";
          map[y][curX + 1] = "O";
          curX++;
        }
      }
    }
  }
}

function countRocks(map: string[][]): number {
  let total = 0;
  for (let y = 0; y < map.length; y++) {
    const rocks = map[y].filter((c) => c === "O").length;
    total += rocks * (map.length - y);
  }
  return total;
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(14);
  const input = await getInput(14);

  const map = buildMap(input);
  tiltMap(map);

  printMap(map);

  return countRocks(map);
}

function cycle(map: string[][]): void {
  for (let i = 0; i < 4; i++) {
    tiltMap(map, i);
    // printMap(map);
  }
}

async function part2(): Promise<number> {
  // const input = await getSampleInput(14);
  const input = await getInput(14);

  const map = buildMap(input);

  const pattern: string[] = [];
  let cycleStart = 0;
  let cycleLength = 0;

  while (true) {
    cycle(map);

    const stringifiedMap = map.map((line) => line.join("")).join("_");
    if (pattern.includes(stringifiedMap)) {
      cycleStart = pattern.indexOf(stringifiedMap);
      cycleLength = pattern.length - cycleStart;
      break;
    } else {
      pattern.push(stringifiedMap);
    }
  }

  const mod = (999999999 - cycleStart) % cycleLength;

  const cycleMap = pattern[cycleStart + mod]
    .split("_")
    .map((line) => line.split(""));

  return countRocks(cycleMap);
}

// part1().then(console.log);
part2().then(console.log);
