import { getSampleInput, getInput } from "../util";

function getDistancePerCycle(time: number): number[] {
  const distances: number[] = [];
  for (let i = 0; i <= time; i++) {
    const runTime = time - i;
    const distance = runTime * i;
    distances.push(distance);
  }
  return distances;
}

async function part1(): Promise<number> {
  const lines = await getInput(6);

  const times = lines[0].split(":")[1].trim().split(/\s+/).map(Number);
  const records = lines[1].split(":")[1].trim().split(/\s+/).map(Number);

  let winCount = 0;

  for (let i = 0; i < times.length; i++) {
    const distances = getDistancePerCycle(times[i]);
    const total = distances.filter((d) => d > records[i]).length;
    winCount = winCount === 0 ? total : winCount * total;
  }

  return winCount;
}

async function part2(): Promise<number> {
  const lines = await getInput(6);

  const time = parseInt(lines[0].split(":")[1].trim().split(/\s+/).join(""));
  const record = parseInt(lines[1].split(":")[1].trim().split(/\s+/).join(""));

  const distances = getDistancePerCycle(time);
  return distances.filter((d) => d > record).length;
}

// part1().then(console.log);
part2().then(console.log);
