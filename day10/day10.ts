import { getSampleInput, getInput } from "../util";

type Point = {
  char: string;
  x: number;
  y: number;
  distance: number;
};

function buildMap(input: string[]): [Point[][], number, number] {
  const map: Point[][] = [];
  let startX = 0;
  let startY = 0;
  for (let y = 0; y < input.length; y++) {
    const row: Point[] = [];
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (char === "S") {
        startX = x;
        startY = y;
      }
      row.push({ char, distance: -1, x, y });
    }
    map.push(row);
  }

  return [map, startX, startY];
}

function getAdjacentPoints(map: Point[][], at: [number, number]): Point[] {
  const [checkX, checkY] = at;

  const points: Point[] = [];
  //check above
  if (checkY - 1 >= 0 && map[checkY - 1][checkX]) {
    const above = map[checkY - 1][checkX];
    if (above.char === "F" || above.char === "|" || above.char === "7") {
      above.distance = 1;
      points.push(above);
    }
  }
  // check below
  if (checkY + 1 < map.length && map[checkY + 1][checkX]) {
    const below = map[checkY + 1][checkX];
    if (below.char === "J" || below.char === "|" || below.char === "L") {
      below.distance = 1;
      points.push(below);
    }
  }
  //check left
  if (checkX - 1 >= 0 && map[checkY][checkX - 1]) {
    const left = map[checkY][checkX - 1];
    if (left.char === "F" || left.char === "-" || left.char === "L") {
      left.distance = 1;
      points.push(left);
    }
  }
  //check right
  if (checkX + 1 < map[checkY].length && map[checkY][checkX + 1]) {
    const right = map[checkY][checkX + 1];
    if (right.char === "J" || right.char === "-" || right.char === "7") {
      right.distance = 1;
      points.push(right);
    }
  }

  return points;
}

function getNextPoint(map: Point[][], at: Point, prev: Point): Point {
  if (at.char === "|" || at.char === "J" || at.char === "L") {
    //check above
    const checkY = at.y - 1;
    const checkX = at.x;
    if (checkY !== prev.y) {
      if (checkY >= 0 && map[checkY][checkX]) {
        const above = map[checkY][checkX];
        if (
          above.char === "F" ||
          above.char === "|" ||
          above.char === "7" ||
          above.char === "S"
        ) {
          // console.log("next is above ", above);
          above.distance = at.distance + 1;
          return above;
        }
      }
    }
  }

  if (at.char === "|" || at.char === "7" || at.char === "F") {
    //check below
    const checkY = at.y + 1;
    const checkX = at.x;
    if (checkY !== prev.y) {
      if (checkY < map.length && map[checkY][checkX]) {
        const below = map[checkY][checkX];
        if (
          below.char === "J" ||
          below.char === "|" ||
          below.char === "L" ||
          below.char === "S"
        ) {
          // console.log("next is below ", below);
          below.distance = at.distance + 1;
          return below;
        }
      }
    }
  }

  if (at.char === "-" || at.char === "J" || at.char === "7") {
    //check left
    const checkY = at.y;
    const checkX = at.x - 1;
    if (checkX !== prev.x) {
      if (checkX >= 0 && map[checkY][checkX]) {
        const left = map[checkY][checkX];
        if (
          left.char === "F" ||
          left.char === "-" ||
          left.char === "L" ||
          left.char === "S"
        ) {
          // console.log("next is left ", left);
          left.distance = at.distance + 1;
          return left;
        }
      }
    }
  }

  if (at.char === "-" || at.char === "F" || at.char === "L") {
    //check right
    const checkY = at.y;
    const checkX = at.x + 1;
    if (checkX !== prev.x) {
      if (checkX < map[checkY].length && map[checkY][checkX]) {
        const right = map[checkY][checkX];
        if (
          right.char === "J" ||
          right.char === "-" ||
          right.char === "7" ||
          right.char === "S"
        ) {
          // console.log("next is rigth ", right);
          right.distance = at.distance + 1;
          return right;
        }
      }
    }
  }

  console.log("no next point found");
}

function getStartType(first: Point, second: Point, start: Point): string {
  let startType = "";
  if (first.x === start.x) {
    if (second.x === start.x) {
      startType = "|";
    } else if (
      first.y > start.y &&
      second.y === start.y &&
      second.x > start.x
    ) {
      startType = "F";
    } else if (
      first.y > start.y &&
      second.y === start.y &&
      second.x < start.x
    ) {
      startType = "7";
    } else if (
      first.y < start.y &&
      second.y === start.y &&
      second.x > start.x
    ) {
      startType = "L";
    } else if (
      first.y < start.y &&
      second.y === start.y &&
      second.x < start.x
    ) {
      startType = "J";
    }
  } else if (first.y === start.y) {
    if (second.y === start.y) {
      startType = "-";
    } else if (
      first.x > start.x &&
      second.x === start.x &&
      second.y > start.y
    ) {
      startType = "F";
    } else if (
      first.x > start.x &&
      second.x === start.x &&
      second.y < start.y
    ) {
      startType = "L";
    } else if (
      first.x < start.x &&
      second.x === start.x &&
      second.y > start.y
    ) {
      startType = "7";
    } else if (
      first.x < start.x &&
      second.x === start.x &&
      second.y < start.y
    ) {
      startType = "J";
    }
  }
  return startType;
}

async function part1(): Promise<number> {
  const input = await getInput(10);
  const [map, startX, startY] = buildMap(input);

  const start = map[startY][startX];

  const [first, second] = getAdjacentPoints(map, [startX, startY]);
  console.log(first, second);

  const startType = getStartType(first, second, start);
  console.log(startType);

  let last = start;
  let current = first;
  let next = getNextPoint(map, current, last);

  let firstDistance = 1;
  while (!(next.x === start.x && next.y === start.y)) {
    last = current;
    current = next;
    next = getNextPoint(map, current, last);
    firstDistance++;
  }

  last = start;
  current = second;
  next = getNextPoint(map, current, last);
  let secondDistance = 1;

  while (!(next.x === start.x && next.y === start.y)) {
    last = current;
    current = next;
    next = getNextPoint(map, current, last);
    secondDistance++;
  }

  console.log(firstDistance, secondDistance);
  for (const row of map) {
    for (const point of row) {
      if (point.distance < 0) {
        point.char = ".";
      }
    }
  }

  return 0;
}

async function part2(): Promise<number> {
  const input = await getInput(10);
  const [map, startX, startY] = buildMap(input);

  const start = map[startY][startX];

  const [first, second] = getAdjacentPoints(map, [startX, startY]);
  console.log(first, second);

  const startType = getStartType(first, second, start);
  console.log(startType);

  let last = start;
  let current = first;
  let next = getNextPoint(map, current, last);

  while (!(next.x === start.x && next.y === start.y)) {
    last = current;
    current = next;
    next = getNextPoint(map, current, last);
  }

  last = start;
  current = second;
  next = getNextPoint(map, current, last);

  while (!(next.x === start.x && next.y === start.y)) {
    last = current;
    current = next;
    next = getNextPoint(map, current, last);
  }

  const loop: Set<Point> = new Set();
  start.char = startType;
  for (const row of map) {
    for (const point of row) {
      if (point.distance < 0) {
        point.char = ".";
      } else {
        loop.add(point);
      }
    }
  }

  const outside: Point[] = [];
  for (const row of map) {
    let within = false;
    let up = false;
    for (const point of row) {
      if (point.char === "|") {
        within = !within;
      } else if (point.char === "L" || point.char === "F") {
        up = point.char === "L";
      } else if (point.char === "7" || point.char === "J") {
        if (up ? point.char !== "J" : point.char !== "7") {
          within = !within;
        }
        up = false;
      }

      if (!within) {
        outside.push(point);
      }
    }
  }

  const area = map.length * map[0].length;

  for (const out of outside) {
    loop.add(out);
  }
  console.log(area, loop.size);
  return area - loop.size;
}

// part1().then(console.log);
part2().then(console.log);
