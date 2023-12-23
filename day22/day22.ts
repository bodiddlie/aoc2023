import { getSampleInput, getInput } from "../util";

type Block = {
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
};

function buildBlocks(input: string[]): Block[] {
  const blocks: Block[] = [];
  for (const line of input) {
    const ends = line.split("~");
    const [startX, startY, startZ] = ends[0].split(",").map(Number);
    const [endX, endY, endZ] = ends[1].split(",").map(Number);
    blocks.push({ startX, startY, startZ, endX, endY, endZ });
  }
  return blocks;
}

function overlaps(block1: Block, block2: Block): boolean {
  return (
    Math.max(block1.startX, block2.startX) <=
      Math.min(block1.endX, block2.endX) &&
    Math.max(block1.startY, block2.startY) <= Math.min(block1.endY, block2.endY)
  );
}

function blocksFall(blocks: Block[]) {
  for (let i = 0; i < blocks.length; i++) {
    const brick = blocks[i];
    let maxZ = 1;
    for (let j = 0; j < i; j++) {
      const check = blocks[j];
      if (overlaps(brick, check)) {
        maxZ = Math.max(maxZ, check.endZ + 1);
      }
    }
    brick.endZ -= brick.startZ - maxZ;
    brick.startZ = maxZ;
  }

  blocks.sort((a, b) => a.startZ - b.startZ);
}

function getSupports(blocks: Block[]): [number[][], number[][]] {
  const kSupportsV = new Array<number[]>(blocks.length)
    .fill(null)
    .map(() => []);
  const vSupportsK = new Array<number[]>(blocks.length)
    .fill(null)
    .map(() => []);

  for (let j = 0; j < blocks.length; j++) {
    const upper = blocks[j];
    for (let i = 0; i < j; i++) {
      const lower = blocks[i];
      if (overlaps(upper, lower) && upper.startZ === lower.endZ + 1) {
        kSupportsV[i].push(j);
        vSupportsK[j].push(i);
      }
    }
  }

  return [kSupportsV, vSupportsK];
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(22);
  const input = await getInput(22);

  const blocks = buildBlocks(input);
  blocks.sort((a, b) => a.startZ - b.startZ);

  blocksFall(blocks);

  let total = 0;

  const [kSupportsV, vSupportsK] = getSupports(blocks);

  kSupportsV.forEach((k) => {
    k.every((j) => vSupportsK[j].length > 1) ? total++ : null;
  });

  return total;
}

async function part2(): Promise<number> {
  // const input = await getSampleInput(22);
  const input = await getInput(22);

  const blocks = buildBlocks(input);
  blocks.sort((a, b) => a.startZ - b.startZ);

  blocksFall(blocks);

  let total = 0;

  const [kSupportsV, vSupportsK] = getSupports(blocks);
  let sum = 0;
  for (let i = 0; i < blocks.length; i++) {
    total = 0;
    const set = new Set();
    set.add(i);

    const sublist = kSupportsV.slice(i);
    sublist.forEach((bricks) => {
      for (const brick of bricks) {
        if (vSupportsK[brick].every((b) => set.has(b))) {
          if (!set.has(brick)) {
            set.add(brick);
            total++;
          }
        }
      }
    });
    sum += total;
  }
  return sum;
}

// part1().then(console.log);
part2().then(console.log);
