import { readFile } from "node:fs/promises";

export function intersection<T>(first: T[], second: T[]): T[] {
  return [...new Set(first.filter((c) => second.includes(c)))];
}

export async function getInput(day: number): Promise<string[]> {
  const contents = await readFile(`day${day}/day${day}-input.txt`, "utf8");
  return contents.split("\n");
}

export function range(start: number, end: number = null): number[] {
  if (!end) {
    end = start;
    start = 0;
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
}

export function modulo(x: number, m: number) {
  return x < 0 ? (x % m) + m : x % m;
}
