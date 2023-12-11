import { getSampleInput, getInput } from "../util";

function extrapolate(numbers: number[]): number[] {
  const differences: number[] = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    differences.push(numbers[i + 1] - numbers[i]);
  }

  const diffSet = new Set(differences);
  let diff = differences[0];
  if (diffSet.size > 1) {
    const ext = extrapolate(differences);
    diff = ext[ext.length - 1];
  }

  return [...numbers, numbers[numbers.length - 1] + diff];
}

async function partOne(): Promise<number> {
  const input = await getInput(9);

  let total = 0;
  for (const line of input) {
    const diffs = extrapolate(line.split(" ").map(Number));
    total += diffs[diffs.length - 1];
  }

  return total;
}

function extrapolateBackwards(numbers: number[]): number[] {
  const differences: number[] = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    differences.push(numbers[i + 1] - numbers[i]);
  }

  const diffSet = new Set(differences);
  let diff = differences[0];
  if (diffSet.size > 1) {
    const ext = extrapolateBackwards(differences);
    diff = ext[0];
  }

  return [numbers[0] - diff, ...numbers];
}

async function partTwo(): Promise<number> {
  const input = await getInput(9);

  let total = 0;
  for (const line of input) {
    const diffs = extrapolateBackwards(line.split(" ").map(Number));
    total += diffs[0];
  }

  return total;
}

// partOne().then(console.log);
partTwo().then(console.log);
