import { getSampleInput, getInput } from "../util";

type Range = {
  destinationStart: number;
  sourceStart: number;
  range: number;
};

function parseRange(line: string): Range {
  const parts = line.split(" ");
  return {
    destinationStart: parseInt(parts[0]),
    sourceStart: parseInt(parts[1]),
    range: parseInt(parts[2]),
  };
}

function getRangeMap(
  lines: string[],
  startIndex: number,
): [Map<string, Range>, number] {
  const rangeMap = new Map<string, Range>();

  let index = startIndex;

  while (lines[index] && lines[index].length > 0) {
    const range = parseRange(lines[index]);
    const key = `${range.sourceStart}-${range.sourceStart + range.range - 1}`;
    rangeMap.set(key, range);
    index++;
  }

  return [rangeMap, index];
}

function getReverseRangeMap(
  lines: string[],
  startIndex: number,
): [Map<string, Range>, number] {
  const rangeMap = new Map<string, Range>();

  let index = startIndex;

  while (lines[index] && lines[index].length > 0) {
    const range = parseRange(lines[index]);
    const key = `${range.destinationStart}-${
      range.destinationStart + range.range - 1
    }`;
    rangeMap.set(key, range);
    index++;
  }

  return [rangeMap, index];
}

function findDestination(rangeMap: Map<string, Range>, val: number): number {
  for (const [key, range] of rangeMap.entries()) {
    const [start, end] = key.split("-").map((x) => parseInt(x));
    if (val >= start && val <= end) {
      const diff = val - range.sourceStart;
      return range.destinationStart + diff;
    }
  }

  return val;
}

function findSource(rangeMap: Map<string, Range>, val: number): number {
  for (const [key, range] of rangeMap.entries()) {
    const [start, end] = key.split("-").map((x) => parseInt(x));
    if (val >= start && val <= end) {
      const diff = val - range.destinationStart;
      return range.sourceStart + diff;
    }
  }

  return val;
}

async function part1(): Promise<number> {
  const lines = await getInput(5);

  const seeds = lines[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .map((x) => parseInt(x));

  let index = 3;
  const seedToSoil = getRangeMap(lines, index);
  index = seedToSoil[1] + 2;

  const soilToFertilizer = getRangeMap(lines, index);
  index = soilToFertilizer[1] + 2;

  const fertilizerToWater = getRangeMap(lines, index);
  index = fertilizerToWater[1] + 2;

  const waterToLight = getRangeMap(lines, index);
  index = waterToLight[1] + 2;

  const lightToTemparature = getRangeMap(lines, index);
  index = lightToTemparature[1] + 2;

  const temparatureToHumidity = getRangeMap(lines, index);
  index = temparatureToHumidity[1] + 2;

  const humidityToLocation = getRangeMap(lines, index);
  index = humidityToLocation[1] + 2;

  let lowestSeed = Infinity;

  for (const seed of seeds) {
    let val = findDestination(seedToSoil[0], seed);
    val = findDestination(soilToFertilizer[0], val);
    val = findDestination(fertilizerToWater[0], val);
    val = findDestination(waterToLight[0], val);
    val = findDestination(lightToTemparature[0], val);
    val = findDestination(temparatureToHumidity[0], val);
    val = findDestination(humidityToLocation[0], val);
    if (val < lowestSeed) lowestSeed = val;
  }
  return lowestSeed;
}

async function part2(): Promise<number> {
  const lines = await getInput(5);

  const seeds: [number, number][] = [];

  const seedVals = lines[0].split(":")[1].trim().split(" ").map(Number);

  while (seedVals.length > 0) {
    const start = seedVals.shift();
    const len = seedVals.shift();
    seeds.push([start, start + len - 1]);
  }

  let index = 3;
  const seedToSoil = getReverseRangeMap(lines, index);
  index = seedToSoil[1] + 2;

  const soilToFertilizer = getReverseRangeMap(lines, index);
  index = soilToFertilizer[1] + 2;

  const fertilizerToWater = getReverseRangeMap(lines, index);
  index = fertilizerToWater[1] + 2;

  const waterToLight = getReverseRangeMap(lines, index);
  index = waterToLight[1] + 2;

  const lightToTemparature = getReverseRangeMap(lines, index);
  index = lightToTemparature[1] + 2;

  const temparatureToHumidity = getReverseRangeMap(lines, index);
  index = temparatureToHumidity[1] + 2;

  const humidityToLocation = getReverseRangeMap(lines, index);
  index = humidityToLocation[1] + 2;

  let location = -1;
  let found = false;

  while (!found) {
    location++;
    let val = findSource(humidityToLocation[0], location);
    val = findSource(temparatureToHumidity[0], val);
    val = findSource(lightToTemparature[0], val);
    val = findSource(waterToLight[0], val);
    val = findSource(fertilizerToWater[0], val);
    val = findSource(soilToFertilizer[0], val);
    val = findSource(seedToSoil[0], val);

    for (const [start, end] of seeds) {
      if (val >= start && val <= end) {
        found = true;
      }
    }
  }

  return location;
}

// part1().then(console.log);
part2().then(console.log);
