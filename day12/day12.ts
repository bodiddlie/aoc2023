import { getSampleInput, getInput } from "../util";

const cache = new Map<string, number>();

function parseInput(input: string): [string, number[]] {
  const split = input.split(" ");
  const map = split[0];
  const counts = split[1].split(",").map(Number);
  return [map, counts];
}

function matches(str: string, pattern: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (pattern[i] === "?") continue;
    if (str[i] !== pattern[i]) return false;
  }
  return true;
}

function findPermutations(map: string, counts: number[]): number {
  const cacheKey = `${counts.join(",")};${map}`;

  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const space = map.length;

  if (counts.length === 1) {
    const result = Array(space - counts[0] + 1)
      .fill(null)
      .map(
        (_, i) =>
          ".".repeat(i) +
          "#".repeat(counts[0]) +
          ".".repeat(space - i - counts[0]),
      )
      .filter((str) => matches(str, map)).length;

    cache.set(cacheKey, result);
    return result;
  }

  const [first, ...rest] = counts;
  const restMinSpace = rest.reduce((a, b) => a + b) + rest.length - 1;
  const firstPossiblePositions = space - restMinSpace - first;

  let result = 0;

  for (let i = 0; i < firstPossiblePositions; i++) {
    const curStr = ".".repeat(i) + "#".repeat(first) + ".";

    if (!matches(curStr, map.slice(0, curStr.length))) {
      continue;
    }
    result += findPermutations(map.slice(curStr.length), rest);
  }

  cache.set(cacheKey, result);
  return result;
}

async function part1(): Promise<number> {
  const input = await getInput(12);

  let permutations = 0;
  for (const line of input) {
    const [map, counts] = parseInput(line);
    permutations += findPermutations(map, counts);
  }

  return permutations;
}

function unfoldMap(map: string, counts: number[]): [string, number[]] {
  const str = map.slice(0);
  const nums = [...counts];

  for (let i = 0; i < 4; i++) {
    map += "?" + str;
    counts.push(...nums);
  }

  return [map, counts];
}

async function part2(): Promise<number> {
  const input = await getInput(12);

  let permutations = 0;
  for (const line of input) {
    const [map, counts] = parseInput(line);
    const [unfoldedMap, unfoldedCounts] = unfoldMap(map, counts);
    permutations += findPermutations(unfoldedMap, unfoldedCounts);
  }

  return permutations;
}

// part1().then(console.log);
part2().then(console.log);
