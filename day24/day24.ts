import { getSampleInput, getInput } from "../util";

class Hailstone {
  public a: number;
  public b: number;
  public c: number;

  constructor(
    public startX: number,
    public startY: number,
    public startZ: number,
    public vx: number,
    public vy: number,
    public vz: number,
  ) {
    this.a = this.vy;
    this.b = -this.vx;
    this.c = this.vy * this.startX - this.vx * this.startY;
  }
}

function buildHailstones(input: string[]): Hailstone[] {
  const hailstones: Hailstone[] = [];
  for (const line of input) {
    const [x, y, z, vx, vy, vz] = line
      .replace(/@/g, ",")
      .split(", ")
      .map(Number);
    hailstones.push(new Hailstone(x, y, z, vx, vy, vz));
  }
  return hailstones;
}

async function part1(): Promise<number> {
  // const input = await getSampleInput(24);
  const input = await getInput(24);

  const hailstones = buildHailstones(input);

  const min = 200000000000000;
  const max = 400000000000000;

  let total = 0;

  for (let i = 0; i < hailstones.length; i++) {
    const h1 = hailstones[i];
    for (let j = 0; j < i; j++) {
      const h2 = hailstones[j];

      if (h1.a * h2.b === h1.b * h2.a) {
        continue;
      }

      const x = (h1.c * h2.b - h2.c * h1.b) / (h1.a * h2.b - h2.a * h1.b);
      const y = (h1.a * h2.c - h2.a * h1.c) / (h1.a * h2.b - h2.a * h1.b);
      if (x >= min && x <= max && y >= min && y <= max) {
        if (
          (x - h1.startX) * h1.vx >= 0 &&
          (y - h1.startY) * h1.vy >= 0 &&
          (x - h2.startX) * h2.vx >= 0 &&
          (y - h2.startY) * h2.vy >= 0
        ) {
          total++;
        }
      }
    }
  }
  return total;
}

part1().then(console.log);
