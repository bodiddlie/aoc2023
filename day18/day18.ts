import { getSampleInput, getInput } from "../util";

type Instruction = {
  direction: [number, number];
  distance: number;
  color: string;
};

function paresInput(input: string[]): Instruction[] {
  const instructions: Instruction[] = [];
  for (const line of input) {
    const [direction, distance, color] = line.split(" ");
    instructions.push({
      direction:
        direction === "R"
          ? [1, 0]
          : direction === "L"
            ? [-1, 0]
            : direction === "U"
              ? [0, -1]
              : [0, 1],
      distance: parseInt(distance),
      color: color.substring(1, color.length - 1),
    });
  }
  return instructions;
}

function parseHexInput(input: string[]): Instruction[] {
  const instructions: Instruction[] = [];
  for (const line of input) {
    const hexEntry = line.split(" ")[2];
    const hex = hexEntry.substring(1, hexEntry.length - 1);
    const dirValue = hex.substring(hex.length - 1);
    const direction: [number, number] =
      dirValue === "0"
        ? [1, 0]
        : dirValue === "1"
          ? [0, 1]
          : dirValue === "2"
            ? [-1, 0]
            : [0, -1];
    const distance = parseInt(hex.substring(1, hex.length - 1), 16);
    instructions.push({
      direction,
      distance,
      color: "",
    });
  }

  return instructions;
}

function getArea(instructions: Instruction[]): number {
  let x = 0;
  let y = 0;
  const points: [number, number][] = [];
  let perimeter = 0;
  for (let i = 0; i < instructions.length; i++) {
    x += instructions[i].direction[0] * instructions[i].distance;
    y += instructions[i].direction[1] * instructions[i].distance;
    perimeter += instructions[i].distance;
    points.push([x, y]);
  }

  let result = 0;
  for (let i = 0; i < points.length - 1; i++) {
    result += points[i][0] * points[i + 1][1] - points[i + 1][0] * points[i][1];
  }

  const total = result + perimeter;

  return Math.floor(total / 2) + 1;
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(18);
  const input = await getInput(18);

  const instructions = paresInput(input);

  const area = getArea(instructions);

  return area;
}

async function part2(): Promise<number> {
  // const input = await getSampleInput(18);
  const input = await getInput(18);

  const instructions = parseHexInput(input);
  console.log(instructions);
  const area = getArea(instructions);
  return area;
}

// part1().then(console.log);
part2().then(console.log);
