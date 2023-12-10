import { getSampleInput, getInput } from "../util";

type Node = {
  L: string;
  R: string;
};

function buildTree(input: string[]): Record<string, Node> {
  const tree: Record<string, Node> = {};

  for (const line of input) {
    const [key, rhs] = line.split(" = ");
    tree[key] = {
      L: rhs.substring(1, 4),
      R: rhs.substring(6, 9),
    };
  }

  return tree;
}

async function part1(): Promise<number> {
  const input = await getInput(8);

  const instructions = input[0].split("");
  input.shift();
  input.shift();
  const tree = buildTree(input);

  let steps = 0;
  let currentInstructionIndex = 0;
  let current = "AAA";
  while (current !== "ZZZ") {
    const instruction = instructions[currentInstructionIndex];
    current = tree[current][instruction];
    steps++;
    currentInstructionIndex++;
    if (currentInstructionIndex >= instructions.length) {
      currentInstructionIndex = 0;
    }
  }
  return steps;
}

async function part2(): Promise<number> {
  const input = await getInput(8);

  const instructions = input[0].split("");
  input.shift();
  input.shift();
  const tree = buildTree(input);

  const startNodes = Object.keys(tree).filter((key) => key.endsWith("A"));
  console.log(startNodes);

  const distances: number[] = [];

  for (const node of startNodes) {
    let steps = 0;
    let currentInstructionIndex = 0;
    let current = node;
    while (!current.endsWith("Z")) {
      const instruction = instructions[currentInstructionIndex];
      current = tree[current][instruction];
      steps++;
      currentInstructionIndex++;
      if (currentInstructionIndex >= instructions.length) {
        currentInstructionIndex = 0;
      }
    }
    distances.push(steps);
  }

  console.log(distances);
  return distances.length;
}

// part1().then(console.log);
part2().then(console.log);
