import { getSampleInput, getInput } from "../util";

function hash(input: string): number {
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i);
    result *= 17;
    result %= 256;
  }
  return result;
}

async function part1(): Promise<number> {
  const lines = await getSampleInput(15);
  // const lines = await getInput(15);
  const input = lines[0].split(",");

  let total = 0;

  for (const instruction of input) {
    const result = hash(instruction);
    total += result;
  }

  return total;
}

type Lens = {
  label: string;
  focalLength: number;
};

async function part2(): Promise<number> {
  // const lines = await getSampleInput(15);
  const lines = await getInput(15);
  const instructions = lines[0].split(",");

  const map = new Map<number, Lens[]>();

  for (const instruction of instructions) {
    if (instruction.includes("-")) {
      //remove
      const [label] = instruction.split("-");
      const hashValue = hash(label);
      if (map.has(hashValue)) {
        const lenses = map.get(hashValue);
        const index = lenses.findIndex((lens) => lens.label === label);
        if (index !== -1) {
          lenses.splice(index, 1);
        }
      }
    } else if (instruction.includes("=")) {
      const [label, focalLength] = instruction.split("=");
      const hashValue = hash(label);
      if (map.has(hashValue)) {
        const lenses = map.get(hashValue);
        const index = lenses.findIndex((lens) => lens.label === label);
        if (index !== -1) {
          lenses[index].focalLength = parseInt(focalLength);
        } else {
          lenses.push({ label, focalLength: parseInt(focalLength) });
        }
      } else {
        map.set(hashValue, [{ label, focalLength: parseInt(focalLength) }]);
      }
    }
  }

  let total = 0;
  for (const [box, lenses] of map.entries()) {
    for (let i = 0; i < lenses.length; i++) {
      total += (box + 1) * (i + 1) * lenses[i].focalLength;
    }
  }

  console.log(map);

  return total;
}

// part1().then(console.log);
part2().then(console.log);
